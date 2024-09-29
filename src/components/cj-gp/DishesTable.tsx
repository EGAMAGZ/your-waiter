import type { Dish } from "@/schema/dish";
import { useSignal, useSignalEffect } from "@preact/signals";
import SearchDishes from "./SearchDishes";
import type { ApiResponse } from "@/schema/api-response";
import DeleteDialog from "../DeleteDialog";

interface Props {
  initialDishes: Dish[];
}

export default function DishesTables({ initialDishes }: Props) {
  const dishes = useSignal<Dish[]>(initialDishes);

  const dishToDelete = useSignal<number | null>(null);

  useSignalEffect(() => {
    const getAllDishes = async () => {
      const response = await fetch("/api/dish/search");

      const { data, error } = await response.json() as ApiResponse<Dish[]>;

      if (error) {
        console.log(error);
        return;
      }
      dishes.value = data;
    };
    getAllDishes();
  });

  const handleAcceptDelete = () => {
    dishes.value = dishes.value.filter((dish) =>
      dish.id !== dishToDelete.value
    );
  };

  return (
    <div class="flex flex-col gap-2">
      <DeleteDialog
        id={dishToDelete}
        onAccept={handleAcceptDelete}
        url="/api/dish"
        title="Elminar platillo"
        message="¿Estas seguro de eliminar el platillo?"
      />
      <div class="flex flex-row justify-between">
        <SearchDishes dishes={dishes} />

        <a href="/manage-dishes/add-dish" class="btn btn-circle btn-secondary">
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
            class="icon icon-tabler icons-tabler-outline icon-tabler-plus"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 5l0 14" />
            <path d="M5 12l14 0" />
          </svg>
        </a>
      </div>
      <div class="overscroll-x-auto">
        <table class="table table-zebra table-pin-cols">
          <thead>
            <tr>
              <th>Platillo</th>
              <th>Precio</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {dishes.value.map((dish) => (
              <tr>
                <th>
                  {dish.name}
                </th>

                <td>
                  {dish.price}
                </td>

                <td>
                  <a
                    href={`/manage-dishes/edit-dish/${dish.id}`}
                    class="btn btn-ghost"
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
                      class="icon icon-tabler icons-tabler-outline icon-tabler-edit"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                      <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                      <path d="M16 5l3 3" />
                    </svg>
                  </a>
                </td>

                <td>
                  <button
                    class="btn btn-ghost"
                    onClick={() => {
                      dishToDelete.value = dish.id;
                    }}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
