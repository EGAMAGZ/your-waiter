export default function OrderCard() {
  return (
    <div class="card card-bordered w-72 h-96">
      <div class="card-body">
        <div class="flex-1">
          <span class="text-center font-bold block">Orden 1</span>
          <div class="flex flex-col gap-4">
            <DishStatus />
          </div>
        </div>
        <div class="card-actions">
          <button class="btn btn-secondary grow" type="button">
            Orden terminada
          </button>
        </div>
      </div>
    </div>
  );
}

function DishStatus() {
  return (
    <div class="form-control">
      <label class="label cursor-pointer">
        <span class="label-text">ALIMENTP</span>
        <input type="checkbox" class="checkbox" />
      </label>
    </div>
  );
}
