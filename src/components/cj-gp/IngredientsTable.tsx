import type { Ingredient } from "@/schema/ingredient";
import { type Signal, useSignal, useSignalEffect } from "@preact/signals";
import SearchIngredients from "./SearchIngredients";
import type { ApiResponse } from "@/schema/api-response";

export default function IngredientsTable() {
  const ingredients = useSignal<Ingredient[]>([]);

  useSignalEffect(() => {
    const getAllIngredients = async () => {
      const response = await fetch("/api/ingredient/search");

      const { data, error } = await response.json() as ApiResponse<
        Ingredient[]
      >;

      if (error) {
        console.log(error);
        return;
      }

      ingredients.value = data;
    };

    getAllIngredients();
  });

  return (
    <div class="flex flex-col gap-2">
      <div class="flex flex-row justify-between">
        <SearchIngredients ingredients={ingredients} />
      </div>
      <div class="overscroll-x-auto">
        <table class="table table-zebra table-pin-cols">
          <thead>
            <tr>
              <th>
                Ingrediente
              </th>
              <th>
                Precio
              </th>
              <th>
                Editar
              </th>
              <th>
                Eliminar
              </th>
            </tr>
          </thead>
          <tbody>
            {ingredients.value.map((ingredient) => (
              <tr>
                <th>
                  {ingredient.name}
                </th>
                <td>
                  {ingredient.price}
                </td>

                <td>
                  <button class="btn btn-ghost">
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
                      class="icon icon-tabler icons-tabler-outline icon-tabler-edit"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                      <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                      <path d="M16 5l3 3" />
                    </svg>
                  </button>
                </td>

                <td>
                  <button class="btn btn-ghost">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
