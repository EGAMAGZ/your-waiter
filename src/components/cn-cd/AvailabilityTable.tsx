import type { DishAvailability } from "@/schema/dish";
import { useSignal, useSignalEffect } from "@preact/signals";
import SearchDishesAvailability from "./SearchDishesAvailability";
import type { ApiResponse } from "@/schema/api-response";

export default function AvailabilityTable() {
  const dishes = useSignal<DishAvailability[]>([]);

  useSignalEffect(() => {
    const getAllDishes = async () => {
      const response = await fetch("/api/dish/availability");

      const { data, error } = await response.json() as ApiResponse<
        DishAvailability[]
      >;

      if (error) {
        console.log(error);
        return;
      }

      dishes.value = data;
    };

    getAllDishes();
  });

  return (
    <div class="flex flex-col gap-2">
      <SearchDishesAvailability dishes={dishes} />

      <div class="overflow-x-auto">
        <table className="table table-zebra table-pin-cols">
          <thead>
            <tr>
              <th>Cantidad disponible</th>
              <th>Platillo</th>
            </tr>
          </thead>
          <tbody>
            {dishes.value.map((dish) => (
              <tr>
                <th>
                  {dish.quantity}
                </th>
                <td>
                  {dish.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
