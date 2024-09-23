import type { Table } from "@/schema/table";

interface Props {
  table: Table;
}

export default function TableCard({ table }: Props) {
  return (
    <div class="card card-bordered w-[28rem]">
      <div class="card-body">
        <h2 class="card-title text-center">Mesa {table.nu_mesa}</h2>
        <div class="card-actions justify-between">
          <button class="btn btn-neutral">
            Editar pedido
          </button>
          <button class="btn btn-secondary">
            Terminar servicio
          </button>
        </div>
      </div>
    </div>
  );
}
