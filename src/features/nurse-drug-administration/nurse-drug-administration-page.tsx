"use client";

import * as React from "react";
import { Pill, UserRound } from "lucide-react";

import { useRole } from "@/components/providers/role-provider";
import { PageHeader } from "@/components/shell/page-header";
import { AlertBanner } from "@/components/ui/alert-banner";
import { EmptyState } from "@/components/ui/empty-state";
import type { Role } from "@/types";

import { AdministrationTimeline } from "./administration-timeline";
import { defaultAdministrationDetail, defaultFluidDetail, nurseDrugOrders } from "./data";
import { AdministrationDetailsPanel, FluidAdministrationDetailsPanel } from "./detail-panels";
import { NurseMedicationPatientSummary } from "./patient-summary";
import type { AdministrationCell, AdministrationDetail, FluidAdministrationDetail, NurseDrugOrder } from "./types";

const nurseRoles: Role[] = ["Nurse", "Super Admin", "Hospital Admin"];

function formatCurrentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function formatCurrentDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function buildAdministrationDetail(order: NurseDrugOrder, selectedDate: string, cell?: AdministrationCell): AdministrationDetail {
  const isOverdue = cell?.status === "overdue";
  return {
    ...defaultAdministrationDetail,
    orderId: order.id,
    orderName: order.name,
    category: order.category,
    administrationDate: selectedDate,
    dosage: cell?.label?.replace("Overdue ", "") || order.dosage,
    time: formatCurrentTime(),
    lastAdministeredAt: order.lastAdministeredAt ?? "",
    lastAdministeredBy: order.lastAdministeredBy ?? "",
    action: isOverdue ? "Late administered" : "Administered",
    reason: isOverdue ? "Scheduled dose overdue by more than 1 hour" : "",
    counterChecked: false,
    counterCheckedBy: "",
    counterCheckedAt: "",
  };
}

function buildFluidDetail(order: NurseDrugOrder, selectedDate: string): FluidAdministrationDetail {
  const bagVolume = order.bagVolume ?? 500;
  const volumeAdministered = order.administeredVolume ?? 0;
  const volumeRemaining = Math.max(bagVolume - volumeAdministered, 0);

  return {
    ...defaultFluidDetail,
    orderId: order.id,
    orderName: order.name,
    category: order.category,
    administrationDate: selectedDate,
    rate: order.dosage,
    time: formatCurrentTime(),
    lastAdministeredAt: order.lastAdministeredAt ?? "",
    lastAdministeredBy: order.lastAdministeredBy ?? "",
    bagVolume: String(bagVolume),
    volumeAdministered: String(volumeAdministered),
    volumeRemaining: String(volumeRemaining),
    newBag: false,
    bagCount: String(order.bagCount ?? 1),
    bolusDose: order.bolusDose ?? "",
    counterChecked: false,
    counterCheckedBy: "",
    counterCheckedAt: "",
  };
}

export function NurseDrugAdministrationPage() {
  const { role } = useRole();
  const allowed = nurseRoles.includes(role);
  const [administrationDetail, setAdministrationDetail] = React.useState<AdministrationDetail>(defaultAdministrationDetail);
  const [fluidDetail, setFluidDetail] = React.useState<FluidAdministrationDetail>(defaultFluidDetail);
  const [administrationOpen, setAdministrationOpen] = React.useState(false);
  const [fluidOpen, setFluidOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(formatCurrentDate);
  const today = React.useMemo(formatCurrentDate, []);

  const displayedOrders = React.useMemo(() => {
    if (selectedDate < today) {
      return nurseDrugOrders.map((order) => ({
        ...order,
        lastAdministeredAt: order.lastAdministeredAt || "Yesterday 22:00",
        cells: order.cells.map((cell) => ({
          ...cell,
          label: cell.label?.replace("Overdue ", "") ?? (cell.status === "infusion" ? `${order.dosage} infusion` : undefined),
          status: cell.status === "empty" ? cell.status : ("administered" as const),
        })),
      }));
    }

    if (selectedDate > today) {
      return nurseDrugOrders.map((order) => ({
        ...order,
        lastAdministeredAt: "",
        lastAdministeredBy: "",
        administeredVolume: 0,
        cells: order.cells.map((cell) => ({
          ...cell,
          label: cell.status === "infusion" ? `${order.dosage} planned` : cell.label?.replace("Overdue ", ""),
          status: cell.status === "empty" ? cell.status : ("due" as const),
        })),
      }));
    }

    return nurseDrugOrders;
  }, [selectedDate, today]);

  if (!allowed) {
    return (
      <EmptyState
        icon={UserRound}
        title="Nurse access required"
        description="Switch to Nurse role to open drug administration."
      />
    );
  }

  const handleCellSelect = (order: NurseDrugOrder, cell?: AdministrationCell) => {
    if (order.category === "Continuous" || order.form === "IV Fluid") {
      setFluidDetail(buildFluidDetail(order, selectedDate));
      setFluidOpen(true);
      return;
    }
    setAdministrationDetail(buildAdministrationDetail(order, selectedDate, cell));
    setAdministrationOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Nursing - Medication Administration"
        title="Drug Administration"
        description="Time-wise MAR view for scheduled, SOS, intermittent, continuous, discontinued, and unscheduled drugs."
      />

      <NurseMedicationPatientSummary />

      <AlertBanner icon={Pill} tone="info" title="Administration safety">
        Select a time slot to review administration details, counter-check requirements, overdue status, and fluid bag information before accepting.
      </AlertBanner>

      <AdministrationTimeline
        orders={displayedOrders}
        selectedDate={selectedDate}
        today={today}
        onDateChange={setSelectedDate}
        onCellSelect={handleCellSelect}
      />
      <AdministrationDetailsPanel
        open={administrationOpen}
        detail={administrationDetail}
        onOpenChange={setAdministrationOpen}
        onChange={setAdministrationDetail}
      />
      <FluidAdministrationDetailsPanel open={fluidOpen} detail={fluidDetail} onOpenChange={setFluidOpen} onChange={setFluidDetail} />
    </div>
  );
}
