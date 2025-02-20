export interface Field {
  id?: string;
  label: string;
  type: "TEXT" | "TEXTAREA" | "DROPDOWN";
  options?: string[];
  order: number;
}

export interface Template {
  id: string;
  name: string;
  fields: Field[];
}
