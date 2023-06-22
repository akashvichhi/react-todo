import Todo, { TodoStatus } from "../types/Todo";

interface FilterTodos {
    todos: Todo[];
    search?: string;
    status?: TodoStatus;
}
export const filterTodos = ({ todos, search, status }: FilterTodos): Todo[] => {
    return todos.filter((todo: Todo) => {
        let isFiltered: boolean = false;
        if (status) {
            isFiltered = (status === "completed" && todo.completed) || (status === "in-progress" && !todo.completed) || (status === "all");
        }
        if (isFiltered && search) {
            const searchValue: string = search.toLowerCase();
            isFiltered = todo.title.toLowerCase().includes(searchValue) || todo.description.toLowerCase().includes(searchValue);
        }
        return isFiltered;
    });
}
