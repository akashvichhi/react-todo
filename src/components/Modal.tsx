import React from "react";
import Box from "@mui/material/Box";
import MuiModal, { ModalTypeMap } from "@mui/material/Modal";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    maxWidth?: number;
    children?: React.ReactNode;
    defaultProps?: Partial<ModalTypeMap>;
}

const Modal = ({
    open,
    onClose,
    maxWidth = 400,
    children,
    defaultProps,
}: ModalProps) => {
    return (
        <MuiModal {...defaultProps} open={open} onClose={onClose} sx={{ overflow: "auto" }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    p: 3,
                    overflow: "auto",
                }}
            >
                <Box
                    sx={{
                        bgcolor: "background.paper",
                        border: "1px solid #555",
                        borderRadius: 1,
                        p: 3,
                        flex: 1,
                        maxWidth: maxWidth,
                    }}
                >
                    {children}
                </Box>
            </Box>
        </MuiModal>
    )
}

export default Modal
