import { TFSA, TTodo } from "@/types";
import { TODO } from "@/actions";

const initialState = {
  todos: [],
  current: 0
};

export const todos = (state = initialState, action: TFSA) => {
  switch (action.type) {
    case TODO.ADD:
      const newTodo = {
        title: action.payload,
        order: state.current,
        done: false,
      };
      return { ...state, todos: [...state.todos, newTodo] };
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
