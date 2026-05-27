"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CheckCircle2, Pill, UserRound, X } from "lucide-react";
import { toast } from "sonner";

import { useRole } from "@/components/providers/role-provider";
import { PageHeader } from "@/components/shell/page-header";
import { AlertBanner } from "@/components/ui/alert-banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Role } from "@/types";

import { AdministrationTimeline } from "./administration-timeline";
import { defaultAdministrationDetail, defaultFluidDetail, nurseDrugOrders } from "./data";
import { AdministrationDetailsPanel, FluidAdministrationDetailsPanel } from "./detail-panels";
import { NurseMedicationPatientSummary } from "./patient-summary";
import type { AdministrationCell, AdministrationDetail, FluidAdministrationDetail, NurseDrugOrder } from "./types";

const nurseRoles: Role[] = ["Nurse", "Super Admin", "Hospital Admin"];
const drugCategories: NurseDrugOrder["category"][] = ["Scheduled", "SOS", "Intermittent", "Continuous", "Discontinued", "Unscheduled"];
type NurseOrderAction = "Receive" | "Discontinue" | "Return" | "Modify";

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

function remainingQty(order: NurseDrugOrder) {
  return Math.max(order.receivedQty - order.administeredQty, 0);
}

function orderStatus(order: NurseDrugOrder) {
  if (order.receivedQty <= 0) return "Pending";
  if (order.receivedQty < order.orderedQty) return "Partially received";
  return "Received";
}

