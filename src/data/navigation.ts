import {
  Archive,
  Ban,
  Bell,
  ClipboardCheck,
  Droplet,
  History,
  FlaskConical,
  LayoutDashboard,
  ListChecks,
  ListPlus,
  Pill,
  ScanSearch,
  Search,
  Settings,
  SlidersHorizontal,
} from "lucide-react";

import type { NavigationItem, Role } from "@/types";

export const roles: Role[] = [
  "Super Admin",
  "Hospital Admin",
  "Doctor",
  "Nurse",
  "Blood Bank",
  "Receptionist",
  "Lab Technician",
  "Radiologist",
  "Pharmacist",
  "Billing Executive",
  "HR Manager",
  "Management",
];

const allRoles = roles;
export const navigationItems: NavigationItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, route: "/dashboard", group: "Command", allowedRoles: allRoles, status: "ready" },
  { id: "orders", label: "Orders", icon: ScanSearch, route: "/doctor/orders", group: "Doctor", allowedRoles: ["Doctor"], status: "ready" },
  { id: "prescription", label: "Prescription", icon: Pill, route: "/doctor/prescription", group: "Doctor", allowedRoles: ["Doctor"], status: "ready" },
  { id: "active-order", label: "Active Order", icon: Archive, route: "/nurse/active-order", group: "Nurse", allowedRoles: ["Nurse"], status: "ready" },
  { id: "drug-administration", label: "Drug Administration", icon: Pill, route: "/nurse/drug-administration", group: "Nurse", allowedRoles: ["Nurse"], status: "ready" },
  { id: "completed-order", label: "Completed Orders", icon: ClipboardCheck, route: "/nurse/completed-order", group: "Nurse", allowedRoles: ["Nurse"], status: "ready" },
  { id: "discontinued-order", label: "Discontinued Orders", icon: Ban, route: "/nurse/discontinued-order", group: "Nurse", allowedRoles: ["Nurse"], status: "ready" },
  { id: "ldt-management", label: "LDT Management", icon: ListPlus, route: "/nurse/ldt-management", group: "Nurse", allowedRoles: ["Nurse"], status: "ready" },
  { id: "pharmacist-drug-dispense", label: "Drug Dispense", icon: Pill, route: "/pharmacist/drug-dispense", group: "Pharmacist", allowedRoles: ["Pharmacist"], status: "ready" },
  { id: "pharmacist-drug-dispense-history", label: "Drug Dispense History", icon: History, route: "/pharmacist/drug-dispense-history", group: "Pharmacist", allowedRoles: ["Pharmacist"], status: "ready" },
  { id: "blood-request", label: "Blood Requests", icon: Droplet, route: "/blood-bank/blood-request", group: "Blood Bank", allowedRoles: ["Blood Bank"], status: "ready" },
  { id: "hospital-admin-ldt", label: "LDT", icon: FlaskConical, route: "/hospital-admin/ldt", group: "Hospital Admin", allowedRoles: ["Hospital Admin"], status: "ready" },
  // { id: "hospital-admin-properties", label: "Properties Configuration", icon: SlidersHorizontal, route: "/hospital-admin/properties-configuration", group: "Hospital Admin", allowedRoles: ["Hospital Admin"], status: "ready" },
  // { id: "hospital-admin-assessment", label: "Assessment Configuration", icon: ListChecks, route: "/hospital-admin/assessment-configuration", group: "Hospital Admin", allowedRoles: ["Hospital Admin"], status: "ready" },
];

// export const navigationItems: NavigationItem[] = [
//   { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, route: "/dashboard", group: "Command", allowedRoles: allRoles, status: "ready" },
//   { id: "search", label: "Global Search", icon: Search, route: "/search", group: "Command", allowedRoles: allRoles, status: "ready" },
//   { id: "notifications", label: "Notifications", icon: Bell, route: "/notifications", group: "Command", allowedRoles: allRoles, status: "ready" },
//   { id: "radiology", label: "Radiology", icon: ScanSearch, route: "/radiology", group: "Radiology", allowedRoles: ["Super Admin", "Hospital Admin", "Doctor", "Nurse", "Receptionist", "Radiologist", "Billing Executive", "Management"], status: "ready" },
//   { id: "settings", label: "UI Settings", icon: Settings, route: "/settings/ui", group: "Command", allowedRoles: allRoles, status: "ready" },
//   { id: "preview", label: "Components Preview", icon: Archive, route: "/components-preview", group: "Command", allowedRoles: ["Super Admin", "Hospital Admin"], status: "ready" },
// ];

export const dashboardQuickActions = [
  { id: "radiology", label: "Open radiology", icon: ScanSearch, route: "/radiology" },
  { id: "radiology-orders", label: "Radiology orders", icon: ScanSearch, route: "/radiology/orders" },
  { id: "radiology-reports", label: "Radiology reports", icon: ScanSearch, route: "/radiology/reports" },
  { id: "radiology-schedule", label: "Radiology schedule", icon: ScanSearch, route: "/radiology/schedule" },
];
