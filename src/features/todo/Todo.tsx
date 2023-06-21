import React, { Suspense, useDeferredValue, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconAdd from "@mui/icons-material/Add";
import IconSearch from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Todo, { TodoStatus } from "../../types/Todo";
import TodoForm from "../../components/TodoForm";
import TodoList from "../../components/TodoList";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { markTodoAsComplete, markTodoAsNotComplete, removeTodo, removeTodosById } from "../../reducers/Todo";
import { RootState } from "../../app/store";
import { filterTodos } from "../../helper/todoHelper";

const emptyTodo: Todo = {
    title: "",
    description: "",
}

const TodoStatusButton = ({
    label,
    active = false,
    onClick,
    count,
}: {
    label: string,
    active?: boolean,
    onClick?: () => void,
    count: number,
}) => {
    return (
        <ListItem disablePadding>
            <ListItemButton
                onClick={() => onClick && onClick()}
                sx={{
                    backgroundColor: theme => active ? theme.palette.primary.main + "!important" : "",
                    color: active ? "#fff" + "!important" : "",
                    p: 2,
                }}
            >
                {label} <Typography fontSize={13} ml={1}>({count})</Typography>
            </ListItemButton>
        </ListItem>
    )
}

const TodoComponent = () => {
    const dispatch = useAppDispatch();
    const { todos } = useAppSelector((state: RootState) => state.todo);
    const [search, setSearch] = useState<string>("");
    const [showForm, setShowForm] = useState<boolean>(false);
    const [todoItem, setTodoItem] = useState<Todo | null>(null);
    const [todoStatus, setTodoStatus] = useState<TodoStatus>("all");
    const [checkedTodos, setCheckedTodos] = useState<number[]>([]);
    const searchDefer: string = useDeferredValue(search);
    const todoStatusDefer: TodoStatus = useDeferredValue(todoStatus);

    const onSeach = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue: string = event.target.value;
        setSearch(searchValue);
    }

    const addEditTodo = (todo?: Todo) => {
        setShowForm(true);
        setTodoItem(todo ? { ...todo } : { ...emptyTodo });
    }

    const deleteTodo = (todo: Todo) => {
        dispatch(removeTodo(todo));
    }

    const onCheckTodos = (ids: number[]) => {
        setCheckedTodos([ ...ids ]);
    }

    const closeForm = () => {
        setShowForm(false);
        setTodoItem(null);
    }

    const markAsComplete = () => {
        dispatch(markTodoAsComplete(checkedTodos));
        setCheckedTodos([]);
    }

    const markAsNotComplete = () => {
        dispatch(markTodoAsNotComplete(checkedTodos));
        setCheckedTodos([]);
    }

    const deleteById = () => {
        dispatch(removeTodosById(checkedTodos));
        setCheckedTodos([]);
    }
    
    return (
        <Container maxWidth="xl">
            <Typography component="h1" fontSize={28} mt={1}>Todo App</Typography>
            <Paper variant="outlined" sx={{ mt: 2, mb: 3 }}>
                <Stack direction={"row"} justifyContent="space-between" gap={3} sx={{ p: 2, borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}>
                    <Box>
                        <Button startIcon={<IconAdd />} variant="contained" onClick={() => addEditTodo()}>Add</Button>
                    </Box>
                    <Stack direction={"row"} gap={2}>
                        {
                            todos.length > 0 && checkedTodos.length > 0
                                ? <React.Fragment>
                                    {
                                        todoStatus === "in-progress" || todoStatus === "all"
                                            ? <Button variant="contained" color="success" onClick={markAsComplete}>Mark as Complete</Button>
                                            : <Button variant="contained" color="warning" onClick={markAsNotComplete}>Mark as Not Complete</Button>
                                    }
                                    <Button variant="contained" color="error" onClick={deleteById}>Delete</Button>
                                </React.Fragment>
                                : null
                        }
                        <TextField
                            label="Search"
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconSearch />
                                    </InputAdornment>
                                )
                            }}
                            size="small"
                            value={search}
                            onChange={onSeach}
                        />
                    </Stack>
                </Stack>
                <Box display="flex">
                    <Box sx={{ minWidth: "200px", borderRight: "1px solid rgba(0, 0, 0, 0.12)" }}>
                        <List disablePadding>
                            <TodoStatusButton
                                label="All"
                                active={todoStatus ===  "all"}
                                onClick={() => setTodoStatus("all")}
                                count={todos.length}
                            />
                            <TodoStatusButton
                                label="In Progress"
                                active={todoStatus ===  "in-progress"}
                                onClick={() => setTodoStatus("in-progress")}
                                count={filterTodos({ todos, status: "in-progress" }).length}
                            />
                            <TodoStatusButton
                                label="Completed"
                                active={todoStatus === "completed"}
                                onClick={() => setTodoStatus("completed")}
                                count={filterTodos({ todos, status: "completed" }).length}
                            />
                        </List>
                    </Box>
                    <Box flex="1 1 auto">
                        <Suspense fallback={<>Loading...</>}>
                            <TodoList
                                search={searchDefer}
                                todoStatus={todoStatusDefer}
                                onEdit={addEditTodo}
                                onDelete={deleteTodo}
                                onCheck={onCheckTodos}
                                checkedTodos={checkedTodos}
                                setCheckedTodos={setCheckedTodos}
                            />
                        </Suspense>
                    </Box>
                </Box>
            </Paper>
            {todoItem ?
                <TodoForm
                    todo={todoItem}
                    show={showForm}
                    onClose={closeForm}
                />
                : null
            }
        </Container>
    )
}

export default TodoComponent