function OrderActionPopup({
  open,
  action,
  order,
  onOpenChange,
}: {
  open: boolean;
  action: NurseOrderAction | "Status" | null;
  order: NurseDrugOrder | null;
  onOpenChange: (open: boolean) => void;
}) {
  if (!order || !action) return null;
  const canReceive = order.dispensedQty > order.receivedQty;

  const accept = () => {
    toast.success(`${action} saved for ${order.name}`);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[88dvh] w-[min(94vw,620px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-soft outline-none">
          <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-3">
            <div>
              <Dialog.Title className="text-sm font-semibold text-foreground">{action}</Dialog.Title>
              <Dialog.Description className="mt-1 text-xs text-muted-foreground">{order.name} / {order.category}</Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button size="icon" variant="ghost" aria-label="Close popup">
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-auto p-4">
            {action === "Status" ? (
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-md border border-border bg-surface-muted p-3">
                  <div className="text-xs text-muted-foreground">Status</div>
                  <div className="mt-1 font-semibold">{orderStatus(order)}</div>
                </div>

                <div className="rounded-md border border-border bg-surface-muted p-3">
                  <div className="text-xs text-muted-foreground">Received</div>
                  <div className="mt-1 font-semibold">
                    {order.receivedQty}/{order.orderedQty}
                  </div>
                </div>

                <div className="rounded-md border border-border bg-surface-muted p-3">
                  <div className="text-xs text-muted-foreground">Administered</div>
                  <div className="mt-1 font-semibold">
                    {order.administeredQty}/{order.receivedQty}
                  </div>
                </div>
              </div>
            ) : null}

            {action === "Receive" ? (
              <div className="space-y-3">
                <div className="rounded-md border border-border bg-surface-muted p-3 text-sm">
                  Pharmacy dispensed {order.dispensedQty} of {order.orderedQty}. Receive is {canReceive ? "enabled" : "disabled"} for this order.
                </div>
                <Input type="number" min={0} max={Math.max(order.dispensedQty - order.receivedQty, 0)} defaultValue={Math.max(order.dispensedQty - order.receivedQty, 0)} aria-label="Receive quantity" />
              </div>
            ) : null}

            {action === "Discontinue" ? (
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground">Reason for Discontinuing</span>
                <Input placeholder="Enter reason" defaultValue={order.discontinuedReason ?? ""} />
              </div>
            ) : null}

            {action === "Return" ? (
              <div className="space-y-3">
                <div className="grid gap-2 sm:grid-cols-4">
                  <div className="rounded-md border border-border bg-surface-muted p-3">
                    <div className="text-xs text-muted-foreground">Received qt</div>
                    <div className="font-semibold">{order.receivedQty}</div>
                  </div>
                  <div className="rounded-md border border-border bg-surface-muted p-3">
                    <div className="text-xs text-muted-foreground">Adm qt</div>
                    <div className="font-semibold">{order.administeredQty}</div>
                  </div>
                  <div className="rounded-md border border-border bg-surface-muted p-3">
                    <div className="text-xs text-muted-foreground">Remaining qt</div>
                    <div className="font-semibold">{remainingQty(order)}</div>
                  </div>
                  <label className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground">Return qt</span>
                    <Input type="number" min={0} max={remainingQty(order)} defaultValue={remainingQty(order)} />
                  </label>
                </div>
              </div>
            ) : null}

            {action === "Modify" ? (
              <div className="space-y-3">
                <label className="space-y-2">
                  <span className="text-xs font-medium text-muted-foreground">Reason for Modifying</span>
                  <Input placeholder="Enter reason" />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground">Start date</span>
                    <Input type="date" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground">End date</span>
                    <Input type="date" />
                  </label>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex justify-end gap-2 border-t border-border bg-surface p-3">
            <Button className="bg-danger" onClick={() => onOpenChange(false)}>Cancel</Button>
            {action === "Status" ? null : (
              <Button onClick={accept} disabled={action === "Receive" && !canReceive}>
                <CheckCircle2 className="h-4 w-4" />
                {action === "Return" ? "Return" : "Accept"}
              </Button>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function DrugOrderReviewTab({ orders }: { orders: NurseDrugOrder[] }) {
  const [activeCategory, setActiveCategory] = React.useState<NurseDrugOrder["category"]>("Scheduled");
  const [popupOrder, setPopupOrder] = React.useState<NurseDrugOrder | null>(null);
  const [popupAction, setPopupAction] = React.useState<NurseOrderAction | "Status" | null>(null);
  const categoryOrders = orders.filter((order) => order.category === activeCategory);

  const openPopup = (order: NurseDrugOrder, action: NurseOrderAction | "Status") => {
    setPopupOrder(order);
    setPopupAction(action);
  };

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
        <Card className="xl:self-start">
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>Review pharmacy receipt and order actions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {drugCategories.map((category) => (
              <button
                key={category}
                type="button"
                className={[
                  "flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition",
                  activeCategory === category ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background text-muted-foreground hover:bg-surface-muted",
                ].join(" ")}
                onClick={() => setActiveCategory(category)}
              >
                <span>{category}</span>
                <span className="text-xs">{orders.filter((order) => order.category === category).length}</span>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{activeCategory}</CardTitle>
            <CardDescription>Status opens detail popup. Action buttons open accept popups.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {categoryOrders.length ? (
              categoryOrders.map((order) => {
                const status = orderStatus(order);
                const canReceive = order.dispensedQty > order.receivedQty;
                return (
                  <div key={order.id} className="rounded-md border border-border bg-surface p-3">
                    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_150px_320px] lg:items-start">
                      <div className="min-w-0 space-y-1">
                        <div className="truncate text-sm font-semibold text-foreground">{order.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {order.form} / {order.dosage || "-"} / {order.frequency || "-"} / {order.days || "-"} days
                        </div>
                        <div className="text-xs text-muted-foreground">Instructions: {order.instructions || "-"} {order.taperedDose ? `(Tapered dose: ${order.taperedDose})` : ""}</div>
                      </div>
                      <div>
                        <div className="mb-1 text-xs font-medium text-muted-foreground">Status</div>
                        <button
                          type="button"
                          title={`Status: ${status}. Received: ${order.receivedQty}/${order.orderedQty}. Administered: ${order.administeredQty}/${order.receivedQty}`}
                          onClick={() => openPopup(order, "Status")}
                        >
                          <Badge tone={status === "Received" ? "success" : status === "Partially received" ? "warning" : "muted"}>{status}</Badge>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                        <Button type="button" size="sm" variant="outline" disabled={!canReceive} title={canReceive ? `Dispensed pending: ${order.dispensedQty - order.receivedQty}` : "Receive disabled after receiving dispensed drugs"} onClick={() => openPopup(order, "Receive")}>Receive</Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => openPopup(order, "Discontinue")}>Discontinue</Button>
                        <Button type="button" size="sm" variant="outline" title={`Remaining quantity: ${remainingQty(order)}`} onClick={() => openPopup(order, "Return")}>Return</Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => openPopup(order, "Modify")}>Modify</Button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">No {activeCategory.toLowerCase()} drug orders found.</div>
            )}
          </CardContent>
        </Card>
      </div>
      <OrderActionPopup open={Boolean(popupOrder && popupAction)} action={popupAction} order={popupOrder} onOpenChange={(open) => !open && setPopupOrder(null)} />
    </>
  );
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

      {/* <AlertBanner icon={Pill} tone="info" title="Administration safety">
        Select a time slot to review administration details, counter-check requirements, overdue status, and fluid bag information before accepting.
      </AlertBanner> */}

      <Tabs defaultValue="drug-order" className="space-y-4">
        <TabsList className="w-full gap-2 overflow-x-auto bg-primary/10 p-1 sm:w-fit">
          <TabsTrigger
            value="drug-order"
            className="min-w-[120px] border border-primary/20 bg-background text-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Drug Order
          </TabsTrigger>
          <TabsTrigger
            value="drug-administration"
            className="min-w-[168px] border border-primary/20 bg-background text-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Drug Administration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="drug-order">
          <DrugOrderReviewTab orders={displayedOrders} />
        </TabsContent>

        <TabsContent value="drug-administration">
          <AdministrationTimeline
            orders={displayedOrders}
            selectedDate={selectedDate}
            today={today}
            onDateChange={setSelectedDate}
            onCellSelect={handleCellSelect}
          />
        </TabsContent>
      </Tabs>
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
