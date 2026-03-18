import { c } from "./colors.ts";
import type {
  ComponentStatus,
  OverallIndicator,
  IncidentStatus,
  ImpactLevel,
} from "./types.ts";

type StatusDisplay = { color: string; label: string; icon: string };

const COMPONENT_MAP: Record<ComponentStatus, StatusDisplay> = {
  operational: { color: c.green, label: "operational", icon: "✓" },
  degraded_performance: { color: c.yellow, label: "degraded", icon: "⚠" },
  partial_outage: { color: c.yellow, label: "partial outage", icon: "⚠" },
  major_outage: { color: c.red, label: "major outage", icon: "✗" },
  under_maintenance: { color: c.cyan, label: "maintenance", icon: "⚙" },
};

const OVERALL_MAP: Record<OverallIndicator, StatusDisplay> = {
  none: { color: c.green, label: "none", icon: "✓" },
  minor: { color: c.yellow, label: "minor", icon: "⚠" },
  major: { color: c.red, label: "major", icon: "✗" },
  critical: { color: c.red, label: "critical", icon: "✗" },
};

const INCIDENT_STATUS_COLORS: Record<IncidentStatus, string> = {
  investigating: c.red,
  identified: c.yellow,
  monitoring: c.cyan,
  resolved: c.green,
  postmortem: c.dim,
};

const IMPACT_COLORS: Record<ImpactLevel, string> = {
  none: c.dim,
  minor: c.yellow,
  major: c.red,
  critical: c.red,
};

const FALLBACK: StatusDisplay = { color: c.dim, label: "unknown", icon: "?" };

function componentDisplay(status: ComponentStatus): StatusDisplay {
  return COMPONENT_MAP[status] ?? FALLBACK;
}

export function componentColor(status: ComponentStatus): string {
  return componentDisplay(status).color;
}

export function componentLabel(status: ComponentStatus): string {
  return componentDisplay(status).label;
}

export function componentIcon(status: ComponentStatus): string {
  return componentDisplay(status).icon;
}

export function overallColor(indicator: OverallIndicator): string {
  return (OVERALL_MAP[indicator] ?? FALLBACK).color;
}

export function overallIcon(indicator: OverallIndicator): string {
  return (OVERALL_MAP[indicator] ?? FALLBACK).icon;
}

export function incidentStatusColor(status: IncidentStatus): string {
  return INCIDENT_STATUS_COLORS[status] ?? c.dim;
}

export function impactColor(impact: ImpactLevel): string {
  return IMPACT_COLORS[impact] ?? c.dim;
}
