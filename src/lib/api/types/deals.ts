export type DealActivityType =
  | "NOTE"
  | "STATUS_CHANGE"
  | "CALL"
  | "EMAIL"
  | "MEETING"
  | "DOCUMENT";

export type ReservationType = "SOFT" | "HARD";

export type CommissionPlanStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "ACTIVE"
  | "ARCHIVED";

export type CalculationType = "PERCENT" | "FIXED";

export type CalculationBase = "EXPECTED_VALUE" | "ACTUAL_VALUE" | "NET_VALUE";

export type SplitType = "PERCENT" | "FIXED";
