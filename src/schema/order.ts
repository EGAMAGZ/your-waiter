export type CreateOrder = {
  dishes: number[];
  idTable: number;
  ingredientsId: number[];
};

export type Order = {
  id: number;
  finished: boolean;
  comments: string;
};
