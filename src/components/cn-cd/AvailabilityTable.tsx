import type { Dish } from "@/schema/dish";
import { useSignal, useSignalEffect } from "@preact/signals";
import SearchDishesAvailability from "./SearchDishesAvailability";
import type { ApiResponse } from "@/schema/api-response";

interface Props {
  initialDishes: Dish[];
}

export default function AvailabilityTable({ initialDishes }: Props) {
  const dishes = useSignal<Dish[]>(initialDishes);

  useSignalEffect(() => {
    const getAllDishes = async () => {
      const response = await fetch("/api/dish/search");

      const { data, error } = await response.json() as ApiResponse<
        Dish[]
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
