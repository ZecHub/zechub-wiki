export type ZipStatus =
  | "Final"
  | "Active"
  | "Proposed"
  | "Draft"
  | "Reserved"
  | "Withdrawn"
  | "Obsolete";

export interface Zip {
  num: number;
  title: string;
  status: ZipStatus;
  tags: string[];
  summary?: string | null;
}

