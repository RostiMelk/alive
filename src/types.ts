export type ComponentStatus =
  | "operational"
  | "degraded_performance"
  | "partial_outage"
  | "major_outage"
  | "under_maintenance";

export type IncidentStatus =
  | "investigating"
  | "identified"
  | "monitoring"
  | "resolved"
  | "postmortem";

export type ImpactLevel = "none" | "minor" | "major" | "critical";
export type OverallIndicator = "none" | "minor" | "major" | "critical";

export type Component = {
  id: string;
  name: string;
  status: ComponentStatus;
  updated_at: string;
  group?: boolean;
  group_id?: string | null;
};

export type IncidentUpdate = {
  id: string;
  status: IncidentStatus;
  body: string;
  created_at: string;
};

export type Incident = {
  id: string;
  name: string;
  status: IncidentStatus;
  impact: ImpactLevel;
  started_at: string;
  updated_at: string;
  incident_updates: IncidentUpdate[];
};

export type SummaryResponse = {
  page: { name: string; url: string; updated_at: string };
  status: { indicator: OverallIndicator; description: string };
  components: Component[];
  incidents?: Incident[];
};

export type ServiceEntry = {
  name: string;
  url: string;
};

export type UserConfig = {
  services: ServiceEntry[];
};
