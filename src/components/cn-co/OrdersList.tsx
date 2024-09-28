import type { ComandaInfo } from "@/util/comanda";
import OrderCard from "./OrderCard";
import { useSignal } from "@preact/signals";

interface Props {
  initialComandas: ComandaInfo[];
}

export default function OrdersList({ initialComandas }: Props) {
  const comandasInfo = useSignal(initialComandas);

  const handleFinished = (idComanda: number) => {
    comandasInfo.value = comandasInfo.value.filter((comanda) =>
      comanda.idComanda !== idComanda
    );
  };

  return (
    <>
      {comandasInfo.value.length === 0 && <NoTablesCard />}
      {comandasInfo.value.length > 0 && (
        <div class="w-screen">
          <div class="overflow-x-auto flex whitespace-nowrap gap-2">
            {comandasInfo.value.map((commanda) => (
              <OrderCard key={commanda.idComanda} comandaInfo={commanda} onFinished={handleFinished} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function NoTablesCard() {
  return (
    <div class="bg-gray-300 p-4 flex flex-col justify-center items-center rounded gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-14 w-14 icon icon-tabler icons-tabler-outline icon-tabler-circle-x"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M10 10l4 4m0 -4l-4 4" />
      </svg>

      <span class="text-center font-semibold text-xl">
        No se han creado ordenes de momento
      </span>
    </div>
  );
}
