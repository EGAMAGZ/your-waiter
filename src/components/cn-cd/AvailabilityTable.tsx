import type { DishAvailability } from "@/schema/dish";
import { useSignal } from "@preact/signals";
import SearchDishesAvailability from "./SearchDishesAvailability";

export default function AvailabilityTable() {
  const dishes = useSignal<DishAvailability[]>([]);

  return (
    <div class="flex flex-col gap-2">
      <SearchDishesAvailability dishes={dishes} />

      <div class="overflow-x-auto">
        <table className="table table-zebra table-pin-cols">
          <thead>
            <tr>
              <th class="max-w-14">Cantidad disponible</th>
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
                  {dish}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
