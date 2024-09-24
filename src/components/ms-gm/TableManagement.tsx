import NewService from "@/components/ms-gm/NewService";
import TableCard from "./TableCard";
import type { Table } from "@/schema/table";
import { useSignal, useSignalEffect } from "@preact/signals";

interface Props {
  initialTables: Table[];
}

export default function TableManagement({ initialTables }: Props) {
  const tables = useSignal<Table[]>(initialTables);

  const handleFree = (id: number) => {
    tables.value = tables.value.filter((table) => table.id !== id);
  };

  return (
    <>
      <div class="overflow-x-auto flex flex-row gap-8">
        {tables.value.map((table) => (
          <TableCard table={table} onFree={handleFree} />
        ))}
      </div>
      <div class="flex justify-end">
        <NewService />
      </div>
    </>
  );
}
