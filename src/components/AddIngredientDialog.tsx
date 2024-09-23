import type { ApiResponse } from "@/schema/api-response";
import type { Ingredient } from "@/schema/ingredient";
import { Signal, useSignal, useSignalEffect } from "@preact/signals";
import type { Ref } from "preact";
import type { ChangeEvent } from "preact/compat";

interface DialogProps {
  dialogRef: Ref<HTMLDialogElement>;
  onCancel: () => void;
  onAdd: () => void;
  selectedIngredients: Signal<Ingredient[]>;
}

export default function AddIngredientDialog(props: DialogProps) {
  const ingredientsList = useSignal<number[]>([]);

  const ingredients = useSignal<Ingredient[]>([]);

  useSignalEffect(() => {
    const getIngredients = async () => {
      const response = await fetch("/api/ingredient/search");

      const { error, data } = await response.json() as ApiResponse<
        Ingredient[]
      >;
      if (error) {
        return;
      }

      ingredients.value = data;
    };

    getIngredients();
  });

  const handleOnCancel = () => {
    props.onCancel();
  };

  const handleOnAdd = () => {
    props.selectedIngredients.value = ingredients.value.filter((ingredient) =>
      ingredientsList.value.includes(ingredient.id)
    );
    props.onAdd();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.currentTarget;

    if (checked) {
      ingredientsList.value = [...ingredientsList.value, Number(value)];
    } else {
      ingredientsList.value = ingredientsList.value.filter(
        (id) => id !== Number(value),
      );
    }
  };

  return (
    <dialog ref={props.dialogRef} class="modal">
      <div className="modal-box flex flex-col gap-4">
        <span class="text-lg font-semibold">Agregar ingrediente</span>
        {ingredients.value.map((ingredient) => (
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">{ingredient.name}</span>
              <input
                type="checkbox"
                class="checkbox checkbox-primary"
                value={ingredient.id}
                onChange={handleChange}
              />
            </label>
          </div>
        ))}
        <div className="modal-action">
          <button class="btn btn-ghost" onClick={handleOnCancel} type="button">
            Cancelar
          </button>
          <button
            class="btn btn-primary"
            onClick={handleOnAdd}
            type="button"
          >
            Agregar
          </button>
        </div>
      </div>
    </dialog>
  );
}
