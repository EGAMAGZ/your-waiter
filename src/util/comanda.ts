export interface DishInfo {
  idOrder: number;
  name: string;
  finished: boolean;
}

export interface ComandaInfo {
  idComanda: number;
  finished: boolean;
  dishes: DishInfo[];
  tableNumber: number;
}

export const groupByComanda = (orders: any[]): ComandaInfo[] =>
  orders.reduce((result, order) => {
    const comandaIndex = result.findIndex((c: ComandaInfo) =>
      c.idComanda === order.fk_id_comanda
    );

    const dish: DishInfo = {
      idOrder: order.id,
      name: order.Platillo.txt_nombre,
      finished: order.st_terminado,
    };

    if (comandaIndex !== -1) {
      // If the comanda already exists, add the platillo to it
      result[comandaIndex].dishes.push(dish);
    } else {
      // If it's a new comanda, create a new entry
      result.push({
        idComanda: order.fk_id_comanda,
        finished: order.st_terminado,
        dishes: [dish],
        tableNumber: order.Comanda.Cuenta.Mesa.nu_mesa
      });
    }

    return result;
  }, [] as ComandaInfo[]);
