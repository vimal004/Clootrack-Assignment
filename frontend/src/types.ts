export interface Ticket {
  id: number;
  title: string;
  description: string;
  category: "billing" | "technical" | "account" | "general";
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "closed";
  created_at: string;
}

export interface TicketStats {
  total_tickets: number;
  open_tickets: number;
  avg_tickets_per_day: number;
  priority_breakdown: Record<string, number>;
  category_breakdown: Record<string, number>;
}

export interface ClassificationResult {
  suggested_category: Ticket["category"];
  suggested_priority: Ticket["priority"];
}
