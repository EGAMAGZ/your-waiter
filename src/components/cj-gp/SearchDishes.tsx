import type { ApiResponse } from "@/schema/api-response";
import type { Dish, DishSearch } from "@/schema/dish";
import { Signal, useComputed, useSignal } from "@preact/signals";
import type { ChangeEvent } from "preact/compat";

interface Props {
  dishes: Signal<Dish[]>;
}

export default function SearchDishes({ dishes }: Props) {
  const dishName = useSignal("");
  const clearInput = useComputed(() => dishName.value.trim() !== "");

  const handleSearch = async () => {
    const searchParams = new URLSearchParams();
    searchParams.set("name", dishName.value);
    const response = await fetch(`/api/dish/search?${searchParams.toString()}`);

    const { data, error } = await response.json() as ApiResponse<Dish[]>;

    if (error) {
      console.log(error);
      return;
    }

    dishes.value = data;
  };

  const handleInput = (event: ChangeEvent) => {
    dishName.value = (event.target as HTMLInputElement).value;
  };

  const handleClear = () => {
    dishName.value = "";
  };

  return (
    <div class="join">
      <label class="input input-bordered flex items-center gap-2 max-w-2xl w-full">
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
          class="icon icon-tabler icons-tabler-outline icon-tabler-search"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
          <path d="M21 21l-6 -6" />
        </svg>
        <input
          type="text"
          name="dishName"
          placeholder="Buscar platillo"
          value={dishName}
          onInput={handleInput}
          class="grow"
        />
        {clearInput.value && (
          <button
            type="button"
            class="btn btn-ghost btn-sm"
            onClick={handleClear}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="icon icon-tabler icons-tabler-filled icon-tabler-circle-x"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-6.489 5.8a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" />
            </svg>
          </button>
        )}
      </label>
      <button class="btn btn-neutral" onClick={handleSearch}>
        Buscar
      </button>
    </div>
  );
}
