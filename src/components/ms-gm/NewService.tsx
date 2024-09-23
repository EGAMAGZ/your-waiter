import type { ApiResponse } from "@/schema/api-response";
import type { Table } from "@/schema/table";
import { useSignal, useSignalEffect } from "@preact/signals";
import type { Ref } from "preact";
import type { ChangeEvent } from "preact/compat";
import { useRef } from "preact/hooks";

export default function NewService() {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const handleClick = () => {
    dialogRef.current?.showModal();
  };

  const handleCancel= () => {
	  dialogRef.current?.close();
  }

  return (
    <>
      <TableDialog dialogRef={dialogRef} onCancel={handleCancel} />
      <button class="btn btn-primary" type="button" onClick={handleClick}>
        Nuevo Servicio
      </button>
    </>
  );
}

interface DialogProps {
  dialogRef: Ref<HTMLDialogElement>;
  onCancel: () => void;
}
function TableDialog(props: DialogProps) {
  const tables = useSignal<Table[]>([]);

  const selectedTable = useSignal<number | null>(null);

  useSignalEffect(() => {
    const getTables = async () => {
      const response = await fetch("/api/table/available");

      const { data, error } = await response.json() as ApiResponse<Table[]>;

      if (error) return;

      tables.value = data;
    };

    getTables();
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;

    selectedTable.value = Number(value);
  };

  const startService = () => {
    if (selectedTable.value) {
      window.location.replace(`/manage-tables/new/${selectedTable.value}`);
    }
  };

  return (
    <dialog class="modal" ref={props.dialogRef}>
      <div class="modal-box">
        <span class="text-xl font-semibold">
          Seleccionar mesa para iniciar servicio
        </span>
        <div onChange={handleChange}>
          {tables.value.map((table) => (
            <div class="form-control">
              <label class="label">
                <span>Mesa {table.nu_mesa}</span>
                <input
                  type="radio"
                  name="table"
                  value={table.id_mesa}
                  class="radio"
                />
              </label>
            </div>
          ))}
        </div>
        <div class="modal-action">
          <button class="btn btn-ghost" onClick={props.onCancel}>
            Cancelar
          </button>
          <button class="btn btn-primary" onClick={startService}>
            Selección terminada
          </button>
        </div>
      </div>
    </dialog>
  );
}
