"use client";

import { Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { DrugOrder, OrderDraft } from "./types";
import { categoryTone } from "./utils";

export function SummaryCard({
  orders,
  drafts,
  onEdit,
  onDelete,
}: {
  orders: DrugOrder[];
  drafts: Record<string, OrderDraft>;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Card className="col-span-full xl:col-span-2">
      <CardHeader>
        <div>
          <CardTitle>Summary</CardTitle>
          <CardDescription>Selected drug details update here in real time.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {!orders.length ? (
          <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">Select drugs from the left card to build the order summary.</div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="max-w-full overflow-x-auto">
              <table className="w-full min-w-[1040px] border-collapse text-left text-sm">
                <thead className="bg-surface-muted text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="border-b border-border px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">Drug</th>
                    <th className="border-b border-border px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">Category</th>
                    <th className="border-b border-border px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">Form</th>
                    <th className="border-b border-border px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">Route</th>
                    <th className="border-b border-border px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">Dosage</th>
                    <th className="border-b border-border px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">Frequency</th>
                    <th className="border-b border-border px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">Days</th>
                    <th className="border-b border-border px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">Total Qty</th>
                    <th className="border-b border-border px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">Instruction</th>
                    <th className="border-b border-border px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const draft = drafts[order.id];
                    if (!draft) return null;
                    return (
                      <tr key={order.id} className="border-b border-border last:border-0">
                        <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)] font-medium">{draft.name}</td>
                        <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                          {draft.category ? <Badge tone={categoryTone(draft.category)}>{draft.category}</Badge> : <Badge tone="muted">-</Badge>}
                        </td>
                        <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">{draft.form || "-"}</td>
                        <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">{draft.route || "-"}</td>
                        <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                          {draft.dosage ? `${draft.dosage} ${draft.doseUnit}` : draft.maxDosage || "-"}
                        </td>
                        <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                          {!draft.category || draft.category === "Unscheduled" || draft.category === "SOS" ? "-" : draft.frequency || "-"}
                        </td>
                        <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">{draft.category === "Unscheduled" ? "-" : draft.days || "-"}</td>
                        <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)] font-semibold">{draft.orderedQty || "-"}</td>
                        <td className="max-w-64 truncate px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">{draft.instructions || "-"}</td>
                        <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                          <div className="flex justify-end gap-2">
                            <Button size="icon" variant="outline" onClick={() => onEdit(order.id)} aria-label={`Edit ${draft.name}`}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="icon" variant="outline" onClick={() => onDelete(order.id)} aria-label={`Delete ${draft.name}`}>
                              <Trash2 className="h-3.5 w-3.5" />
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
        )}
      </CardContent>
    </Card>
  );
}
