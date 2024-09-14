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

export type NavigationOption = {
  path: string;
  name: string;
};

export const navigationOptions: Record<string, NavigationOption[]> = {
  "kitchen": [
    { path: "/manage-orders", name: "Gestionar ordenes" },
    { path: "/dish-availability", name: "Disponibilidad" },
  ],
  "cashier": [
    { path: "/manage-dishes", name: "Gestionar platillo" },
    {
      path: "/manage-bills",
      name: "Gestionar cuentas",
    },
  ],
  "waiter": [
    { path: "/manage-tables", name: "Gestionar mesas" },
  ],
};
