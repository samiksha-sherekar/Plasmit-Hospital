export type DrugCategory = "Scheduled" | "SOS" | "Intermittent" | "Continuous" | "Discontinued" | "Unscheduled";
export type DraftCategory = Exclude<DrugCategory, "Discontinued"> | "";
export type DoseUnit = "" | "mg" | "mcg" | "g" | "ml" | "units" | "drops" | "puffs";

export type DrugOrder = {
  id: string;
  name: string;
  form: string;
  dosage: string;
  maxDosage: string;
  frequency: string;
  days: string;
  startDate: string;
  endDate: string;
  instructions: string;
  category: DrugCategory;
  orderedQty: number;
  dispensedQty: number;
  receivedQty: number;
  administeredQty: number;
  discontinuedReason?: string;
  isHistorical?: boolean;
  modifiedFromId?: string;
};

export type OrderDraft = {
  name: string;
  form: string;
  dosage: string;
  maxDosage: string;
  frequency: string;
  days: string;
  startDate: string;
  endDate: string;
  instructions: string;
  category: DraftCategory;
  orderedQty: string;
  route: string;
  doseUnit: DoseUnit;
};
