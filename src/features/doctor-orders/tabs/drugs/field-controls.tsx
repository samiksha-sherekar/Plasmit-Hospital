"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";

import { doseUnits, forms, frequencies, orderCategories, routes } from "./data";
import type { DraftCategory, OrderDraft } from "./types";

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-medium text-muted-foreground">{children}</span>;
}

export function SelectField<T extends string>({ value, options, onChange }: { value: T; options: T[]; onChange: (value: T) => void }) {
  return (
    <select
      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/20"
      value={value}
      onChange={(event) => onChange(event.target.value as T)}
    >
      <option value="">Select</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function CategoryRadioGroup({ value, onChange }: { value: DraftCategory; onChange: (category: DraftCategory) => void }) {
  return (
    <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-5">
      {orderCategories.map((category) => (
        <label
          key={category}
          className={[
            "flex min-h-9 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition",
            value === category ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background text-muted-foreground hover:bg-surface-muted",
          ].join(" ")}
        >
          <input type="radio" name="drug-category" className="h-4 w-4" checked={value === category} onChange={() => onChange(category)} />
          {category}
        </label>
      ))}
    </div>
  );
}

export function DrugDraftFields({
  draft,
  flash,
  onChange,
}: {
  draft: OrderDraft;
  flash: boolean;
  onChange: (values: Partial<OrderDraft>) => void;
}) {
  const today = React.useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }, []);
  const endDateMin = draft.startDate || today;
  const showFrequency = Boolean(draft.category) && draft.category !== "SOS" && draft.category !== "Unscheduled";
  const showDays = Boolean(draft.category) && draft.category !== "Continuous" && draft.category !== "Unscheduled";
  const showStartDate = Boolean(draft.category) && draft.category !== "SOS" && draft.category !== "Unscheduled";
  const showMaxDosage = draft.category === "SOS";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <FieldLabel>Category</FieldLabel>
        <CategoryRadioGroup value={draft.category} onChange={(category) => onChange({ category })} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <FieldLabel>Drug Name</FieldLabel>
          <Input value={draft.name} readOnly className="bg-surface-muted" />
        </label>
        <label className="space-y-2">
          <FieldLabel>Form</FieldLabel>
          <SelectField value={draft.form} options={forms} onChange={(form) => onChange({ form })} />
        </label>
        <label className="space-y-2">
          <FieldLabel>Dosage</FieldLabel>
          <div className="grid grid-cols-[1fr_110px] gap-2">
            <Input value={draft.dosage} onChange={(event) => onChange({ dosage: event.target.value })} />
            <SelectField value={draft.doseUnit} options={doseUnits} onChange={(doseUnit) => onChange({ doseUnit })} />
          </div>
        </label>
        <label className="space-y-2">
          <FieldLabel>Route</FieldLabel>
          <SelectField value={draft.route} options={routes} onChange={(route) => onChange({ route })} />
        </label>
        {showMaxDosage ? (
          <label className="space-y-2">
            <FieldLabel>Max Dosage</FieldLabel>
            <Input value={draft.maxDosage} onChange={(event) => onChange({ maxDosage: event.target.value })} />
          </label>
        ) : null}
        {showFrequency ? (
          <label className="space-y-2">
            <FieldLabel>Frequency</FieldLabel>
            <SelectField value={draft.frequency} options={frequencies} onChange={(frequency) => onChange({ frequency })} />
          </label>
        ) : null}
        {showDays ? (
          <label className="space-y-2">
            <FieldLabel>No. of Days</FieldLabel>
            <Input type="number" min={0} value={draft.days} onChange={(event) => onChange({ days: event.target.value })} />
          </label>
        ) : null}
        {showStartDate ? (
          <label className="space-y-2">
            <FieldLabel>Start Date</FieldLabel>
            <Input type="date" min={today} value={draft.startDate} onChange={(event) => onChange({ startDate: event.target.value })} />
          </label>
        ) : null}
        {draft.category === "Scheduled" || draft.category === "Intermittent" ? (
          <label className="space-y-2">
            <FieldLabel>End Date</FieldLabel>
            <Input type="date" min={endDateMin} value={draft.endDate} onChange={(event) => onChange({ endDate: event.target.value })} />
          </label>
        ) : null}
        <label className="space-y-2">
          <FieldLabel>Total Qty</FieldLabel>
          <Input
            type="number"
            min={0}
            className={flash ? "border-success bg-success/10 ring-2 ring-success/20 transition" : "transition"}
          value={draft.orderedQty}
          onChange={(event) => onChange({ orderedQty: event.target.value })}
        />
        </label>
        <label className="space-y-2 sm:col-span-2">
          <FieldLabel>Instructions</FieldLabel>
          <Input value={draft.instructions} onChange={(event) => onChange({ instructions: event.target.value })} />
        </label>
        {/* Tapered dose field is intentionally hidden for now. */}
      </div>
    </div>
  );
}
