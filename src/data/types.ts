export type Language = "en" | "hi" | "mr";
export type Role = "citizen" | "official" | "contractor";
export type Severity = "critical" | "medium" | "resolved";
export type ComplaintStatus = "received" | "classified" | "routed" | "assigned" | "progress" | "resolved";

export interface TimelineStep { status: ComplaintStatus; at: string; department: string; detail: string; complete: boolean }
export interface Complaint {
  id: string; title: string; description: string; language: Language; category: string; department: string;
  urgency: string; severity: number; severityBand: Severity; status: ComplaintStatus; zone: string; ward: string;
  location: [number, number]; createdAt: string; source: string; contractor: string; verified: boolean;
  clusterId?: string; roadSegmentId?: string; timeline: TimelineStep[];
}
export interface Cluster { id: string; name: string; count: number; category: string; zone: string; location: [number, number]; severity: Severity }
export interface RoadSegment { id: string; name: string; zone: string; healthScore: number; location: [number, number]; expenditure: number; prediction: string; repairs: { date: string; work: string; cost: number; contractor: string }[] }
export interface Asset { id: string; type: string; zone: string; installed: string; expires: string; status: "active" | "due" | "overdue" }
