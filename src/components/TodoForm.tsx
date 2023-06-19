import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Todo from "../types/Todo";
import Modal from "./Modal";
import { addTodo, updateTodo } from "../reducers/Todo";
import { useAppDispatch } from "../app/hooks";

type Error =  {
    title?: string;
    description?: string;
}

const emptyTodo: Todo = {
    title: "",
    description: "",
}

interface TodoFormProps {
    todo: Todo,
    show: boolean,
    onClose: () => void,
}

const TodoForm = ({
    todo,
    show,
    onClose,
}: TodoFormProps) => {
    const dispatch = useAppDispatch();
    const isEdit = Boolean(todo.id);
    const [input, setInput] = useState<Todo>(emptyTodo);
    const [errors, setErrors] = useState<Error>({});

    useEffect(() => {
        setInput({ ...todo });
    }, [todo]);

    const onChangeInput = (key: string, value: string) => {
        input[key] = value;
        setInput({ ...input });
    }

    const save = () => {
        let errors: Error = {};
        if (!input.title.trim()) errors.title = "Title is required";
        if (!input.description.trim()) errors.description = "Description is required";
        setErrors({ ...errors });

        if (Object.keys(errors).length === 0) {
            if (isEdit) {
                dispatch(updateTodo(input));
            }
            else {
                dispatch(addTodo(input));
            }
            onClose();
        }
    }

    return (
        <Modal
            open={show}
            onClose={onClose}
            maxWidth={600}
        >
            <Typography component="h3" fontSize={22} textAlign="center" m={0}>{isEdit ? "Edit" : "Add"} Todo Item</Typography>
            <hr />
            <Box my={3}>
                <TextField
                    fullWidth
                    label="Title"
                    variant="outlined"
                    size="small"
                    value={input.title}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChangeInput("title", event.target.value)}
                    error={Boolean(errors.title)}
                    helperText={errors.title}
                />
            </Box>
            <Box my={3}>
                <TextField
                    fullWidth multiline
                    minRows={3}
                    label="Description"
                    variant="outlined"
                    size="small"
                    value={input.description}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChangeInput("description", event.target.value)}
                    error={Boolean(errors.description)}
                    helperText={errors.description}
                />
            </Box>
            <Stack direction="row" gap={2} justifyContent="end">
                <Button variant="contained" color="error" onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={save}>{isEdit ? "Update" : "Add"}</Button>
            </Stack>
        </Modal>
    )
}

export default TodoForm
