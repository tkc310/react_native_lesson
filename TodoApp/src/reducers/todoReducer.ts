import { TFSA, TTodo } from "@/types";
import { TODO } from "@/actions";

const initialState = {
  todos: [],
  current: 0
};

export const todos = (state = initialState, action: TFSA) => {
  switch (action.type) {
    case TODO.ADD:
      const current = state.current + 1;
      const newTodo = {
        title: action.payload,
        order: current,
        done: false,
      };
      return { ...state, current, todos: [...state.todos, newTodo] };
    case TODO.TOGGLE:
      const todos = state.todos.map((item: TTodo) => {
        if (item.order === action.payload) {
          return { ...item, done: !item.done };
        } else {
          return item;
        }
      });
      return { ...state, todos };
    default:
      return state;
  }
};

export default todos;
