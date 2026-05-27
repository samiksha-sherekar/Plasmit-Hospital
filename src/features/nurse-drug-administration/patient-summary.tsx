import type * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-surface-muted p-3">
      <div className="text-xs font-medium text-muted-foreground">{label}:</div>
      <div className="text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

export function NurseMedicationPatientSummary() {
  return (
    <Card>
      <CardContent className="grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-5">
        <DetailItem label="Patient Name" value="Rahul Sharma" />
        <DetailItem label="Age/Gender" value="45 / Male" />
        {/* <DetailItem label="Ward/Bed" value="ICU-2" /> */}
        <DetailItem label="Allergy" value={<Badge tone="warning">NSAID caution</Badge>} />
        {/* <DetailItem label="Shift" value="Morning" /> */}
      </CardContent>
    </Card>
  );
}
