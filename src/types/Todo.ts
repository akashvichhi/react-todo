export default interface Todo {
    [key: string]: any; // eslint-disable-line
    id?: number;
    title: string;
    description: string;
    completed?: boolean;
    createdAt?: number;
    completedAt?: number;
}

export type TodoStatus = "all" | "in-progress" | "completed"
