import { supabase } from "@/lib/supabase";
import type { ApiResponse } from "@/schema/api-response";
import type { APIRoute } from "astro";
import type { Ingredient } from "@/schema/ingredient";
import { z } from "zod";

export const GET: APIRoute = async ({ params }) => {
    const { id } = params;

    const parsedData = z.coerce.number({
        required_error: "Id de platillo es requerido",
        invalid_type_error: "Id de platillo deber ser número",
    })
        .positive({
            message: "Id de platillo debe ser mayor a 0",
        }).safeParse(id);

    if (!parsedData.success) {
        const response: ApiResponse = {
            message: parsedData.error.format(),
            error: "validation_error",
        };

        return Response.json(response, {
            status: 400,
        });
    }

    const idDish = parsedData.data;

    const includedQuery = supabase
        .from("Incluye")
        .select("fk_id_ingrediente")
        .eq("fk_id_platillo", idDish);

    const { data, error: includedError } = await includedQuery;
    console.log(data);

    if (includedError) {
        const response: ApiResponse = {
            message: includedError.message,
            error: "server_error",
        };

        console.log(response);

        return Response.json(response, {
            status: 500,
        });
    }
    if (data.length === 0) {
        const response: ApiResponse<Ingredient[]> = {
            message: "No se encontraron ingredientes",
            data: [],
        };

        return Response.json(response, {
            status: 200,
        });
    }

    const ingredientsQuery = supabase
        .from("Ingrediente Extra")
        .select("*")
        .gt("nu_cantidad", 0)
        .in("id_ingrediente", data!.map((item) => item.fk_id_ingrediente));

    const { data: ingredientsData, error: ingredientsError } =
        await ingredientsQuery;

    if (ingredientsError) {
        const response: ApiResponse = {
            message: ingredientsError.message,
            error: "server_error",
        };

        console.log(response);

        return Response.json(response, {
            status: 500,
        });
    }

    const ingredients = ingredientsData.map((ingredient) => ({
        id: ingredient.id_ingrediente,
        name: ingredient.txt_nombre,
        price: ingredient.nu_precio,
        quantity: ingredient.nu_cantidad,
    } as Ingredient));
    const response: ApiResponse<Ingredient[]> = {
        data: ingredients,
        message: "Ingredients found successfully",
    };

    return Response.json(response, {
        status: 200,
    });
};
