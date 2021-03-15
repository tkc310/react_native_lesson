import { TODO } from "@/actions";
import { TTodo } from "@/types"

export const addTodo = (title: TTodo["title"]) => {
  return {
    type: TODO.ADD,
    payload: title
  }
};

export const toggleTodo = (order: TTodo["order"]) => {
  return {
    type: TODO.TOGGLE,
    payload: order
  }
};

