import type { Table, UpdateTableStatus } from "@/schema/table";
import { Signal, useSignal } from "@preact/signals";
import { type TableStatus } from "@/util/table";
import type { ApiResponse } from "@/schema/api-response";

async function updateTableStatus(
  id: number,
  tableStatus: TableStatus,
  onChanged: (actualStatus: TableStatus) => void,
) {
  const response = await fetch(`/api/table/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      status: tableStatus,
    } as UpdateTableStatus),
  });

  const { error, message } = await response.json() as ApiResponse<TableStatus>;

  if (error) {
    console.log(message);
    return;
  }

  onChanged(tableStatus);
}

interface Props {
  table: Table;
  onFree: (id: number) => void;
}

export default function TableCard({ table, onFree }: Props) {
  const status = useSignal<string>(table.status);
  return (
    <div class="card card-bordered w-[28rem]">
      <div class="card-body">
        <h2 class="card-title text-center">Mesa {table.numberTable}</h2>
        <div class="card-actions justify-between">
          {renderButtons({
            id: table.id,
            status,
            onFree,
          })}
        </div>
      </div>
    </div>
  );
}

interface RenderButtonsProps {
  id: number;
  status: Signal<TableStatus>;
  onFree: (id: number) => void;
}

function renderButtons(
  { status, id, onFree }: RenderButtonsProps,
) {
  switch (status.value) {
    case "busy":
      return <BusyButtons id={id} status={status} onFree={onFree} />;
    case "in_process":
      return <InProcessButtons id={id} status={status} />;
    case "completed":
      return <CompletedButtons id={id} status={status} onFree={onFree} />;
    default:
      return <BusyButtons id={id} status={status} onFree={onFree} />;
  }
}

interface ButtonsProps {
  id: number;
  status: Signal<TableStatus>;
}

function BusyButtons(
  props: ButtonsProps & { onFree: (id: number) => void },
) {
  const handleFree = () => {
    updateTableStatus(props.id, "free", (actualStatus) => {
      props.status.value = actualStatus;
      props.onFree(props.id);
    });
  };

  return (
    <>
      <button class="btn btn-neutral" onClick={handleFree}>
        Liberar mesa
      </button>
      <a href={`/manage-tables/new/${props.id}`} class="btn btn-secondary">
        Continuar pedido
      </a>
    </>
  );
}

function InProcessButtons(props: ButtonsProps) {
  const handleCompleteService = async () => {
    updateTableStatus(props.id, "completed", (actualStatus) => {
      props.status.value = actualStatus;
    });
  };
  return (
    <>
      <a href={`/manage-tables/edit/${props.id}`} class="btn btn-neutral">
        Editar pedido
      </a>
      <button class="btn btn-secondary" onClick={handleCompleteService}>
        Terminar servicio
      </button>
    </>
  );
}

function CompletedButtons(
  props: ButtonsProps & { onFree: (id: number) => void },
) {
  const handleResumeService = () => {
    updateTableStatus(props.id, "in_process", (actualStatus) => {
      props.status.value = actualStatus;
    });
  };

  const handlePrintBill = () => {
    updateTableStatus(props.id, "free", (actualStatus) => {
      props.status.value = actualStatus;
      props.onFree(props.id);
    });
  };

  return (
    <>
      <button class="btn btn-neutral" onClick={handleResumeService}>
        Reanudar servicio
      </button>
      <button class="btn btn-primary" onClick={handlePrintBill}>
        Imprimir cuenta
      </button>
    </>
  );
}
