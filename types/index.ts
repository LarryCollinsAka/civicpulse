// ── Enums ──────────────────────────────────────────────────────────────────
export type UserRole =
  | "super_admin"
  | "city_admin"
  | "citizen";

export type IncidentStatus =
  | "open"
  | "assigned"
  | "in_progress"
  | "resolved"
  | "closed";

export type IncidentSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type NotificationChannel =
  | "whatsapp"
  | "sms"
  | "email"
  | "push";

// ── Core entities ──────────────────────────────────────────────────────────
export interface City {
  id: string;
  name: string;
  country: string;
  centroid?: { lat: number; lng: number };
  config: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
}

export interface User {
  id: string;
  city_id: string | null;
  email: string | null;
  phone: string | null;
  whatsapp_id: string | null;
  role: UserRole;
  full_name: string | null;
  preferred_language: "fr" | "en";
  is_verified: boolean;
  created_at: string;
}

export interface Department {
  id: string;
  city_id: string;
  name: string;
  category: string;
}

export interface Incident {
  id: string;
  city_id: string;
  reporter_id: string;
  assigned_dept_id: string | null;
  title: string;
  description: string;
  category: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  location: { lat: number; lng: number } | null;
  media_urls: string[];
  sdg_numbers: number[];
  ai_summary: string | null;
  ai_confidence: number | null;
  created_at: string;
  resolved_at: string | null;
  reporter?: Pick<User, "id" | "full_name" | "phone">;
  department?: Department;
}

export interface ChatSession {
  id: string;
  user_id: string;
  city_id: string;
  title: string | null;
  summary: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  token_count: number | null;
  created_at: string;
}

// ── API shapes ─────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface APIError {
  detail: string;
  code?: string;
}

export interface IncidentFilters {
  status?: IncidentStatus;
  severity?: IncidentSeverity;
  category?: string;
  sdg_number?: number;
  from_date?: string;
  to_date?: string;
  search?: string;
}