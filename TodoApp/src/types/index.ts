export type TTodo = {
  order: number;
  title: string;
  done: boolean;
};

// Flux Standard Action
export type TFSA = {
  type: string,
  payload?: any,
  meta?: any,
  error?: true,
};

export type TaddTodo = (title: TTodo["title"]) => void;

export type TtoggleTodo = (order: TTodo["order"]) => void;
