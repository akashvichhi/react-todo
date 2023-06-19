import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import Todo from "../types/Todo";
import { LocalStorageKey } from "../Constants";

export interface TodoState {
    todos: Todo[];
}

const initialState: TodoState = {
    todos: [],
};

const updatedTodos = (prevTodos: Todo[], todo: Todo, action: string): Todo[] => {
    if (action === "add") {
        const ids: number[] = [0];
        prevTodos.forEach((todo: Todo) => {
            if (todo.id) ids.push(todo.id);
        });
        todo.id = Math.max(...ids) + 1;
        todo.createdAt = (new Date()).getTime();
        prevTodos.push(todo);
    }
    else {
        const index = prevTodos.findIndex((td: Todo) => td.id === todo.id);
        if (index > -1) {
            if (action === "edit") prevTodos[index] = { ...todo };
            else prevTodos.splice(index, 1);
        }
    }
    localStorage.setItem(LocalStorageKey, JSON.stringify(prevTodos));
    return prevTodos;
}

export const todoSlice = createSlice({
    name: "todo",
    initialState,
    reducers: {
        getTodos: (state: TodoState) => {
            let todos: Todo[] = [];
            try {
                todos = JSON.parse(localStorage.getItem(LocalStorageKey) ?? "[]");
            }
            catch (ex) {}
            state.todos = [ ...todos ];
        },
        addTodo: (state: TodoState, action: PayloadAction<Todo>) => {
            const newTodos: Todo[] = updatedTodos(state.todos, action.payload, "add");
            state.todos = [ ...newTodos ];
        },
        updateTodo: (state: TodoState, action: PayloadAction<Todo>) => {
            const newTodos: Todo[] = updatedTodos(state.todos, action.payload, "edit");
            state.todos = [ ...newTodos ];
        },
        removeTodo: (state: TodoState, action: PayloadAction<Todo>) => {
            const newTodos: Todo[] = updatedTodos(state.todos, action.payload, "remove");
            state.todos = [ ...newTodos ];
        },
        removeTodosById: (state: TodoState, action: PayloadAction<number[]>) => {
            const newTodos: Todo[] = state.todos.filter((todo: Todo) => !todo.id || !action.payload.includes(todo.id));
            localStorage.setItem(LocalStorageKey, JSON.stringify(newTodos));
            state.todos = [ ...newTodos ];
        },
        markTodoAsComplete: (state: TodoState, action: PayloadAction<number[]>) => {
            const newTodos: Todo[] = state.todos.map((todo: Todo) => {
                if (todo.id && action.payload.includes(todo.id)) {
                    todo.completed = true;
                    todo.completedAt = (new Date()).getTime();
                }
                return todo;
            });
            localStorage.setItem(LocalStorageKey, JSON.stringify(newTodos));
            state.todos = [ ...newTodos ];
        },
        markTodoAsNotComplete: (state: TodoState, action: PayloadAction<number[]>) => {
            const newTodos: Todo[] = state.todos.map((todo: Todo) => {
                if (todo.id && action.payload.includes(todo.id)) {
                    todo.completed = false;
                    todo.completedAt = undefined;
                }
                return todo;
            });
            localStorage.setItem(LocalStorageKey, JSON.stringify(newTodos));
            state.todos = [ ...newTodos ];
        },
    },
});

export const { getTodos, addTodo, removeTodo, updateTodo, markTodoAsComplete, markTodoAsNotComplete, removeTodosById } = todoSlice.actions;

export default todoSlice.reducer;
