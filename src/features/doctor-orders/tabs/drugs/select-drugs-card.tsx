"use client";

import * as React from "react";
import { ChevronDown, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import type { DrugOrder } from "./types";

export function SelectDrugsCard({
  orders,
  selectedOrders,
  selectedIds,
  search,
  onSearchChange,
  onToggleDrug,
}: {
  orders: DrugOrder[];
  selectedOrders: DrugOrder[];
  selectedIds: string[];
  search: string;
  onSearchChange: (value: string) => void;
  onToggleDrug: (order: DrugOrder, checked: boolean) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Card className="xl:sticky xl:top-4 xl:self-start">
      <CardHeader>
        <div>
          <CardTitle>Select Drugs</CardTitle>
          <CardDescription>Search and tick drugs to add them into the order summary.</CardDescription>
        </div>
        {/* <Badge tone="info">{selectedIds.length} Selected</Badge> */}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative">
          <button
            type="button"
            className="flex h-10 w-full items-center justify-between gap-3 rounded-md border border-input bg-background px-3 text-left text-sm text-foreground outline-none transition hover:bg-surface-muted focus:ring-2 focus:ring-ring/20"
            onClick={() => setOpen((current) => !current)}
          >
            <span className={selectedIds.length ? "text-foreground" : "text-muted-foreground"}>
              {selectedIds.length ? `${selectedIds.length} drug(s) selected` : "Select drugs"}
            </span>
            <ChevronDown className={["h-4 w-4 text-muted-foreground transition", open ? "rotate-180" : ""].join(" ")} />
          </button>

          {open ? (
            <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-md border border-border bg-surface p-2 shadow-lg">
              <div className="relative mb-2">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search ordered drugs..." autoFocus />
              </div>
              <div className="max-h-[360px] space-y-2 overflow-auto pr-1">
                {orders.length ? (
                  orders.map((order) => {
                    const checked = selectedIds.includes(order.id);
                    return (
                      <label
                        key={order.id}
                        className={[
                          "flex cursor-pointer items-start gap-3 rounded-md border p-3 transition",
                          checked ? "border-primary bg-primary/10" : "border-border bg-background hover:bg-surface-muted",
                        ].join(" ")}
                      >
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-ring"
                          checked={checked}
                          onChange={(event) => onToggleDrug(order, event.target.checked)}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold text-foreground">{order.name}</div>
                          <div className="mt-1 text-xs text-muted-foreground">{order.form}</div>
                        </div>
                      </label>
                    );
                  })
                ) : (
                  <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">No drugs match the search.</div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {selectedIds.length ? (
          <div className="space-y-2">
            {selectedOrders.map((order) => {
              return (
                <div key={order.id} className="rounded-md border border-border bg-surface-muted px-3 py-2">
                  <div className="truncate text-sm font-medium text-foreground">{order.name}</div>
                  <div className="text-xs text-muted-foreground">{order.form}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">No drugs selected.</div>
        )}
      </CardContent>
    </Card>
  );
}
