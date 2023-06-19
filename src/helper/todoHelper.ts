import Todo, { TodoStatus } from "../types/Todo";

interface FilterTodos {
    todos: Todo[];
    search?: string;
    status?: TodoStatus;
}
export const filterTodos = ({ todos, search, status }: FilterTodos): Todo[] => {
    let fileredTodos: Todo[] = [ ...todos ];
    if (status) {
        fileredTodos = fileredTodos.filter((todo: Todo) => ((status === "completed" && todo.completed) || (status === "in-progress" && !todo.completed) || (status === "all")));
    }
    if (search) {
        const searchValue: string = search.toLowerCase();
        fileredTodos = fileredTodos.filter((todo: Todo) => todo.title.toLowerCase().includes(searchValue) || todo.description.toLowerCase().includes(searchValue));
    }
    return fileredTodos;
}
