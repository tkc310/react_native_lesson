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
