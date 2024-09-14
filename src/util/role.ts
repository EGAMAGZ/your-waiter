import { HOME_URL } from "./constants";

export type Role = {
  id: number;
  name: string;
};

export const rolesName: Record<string, string> = {
  "kitchen": "Cocina",
  "cashier": "Cajero",
  "waiter": "Mesero",
};

export const accessControl = {
  "kitchen": [HOME_URL, "/kitchen"],
  "cashier": [HOME_URL, "/cashier"],
  "waiter": [HOME_URL, "/waiter"],
} as const;
