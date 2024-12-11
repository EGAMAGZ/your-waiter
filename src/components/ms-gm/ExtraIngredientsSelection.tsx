import type { Ingredient } from "@/schema/ingredient";
import { Signal, useSignal, useSignalEffect } from "@preact/signals";
import { useFetch } from "@pretch/preact";
import { useEffect, useId, useRef, useState } from "preact/hooks";

interface Props {
    ingredients: Ingredient[];
    onCancelSelection: () => void;
    onSelected: (ingredients: Ingredient[]) => void;
}

export default function ExtraIngredientsSelection(
    { ingredients, onSelected, onCancelSelection }: Props,
) {
    const selectedIngredients = useSignal<Ingredient[]>([]);
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        console.log("Ingredients changed:", ingredients);
        if (ingredients.length > 0) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [ingredients]);

    return (
        <dialog id={useId()} class="modal" ref={dialogRef}>
            <div class="modal-box">
                <h1 class="text-xl font-bold">Ingredientes extras</h1>
                {ingredients.map((ingredient) => (
                    <label class="label cursor-pointer">
                        <span class="label-text">{ingredient.name}</span>
                        <input
                            type="checkbox"
                            class="checkbox"
                            onChange={(e) => {
                                if (e.target?.checked) {
                                    selectedIngredients.value.push(ingredient);
                                } else {
                                    selectedIngredients.value =
                                        selectedIngredients.value.filter(
                                            (i) => i.id !== ingredient.id,
                                        );
                                }
                            }}
                        />
                    </label>
                ))}
                <p>Comentarios</p>
                <textarea class="textarea textarea-bordered textarea-primary w-full"></textarea>
                <div class="flex gap-4">
                    <button class="btn btn-outline" onClick={onCancelSelection}>
                        Cancelar
                    </button>
                    <button
                        class="btn btn-primary"
                        onClick={() => onSelected(selectedIngredients.value)}
                    >
                        Seleccionar
                    </button>
                </div>
            </div>
        </dialog>
    );
}
