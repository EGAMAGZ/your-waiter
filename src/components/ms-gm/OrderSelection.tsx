import type { ApiResponse } from "@/schema/api-response";
import type { Dish } from "@/schema/dish";
import type { CreateOrder } from "@/schema/order";
import type { UpdateTableStatus } from "@/schema/table";
import type { TableStatus } from "@/util/table";
import { useSignal, useSignalEffect } from "@preact/signals";
import ExtraIngredientsSelection from "./ExtraIngredientsSelection";
import type { Ingredient } from "@/schema/ingredient";
import { useId } from "preact/hooks";

async function updateTableStatus(
  id: number,
  tableStatus: TableStatus,
  onChanged: () => void,
) {
  try {
    const response = await fetch(`/api/table/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status: tableStatus } as UpdateTableStatus),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    onChanged();
  } catch (error) {
    console.error(error);
  }
}

const getExtraIngredients = async (dishId: number) => {
  try {
    const response = await fetch(`/api/ingredient/included/${dishId}`);
    const { data, error } = await response.json() as ApiResponse<Dish[]>;
    if (error) {
      console.log(error);
      return;
    }
    return data;
  } catch (error) {
    console.error(error);
  }
};

interface Props {
  dishes: Dish[];
  idTable: number;
}

interface DishWithCurrentQuantity extends Dish {
  currentQuantity: number;
}

type IngredientForDish = {
  dishId: number;
  ingredients: number[];
};

export default function OrderSelection({ dishes, idTable }: Props) {
  const selectedDishes = useSignal<Dish[]>([]);
  const dishOptionsRefs = new Map<number, () => void>();

  const availableIngredients = useSignal<Ingredient[]>([]);

  const selectedIngredients = useSignal<number[]>([]);

  const handleCancelOrder = async () => {
    await updateTableStatus(idTable, "free", () => {
      window.location.replace("/manage-tables");
    });
  };

  const handleCompleteOrder = async () => {
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        body: JSON.stringify({
          dishes: selectedDishes.value.map((dish) => dish.id),
          idTable,
        } as CreateOrder),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      await updateTableStatus(idTable, "in_process", () => {
        window.location.replace("/manage-tables");
      });
    } catch (error) {
      console.error(error);
    }
  };

  useSignalEffect(()=> {
    console.log(selectedIngredients.value)
  })

  return (
    <>
      <ExtraIngredientsSelection
        ingredients={availableIngredients.value}
        onSelected={(selectedIng) => {
          const ids = selectedIng.map((i) => i.id);
          selectedIngredients.value = [...selectedIngredients.value, ...ids];
          availableIngredients.value = [];
        }}
        onCancelSelection={() => {
          availableIngredients.value = [];
        }}
      />
      <div class="flex flex-col gap-8">
        <div class="grid grid-cols-3 gap-8 grow">
          <div class="col-span-2">
            <span class="text-2xl font-semibold mb-4 block">Platillos</span>
            <div class="grid grid-cols-4 gap-4">
              {dishes.map((dish) => (
                <DishOption
                  key={dish.id}
                  dish={dish}
                  onDecreaseSelection={async (dish) => {
                    selectedDishes.value = [...selectedDishes.value, dish];

                    const ingredients = await getExtraIngredients(dish.id);
                    if (ingredients) {
                      availableIngredients.value = ingredients;
                    }
                  }}
                  onIncreaseSelection={(increaseQty) => {
                    dishOptionsRefs.set(dish.id, increaseQty);
                  }}
                />
              ))}
            </div>
          </div>
          <div class="col-span-1">
            <span class="block text-2xl font-semibold mb-4">
              Pedido hasta el momento
            </span>
            {selectedDishes.value.length > 0 && (
              <div class="flex flex-col gap-4 max-h-96 overflow-y-auto bg-gray-300 p-4 rounded">
                {selectedDishes.value.map((dish, index) => (
                  <DishSelection
                    key={dish.id}
                    dish={dish}
                    index={index}
                    onDeleteClick={(idx) => {
                      const deletedDish = selectedDishes.value[idx];
                      const increaseQuantity = dishOptionsRefs.get(
                        deletedDish.id,
                      );
                      if (increaseQuantity) {
                        increaseQuantity();
                      }
                      selectedDishes.value = selectedDishes.value.filter(
                        (_, i) => i !== idx,
                      );
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <div class="flex gap-4">
          <button
            class="btn btn-ghost flex-1 btn-block"
            onClick={handleCancelOrder}
          >
            Cancelar Pedido
          </button>
          <button
            class="btn btn-primary flex-1 btn-block"
            disabled={selectedDishes.value.length === 0}
            onClick={handleCompleteOrder}
          >
            Pedido terminado
          </button>
        </div>
      </div>
    </>
  );
}

interface DishOptionProps {
  dish: Dish;
  onDecreaseSelection: (dish: DishWithCurrentQuantity) => void;
  onIncreaseSelection: (increaseQty: () => void) => void;
}

function DishOption(
  { dish, onDecreaseSelection: onClick, onIncreaseSelection: ref }:
    DishOptionProps,
) {
  const quantity = useSignal(dish.quantity);

  const handleClick = () => {
    if (quantity.value > 0) {
      quantity.value = quantity.value - 1;
    }
    onClick({ ...dish, currentQuantity: quantity.value });
  };

  const increaseQuantity = () => {
    quantity.value = quantity.value + 1;
  };

  ref(increaseQuantity);

  return (
    <button
      class="btn btn-outline h-24"
      onClick={handleClick}
      disabled={quantity.value === 0}
    >
      {dish.name} ({quantity.value})
    </button>
  );
}

interface DishSelectionProps {
  dish: Dish;
  index: number;
  onDeleteClick: (id: number) => void;
}

function DishSelection({ dish, onDeleteClick, index }: DishSelectionProps) {
  return (
    <div class="flex items-center">
      <span class="grow">
        {dish.name}
      </span>
      <button
        class="btn btn-ghost"
        onClick={() => {
          onDeleteClick(index);
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
    </div>
  );
}
