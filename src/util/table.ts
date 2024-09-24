export const tableStatus: Record<string, number> = {
  "busy": 1,
  "in_process": 2,
  "completed": 3,
  "free": 4,
};

export type TableStatus = keyof typeof tableStatus;

export function getStatusById(value: number): TableStatus {
  return Object.keys(tableStatus).find((key) => tableStatus[key] === value) ||
    "free";
}
