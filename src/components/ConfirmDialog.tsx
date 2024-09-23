import type { Ref } from "preact";

interface ConfirmDialogProps {
  dialogRef: Ref<HTMLDialogElement>;
  onAccept: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  acceptText?: string;
  cancelText?: string;
  disabled?: boolean;
  loading?: boolean;
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
  return (
    <dialog ref={props.dialogRef} class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <h3 class="font-bold text-lg font-sans">{props.title}</h3>
        <p class="font-sans">
          {props.message}
        </p>
        <div class="modal-action">
          <button class="btn btn-ghost" type="button" onClick={props.onCancel}>
            {props.cancelText ?? "Cancelar"}
          </button>
          <button
            class="btn btn-primary"
            type="button"
            onClick={props.onAccept}
          >
            {props.acceptText ?? "Aceptar"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
