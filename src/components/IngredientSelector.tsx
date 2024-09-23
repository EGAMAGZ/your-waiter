import type { Dish } from "@/schema/dish";
import { useSignal } from "@preact/signals";
import { useRef } from "preact/hooks";
import AddIngredientDialog from "./AddIngredientDialog";
import type { Ingredient } from "@/schema/ingredient";

interface Props {
  dishesId?: number[];
}

export default function IngredientSelector({ dishesId }: Props) {
  const ingredients = useSignal<Ingredient[]>([]);

  const addDishDialogRef = useRef<HTMLDialogElement>(null);

  const handleAddIngredient = () => {
    addDishDialogRef.current?.close();
  };

  const handleCancelAddIngredient = () => {
    addDishDialogRef.current?.close();
  };

  const openAddIngredientDialog = () => {
    addDishDialogRef.current?.showModal();
  };

  return (
    <>
      <AddIngredientDialog
        dialogRef={addDishDialogRef}
        onCancel={handleCancelAddIngredient}
        onAdd={handleAddIngredient}
        selectedIngredients={ingredients}
      />
      <div class="form-control">
        <div class="label">
          <span class="label-text">Ingredientes extras seleccionados</span>

          <button
            class="btn btn-sm btn-secondary btn-circle"
            type="button"
            onClick={openAddIngredientDialog}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-4 h-4 icon icon-tabler icons-tabler-outline icon-tabler-plus"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 5l0 14" />
              <path d="M5 12l14 0" />
            </svg>
          </button>
        </div>
        <div class="bg-gray-300 overscroll-x-auto p-4 flex flex-col gap-2 rounded">
          {ingredients.value.length === 0 && (
            <span class="text-center font-semibold">
              No se han seleccionado ingredientes
            </span>
          )}

          {ingredients.value.map((ingredient) => (
            <IngredientOption ingredient={ingredient} onClick={() => {}} />
          ))}
        </div>
      </div>
    </>
  );
}

interface OptionProps {
  ingredient: Ingredient;
  onClick: () => void;
}

function IngredientOption(props: OptionProps) {
  return (
    <div class="flex flex-row items-center">
      <input type="hidden" name="ingredients" value={props.ingredient.id} />
      <span class="text-lg grow">
        {props.ingredient.name}
      </span>
      <button
        class="btn btn-square btn-ghost"
        type="button"
        onClick={props.onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon icon-tabler icons-tabler-outline icon-tabler-trash"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M4 7l16 0" />
          <path d="M10 11l0 6" />
          <path d="M14 11l0 6" />
          <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
          <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
        </svg>
      </button>
    </div>
  );
}
