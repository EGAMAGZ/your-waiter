import { type Signal, useSignalEffect } from "@preact/signals";
import ConfirmDialog from "./ConfirmDialog";
import { useRef } from "preact/hooks";
import type { ApiResponse } from "@/schema/api-response";

interface Props {
  id: Signal<number | null>;
  onAccept: () => void;
  url: string;
  title: string;
  message: string;
}

export default function DeleteDialog(props: Props) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useSignalEffect(() => {
    if (props.id.value) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  });

  const deleteElement = async () => {
    const response = await fetch(`${props.url}/${props.id.value}`, {
      method: "DELETE",
    });

    const { error, message } = await response.json() as ApiResponse<
      number
    >;

    if (error) {
      console.log(message);
      return;
    }

    props.onAccept();
  };

  const handleAccept = async () => {
    await deleteElement();

    props.id.value = null;
  };

  const handleCancel = () => {
    props.id.value = null;
  };

  return (
    <ConfirmDialog
      dialogRef={dialogRef}
      title={props.title}
      message={props.message}
      onAccept={handleAccept}
      onCancel={handleCancel}
    />
  );
}
