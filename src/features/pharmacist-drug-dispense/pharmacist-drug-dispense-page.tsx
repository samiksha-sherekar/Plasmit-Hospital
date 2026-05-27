"use client";

import * as React from "react";
import { PackageCheck, Pill, UserRound } from "lucide-react";
import { toast } from "sonner";

import { useRole } from "@/components/providers/role-provider";
import { PageHeader } from "@/components/shell/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import type { Role } from "@/types";

import { nurseDrugOrders } from "@/features/nurse-drug-administration/data";
import type { NurseDrugOrder } from "@/features/nurse-drug-administration/types";

const pharmacistRoles: Role[] = ["Pharmacist", "Super Admin", "Hospital Admin"];

function dispenseStatus(order: NurseDrugOrder, nextDispenseQty = order.dispensedQty) {
  if (nextDispenseQty <= 0) return "Pending";
  if (nextDispenseQty < order.orderedQty) return "Partially dispensed";
  return "Dispensed";
}

export function PharmacistDrugDispensePage() {
  const { role } = useRole();
  const allowed = pharmacistRoles.includes(role);
  const [quantities, setQuantities] = React.useState<Record<string, string>>(() =>
    nurseDrugOrders.reduce<Record<string, string>>((acc, order) => {
      acc[order.id] = String(Math.max(order.orderedQty - order.dispensedQty, 0));
      return acc;
    }, {}),
  );

  if (!allowed) {
    return (
      <EmptyState
        icon={UserRound}
        title="Pharmacist access required"
        description="Switch to Pharmacist role to dispense doctor drug orders for nurse receipt."
      />
    );
  }

  const dispense = (order: NurseDrugOrder) => {
    const quantity = Number(quantities[order.id]) || 0;
    if (quantity <= 0) {
      toast.error("Enter dispense quantity");
      return;
    }
    toast.success(`${quantity} quantity dispensed for ${order.name}. Nurse can receive it now.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pharmacist Workspace"
        title="Drug Dispense"
        description="Doctor drug orders are dispensed here before nurse receipt and administration."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-4 w-4 text-primary" />
            Doctor Order Queue
          </CardTitle>
          {/* <CardDescription>Dispensed quantity controls whether the nurse Receive button is enabled.</CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="max-w-full overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left text-sm">
                <thead className="bg-primary text-xs font-semibold uppercase tracking-wide text-primary-foreground">
                  <tr>
                    <th className="border-b border-r border-primary-foreground/20 px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">Drug</th>
                    <th className="border-b border-r border-primary-foreground/20 px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">Category</th>
                    <th className="border-b border-r border-primary-foreground/20 px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">Dose</th>
                    <th className="border-b border-r border-primary-foreground/20 px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">Ordered</th>
                    <th className="border-b border-r border-primary-foreground/20 px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">Dispensed</th>
                    <th className="border-b border-r border-primary-foreground/20 px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">Status</th>
                    <th className="border-b border-primary-foreground/20 px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)] text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {nurseDrugOrders.map((order) => {
                    const quantity = Number(quantities[order.id]) || 0;
                    const status = dispenseStatus(order, quantity);
                    return (
                      <tr key={order.id} className="border-b border-border last:border-0 hover:bg-primary/5">
                        <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                          <div className="font-semibold text-foreground">{order.name}</div>
                          <div className="text-xs text-muted-foreground">{order.form} / {order.route}</div>
                        </td>
                        <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">{order.category}</td>
                        <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">{order.dosage}</td>
                        <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)] font-medium">{order.orderedQty}</td>
                        <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                          <Input
                            className="w-28"
                            type="number"
                            min={0}
                            max={order.orderedQty}
                            value={quantities[order.id] ?? ""}
                            onChange={(event) => setQuantities((current) => ({ ...current, [order.id]: event.target.value }))}
                          />
                        </td>
                        <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                          <Badge tone={status === "Dispensed" ? "success" : status === "Partially dispensed" ? "warning" : "muted"}>{status}</Badge>
                        </td>
                        <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                          <div className="flex justify-end">
                            <Button type="button" size="sm" onClick={() => dispense(order)}>
                              <PackageCheck className="h-4 w-4" />
                              Dispense
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
