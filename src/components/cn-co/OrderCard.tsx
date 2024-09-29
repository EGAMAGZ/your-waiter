import type { ApiResponse } from "@/schema/api-response";
import type { ComandaInfo, DishInfo } from "@/util/comanda";
import { useSignal } from "@preact/signals";
import type { ChangeEvent } from "preact/compat";

interface Props {
  comandaInfo: ComandaInfo;
  onFinished: (id: number) => void;
}

const updateOrder = async (idOrder: number): Promise<boolean> => {
  const response = await fetch(`/api/order/finished/${idOrder}`, {
    method: "PUT",
  });
  const { error } = await response.json() as ApiResponse<
    boolean
  >;

  if (error) {
    return false;
  }
  return true;
};

export default function OrderCard({ comandaInfo, onFinished }: Props) {
  const dishes = useSignal(comandaInfo.dishes);

  const updateComanda = async (idComanda: number) => {
    const response = await fetch(`/api/comanda/finished/${idComanda}`, {
      method: "PUT",
    });

    const { error } = await response.json() as ApiResponse<boolean>;

    if (error) {
      return false;
    }
    return true;
  };

  const handleComandaFinished = async () => {
    const success = await updateComanda(comandaInfo.idComanda);
    if (success) {
      dishes.value.filter((dish) => !dish.finished).forEach((dish) => {
        updateOrder(dish.idOrder);
      });
      onFinished(comandaInfo.idComanda);
    }
  };

  const handleDishFinished = (orderId: number) => {
    dishes.value = dishes.value.map((dish) => {
      if (dish.idOrder === orderId) {
        return {
          ...dish,
          finished: true,
        };
      }
      return dish;
    });
  };

  return (
    <div class="card card-bordered w-72 h-96">
      <div class="card-body">
        <div class="flex-1">
          <span class="text-center font-bold block">
            Orden {comandaInfo.idComanda}
          </span>
          <div class="flex flex-col gap-4">
            {dishes.value.map((dish) => (
              <DishStatus dishInfo={dish} onFinished={handleDishFinished} />
            ))}
          </div>
        </div>
        <div class="card-actions">
          <button
            class="btn btn-secondary grow"
            type="button"
            onClick={handleComandaFinished}
          >
            Orden terminada
          </button>
        </div>
      </div>
    </div>
  );
}

interface DishStatusProps {
  dishInfo: DishInfo;
  onFinished: (orderId: number) => void;
}

function DishStatus({ dishInfo, onFinished }: DishStatusProps) {
  const finished = useSignal(dishInfo.finished);

  const handleFinished = async (event: ChangeEvent<HTMLInputElement>) => {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      const success = await updateOrder(dishInfo.idOrder);
      if (success) {
        finished.value = checked;
        onFinished(dishInfo.idOrder);
      }
    }
  };

  return (
    <div class="form-control">
      <label class="label cursor-pointer">
        <span
          class={`label-text break-all ${finished.value ? "line-through" : ""}`}
        >
          {dishInfo.name}
        </span>
        <input
          type="checkbox"
          class="checkbox"
          checked={finished.value}
          onChange={handleFinished}
          disabled={finished.value}
        />
      </label>
    </div>
  );
}
