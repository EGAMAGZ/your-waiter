export type CreateOrder = {
  dishes: number[];
  idTable: number;
};

export type Order = {
  id: number;
  finished: boolean;
  comments: string;
};
