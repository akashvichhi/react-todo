import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Pagination from "@mui/material/Pagination";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { RootState } from "../app/store";
import Todo, { TodoStatus } from "../types/Todo";
import { getTodos } from "../reducers/Todo";
import { filterTodos } from "../helper/todoHelper";

const PER_PAGE = 20;

interface TodoListProps {
    search?: string;
    todoStatus?: TodoStatus;
    onEdit: (todo: Todo) => void;
    onDelete: (todo: Todo) => void;
    onCheck?: (ids: number[]) => void;
    checkedTodos: number[];
    setCheckedTodos: React.Dispatch<React.SetStateAction<number[]>>;
}

const TodoList = ({
    search,
    todoStatus = "in-progress",
    onEdit,
    onDelete,
    onCheck,
    checkedTodos,
    setCheckedTodos
}: TodoListProps) => {
    const dispatch = useAppDispatch();
    const { todos } = useAppSelector((state: RootState) => state.todo);
    const [page, setPage] = useState<number>(1);
    const filteredTodos: Todo[] = filterTodos({ todos, search, status: todoStatus });
    const todoList: Todo[] = filteredTodos.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleCheckTodo = (id: number | undefined) => {
        if (id) {
            if (checkedTodos.includes(id)) {
                const index: number = checkedTodos.indexOf(id);
                if (index > -1) checkedTodos.splice(index, 1);
            }
            else {
                checkedTodos.push(id);
            }
            setCheckedTodos([ ...checkedTodos ]);
            onCheck && onCheck(checkedTodos);
        }
    }

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    useEffect(() => {
        dispatch(getTodos());
    }, []); // eslint-disable-line

    useEffect(() => {
        setPage(1);
    }, [todos, search, todoStatus]);

    return (
        <React.Fragment>
            {todoList.length > 0
                ? <Box>
                    <List dense={true}>
                        {todoList.map((todo: Todo, index: number) => {
                            return (
                                <React.Fragment key={todo.id || index}>
                                    {index !== 0 ? <Divider component="li" /> : null}
                                    <ListItem
                                        secondaryAction={
                                            <Stack direction="row">
                                                <IconButton color="info" onClick={() => onEdit(todo)} title="Edit">
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton color="error" onClick={() => onDelete(todo)} title="Delete">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Stack>
                                        }
                                        disablePadding
                                    >
                                        <ListItemButton
                                            onClick={() => handleCheckTodo(todo.id)}
                                            sx={{ backgroundColor: theme => todo.completed ? theme.palette.success.light + "!important" : "" }}
                                        >
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    checked={Boolean(todo.id && checkedTodos.includes(todo.id))}
                                                    disableRipple
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={todo.title}
                                                secondary={todo.description}
                                                primaryTypographyProps={{ fontSize: 18 }}
                                                sx={{ mr: 8, textAlign: "justify" }}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                </React.Fragment>
                            )
                        })}
                    </List>
                    {filteredTodos.length > PER_PAGE
                        ? <Box my={3}>
                            <Pagination
                                count={Math.ceil(filteredTodos.length / PER_PAGE)}
                                variant="outlined"
                                shape="rounded"
                                page={page}
                                onChange={handleChangePage}
                                color="primary"
                                sx={{ ".MuiPagination-ul": { justifyContent: "center" }}}
                            />
                        </Box>
                        : null
                    }
                </Box>
                : <Typography textAlign="center" mt={2}>No todos found</Typography>
            }
        </React.Fragment>
    )
}

export default TodoList
