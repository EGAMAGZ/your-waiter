import NewService from "@/components/ms-gm/NewService";
import TableCard from "./TableCard";
import type { Table } from "@/schema/table";
import { useSignal } from "@preact/signals";

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
      {tables.value.length === 0 && <NoTablesCard />}

      {tables.value.length > 0 && (
        <div class="overflow-x-auto flex flex-row gap-8">
          {tables.value.map((table) => (
            <TableCard key={table.id} table={table} onFree={handleFree} />
          ))}
        </div>
      )}

      <div class="flex justify-end">
        <NewService />
      </div>
    </>
  );
}

function NoTablesCard() {
  return (
    <div class="bg-gray-300 p-4 flex justify-center items-center rounded">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-14 w-14 icon icon-tabler icons-tabler-outline icon-tabler-circle-x"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M10 10l4 4m0 -4l-4 4" />
      </svg>
      <span class="text-center font-semibold text-xl">
        No se ha inicializado servicio a ningun mesa
      </span>
    </div>
  );
}
