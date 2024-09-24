import { supabase } from "@/lib/supabase";
import type { ApiResponse } from "@/schema/api-response";
import type { Table } from "@/schema/table";
import { getStatusById, tableStatus } from "@/util/table";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const getAvailableTables = supabase
    .from("Mesa")
    .select("*")
    .eq("fk_id_edo_mesa", tableStatus.free);

  const { data, error } = await getAvailableTables;

  if (error) {
    const response: ApiResponse = {
      message: error.message,
      error: "server_error",
    };

    return Response.json(response, {
      status: 500,
    });
  }

  const tables = data.map((table) => ({
    id: table.id_mesa,
    status: getStatusById(table.fk_id_edo_mesa),
    numberTable: table.nu_mesa,
  }));

  const response: ApiResponse<Table[]> = {
    data: tables,
    message: "Available tables found succesfully",
  };

  return Response.json(response, {
    status: 200,
  });
};
