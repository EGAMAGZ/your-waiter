interface PlatilloInfo {
    idOrden: number;
    txt_nombre: string;
    st_terminada: boolean;
}

interface ComandaInfo {
    idComanda: number;
    st_terminado: boolean;
    Platillos: PlatilloInfo[];
}

export const groupByComanda = (orders: any[]): ComandaInfo[] =>
    orders.reduce((result, order) => {
        const comandaIndex = result.findIndex((c: ComandaInfo) => c.idComanda === order.fk_id_comanda);

        const platillo = {
            idOrden: order.id,
            txt_nombre: order.Platillo.txt_nombre,
            st_terminada: order.st_terminado,
        };

        if (comandaIndex !== -1) {
            // If the comanda already exists, add the platillo to it
            result[comandaIndex].Platillos.push(platillo);
        } else {
            // If it's a new comanda, create a new entry
            result.push({
                idComanda: order.fk_id_comanda,
                st_terminado: order.st_terminado,
                Platillos: [platillo],
            });
        }

        return result;
    }, [] as ComandaInfo[]);