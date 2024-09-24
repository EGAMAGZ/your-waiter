import type { Dish } from "@/schema/dish";

interface Props {
  dishes: Dish[];
}

export default function OrderSelection({ dishes }: Props) {
  return (
    <div class="grid grid-cols-3 gap-2">
      <div class="col-span-2">
        asdasd
      </div>
      <div class="col-span-1">
        asdad
      </div>
    </div>
  );
}
