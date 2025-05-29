import {Box, useTheme} from "@mui/material";
import TextField from "@mui/material/TextField";
import {SendIcon} from "../../assets/icons/Send.jsx";
import * as React from "react";
import {useNotification} from "../../context/Notification/NotificationProvider.jsx";
import {sendCreateComment} from "../../services/fetch/tasks/comments/SendCreateComment.js";
import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";


export function MessageField({task, scroll}) {
    const [message, setMessage] = React.useState('');
    const theme = useTheme();

    const [sending, setSending] = React.useState(false);

    const {showWarn} = useNotification();

    const {addNewComment} = useTaskOperations();

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            await handleConfirm();
        }
    };

    const [errorMessage, setErrorMessage] = React.useState(false);

    async function handleConfirm() {
        if (message.trim().length === 0) {
            return;
        }
        if (message.trim().length > 1024) {
            showWarn("Длина не должна превышать 1024 символа")
        }
        setSending(true);

        try {
            const newM = await sendCreateComment(task, {message: message});
            addNewComment(newM, task);
        } catch (error) {
            showWarn(error.message);
            console.log(error.message);
        }
        setMessage("");

        setTimeout(() => {
            scroll();
            setSending(false);
        }, 100);
    }

    function handleChange(e) {
        const t = e.target.value;

        if (t.trim().length > 1024) {
            setErrorMessage(true);
        } else {
            setErrorMessage(false);
        }
        setMessage(t)
    }

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                width: '100%',
                height: '150px',
                backgroundColor: 'desk',
                borderTop: '1px solid',
                borderTopColor: 'action.disabled',
                p: 1.5
            }}
        >
            <TextField
                multiline
                rows={2}
                disabled={sending}
                onKeyDown={handleKeyDown}
                placeholder="Ваше сообщение... (1024 символа)"
                variant="standard"
                InputProps={{
                    disableUnderline: true,
                }}
                sx={{
                    width: '100%',
                    minHeight: '70px',
                    height: '70px',
                    maxHeight: '70px',
                    '& .MuiInputBase-input': {
                        p: 1,
                        pr: 4,
                        minHeight: '70px',
                        height: '70px',
                        maxHeight: '70px',
                        border: '1px solid',
                        borderColor: errorMessage ? 'error.main' : 'action.disabled',
                        fontSize: '14px',
                        backgroundColor: 'background.default',
                        borderRadius: 3,
                    }
                }}
                value={message}
                onChange={handleChange}
            >

            </TextField>

            <Box
                onClick={handleConfirm}
                disabled={sending}
                sx={{
                    position: 'absolute',
                    right: '20px',
                    top: '28px',
                    cursor: 'pointer',

                }}>
                <SendIcon color={theme.palette.info.main}/>

            </Box>

        </Box>
    )
}