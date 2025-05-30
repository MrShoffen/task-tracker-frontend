import {Box, Card, CircularProgress, IconButton, Typography, useTheme} from "@mui/material";
import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {UncheckedIcon} from "../../assets/icons/UncheckedIcon.jsx";
import {CheckedIcon} from "../../assets/icons/CheckedIcon.jsx";
import {TaskMenu} from "../Task/TaskMenu.jsx";
import {sendEditTask} from "../../services/fetch/tasks/task/SendEditTask.js";
import {EditIcon} from "../../assets/icons/EditIcon.jsx";
import {darkTaskColor, lightTaskColor} from "../../services/util/Utils.jsx";
import {useCustomThemeContext} from "../../context/GlobalThemeContext/CustomThemeProvider.jsx";
import {useNotification} from "../../context/Notification/NotificationProvider.jsx";
import ConflictException from "../../exception/ConflictException.jsx";
import TextField from "@mui/material/TextField";
import {ChatMessage} from "./ChatMessage.jsx";
import {MessageField} from "./MessageField.jsx";
import {CloseIcon} from "../../assets/icons/CloseIcon.jsx";


export function ChatCard({open}) {

    const {
        activeTask,
        closeChat,
        commentsInCurrentTask,
        userHasPermission,
        loadMoreComments,
        updateTaskField,
    } = useTaskOperations();

    const [hovered, setHovered] = React.useState(false);
    const theme = useTheme();
    const {isDarkMode} = useCustomThemeContext();
    const messagesEndRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingText, setEditingText] = useState(''); // Добавить состояние для текста
    const {showWarn} = useNotification();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!activeTask()) {
            closeChat();
        }
        if (activeTask()?.name) {
            setEditingText(activeTask().name);
        }
    }, [activeTask()]);


    const handleEditClick = () => {
        setEditingText(activeTask()?.name || '');
        setIsEditing(true);
    };

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            await handleBlur();
        } else if (e.key === 'Escape') {
            setEditingText(activeTask()?.name || '');
            setIsEditing(false);
        }
    };

    const handleInputChange = (e) => {
        setEditingText(e.target.value);
    };

    const taskColor = (taskColor) => {
        return !isDarkMode ? lightTaskColor[taskColor] : darkTaskColor[taskColor];
    }


    function scrollToBottom() {
        if (messagesEndRef.current && commentsInCurrentTask.length > 0) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }

    const handleScroll = async (e) => {
        const {scrollTop} = e.target;
        if (scrollTop === 0) { // Прокрутили до верха
            setIsLoading(true);
            try {
                const prevScrollHeight = messagesEndRef.current.scrollHeight;
                await loadMoreComments();
                setTimeout(() => {
                    messagesEndRef.current.scrollTop =
                        messagesEndRef.current.scrollHeight - prevScrollHeight;
                }, 300)


            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleBlur = async (duplicatedCount = 0) => {
        const newText = editingText.trim();
        if (newText !== activeTask()?.name && newText !== '') {
            try {
                const newNameWithDubls = newText + (duplicatedCount === 0 ? '' : (' (' + duplicatedCount + ')'));
                await sendEditTask("name", activeTask(), {
                    newName: newNameWithDubls
                });
                updateTaskField(activeTask().deskId, activeTask().id, 'name', newNameWithDubls);
                setEditingText(newNameWithDubls);
            } catch (error) {
                if (error instanceof ConflictException) {
                    await handleBlur(duplicatedCount + 1);
                } else {
                    console.log(error);
                    showWarn(error.message);
                    setEditingText(activeTask()?.name || '');
                }
            }
        }
        setIsEditing(false);
    };

    const handleCompletionClick = async () => {
        if (!userHasPermission("UPDATE_TASK_COMPLETION")) {
            return;
        }
        try {
            updateTaskField(activeTask().deskId, activeTask().id, 'completed', !activeTask().completed);
            await sendEditTask("completion", activeTask(),
                {completed: !activeTask().completed});
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (commentsInCurrentTask?.length <= 25) {
            scrollToBottom();
        }

    }, [commentsInCurrentTask]); // Срабатывает при изменении комментариев

    function handleCloseChat() {
        closeChat();
    }

    return (
        <Card
            elevation={0}
            sx={{
                position: 'relative',
                backgroundColor: 'desk',
                width: open ? '450px' : '0px',
                zIndex: 4000,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 20,
                borderLeft: '1px solid',
                borderColor: 'action.disabled',
                transition: 'width 200ms ease-in-out',
                height: '100vh',
            }}
        >

            <Box
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                id='content'
                sx={{
                    width: '100%',
                    height: '148px',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'desk',
                    borderBottom: '1px solid',
                    borderBottomColor: 'action.disabled',
                }}
            >


                <Box sx={{
                    display: 'flex',
                    position: 'relative',
                    backgroundColor: taskColor(activeTask()?.color),
                    flexDirection: 'row', mt: 7, ml: 1, mr: 1,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'action.disabled',
                }}>
                    <IconButton
                        onClick={handleCompletionClick}
                        sx={{width: '17px', opacity: 1, height: '17px', p: 0, ml: 1, mt: 1.5,}}>
                        {!activeTask()?.completed
                            ? <UncheckedIcon color={theme.palette.taskName} size={"17px"}/>
                            : <CheckedIcon size="17px"/>
                        }
                    </IconButton>

                    <Box sx={{display: 'flex', flexDirection: 'column'}}>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            {isEditing ? (
                                <TextField
                                    autoFocus
                                    variant='standard'
                                    value={editingText}
                                    placeholder='Имя'
                                    onKeyDown={handleKeyDown}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    size="small"
                                    InputProps={{
                                        disableUnderline: true,
                                    }}
                                    sx={{
                                        width: '350px',
                                        ml: '5px',
                                        mt: '2px',
                                        '& .MuiInputBase-input': {
                                            fontSize: '16px',
                                            fontWeight: '500',
                                            border: 'none',
                                            pt: '6px',
                                            pl: '3px'
                                        }
                                    }}
                                />

                            ) : (
                                <Typography
                                    component="div"
                                    sx={{
                                        m: 1,
                                        zIndex: 2,
                                        color: 'taskName',
                                        userSelect: "none",
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        fontWeight: '500',
                                        alignSelf: 'start',
                                        overflowWrap: 'break-word',
                                        wordBreak: 'break-all',
                                        outline: 'none',
                                        maxWidth: '350px',
                                    }}
                                >
                                    {activeTask()?.name}
                                </Typography>
                            )}

                            {userHasPermission('UPDATE_TASK_NAME') && hovered && !isEditing && (
                                <IconButton
                                    disableRipple
                                    sx={{width: '16px', height: '16px', p: 0, mb: '2px', ml: '2px'}}
                                    onClick={handleEditClick}
                                >
                                    <EditIcon color={theme.palette.taskName} size="16px"/>
                                </IconButton>
                            )}
                        </Box>

                    </Box>
                    {(userHasPermission("UPDATE_TASK_COLOR")
                            || userHasPermission("UPDATE_TASK_COVER")
                            || userHasPermission("DELETE_TASK")
                        ) && activeTask() && !isEditing &&
                        <TaskMenu
                            sx={{position: 'absolute', right: 10, top: 2,}}
                            task={activeTask()}
                            hovered={hovered}
                            setContentIsLoading={() => {
                            }}
                        />}
                </Box>

            </Box>


            <Box
                ref={messagesEndRef} // Привязываем ref к контейнеру
                onScroll={handleScroll}
                sx={{
                    width: '100%',
                    height: '100%',
                    background: `
                   url(https://ru.yougile.com/img/chat/chat-background-new3.png)
                   , ${theme.palette.mode === 'dark' ? 'linear-gradient(135deg,#162731,#141e2d)' : 'linear-gradient(135deg,#cfebfa,#b3d3ff)'};
                    `,
                    backgroundBlendMode: theme.palette.mode === 'dark' ? 'screen' : 'soft-light',
                    backgroundRepeat: 'repeat',
                    position: 'relative',

                    overflowY: 'auto',
                    // flex: 1,
                    '&::-webkit-scrollbar': {
                        width: '7px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'action.disabled',
                        borderRadius: '3px',
                        visibility: 'visible',
                        transition: 'visibility 0.6s ease',
                    },

                }}
                id='content'
            >
                {isLoading && <CircularProgress/>}
                {commentsInCurrentTask && commentsInCurrentTask
                    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                    .map(comment => <>
                        <ChatMessage task={activeTask()} key={comment.id} message={comment}/>
                        {/*<ChatMessage task={activeTask()} message={{...comment, type: 'AUDIT'}}/>*/}
                    </>)}


                <div style={{float: "left", clear: "both"}}/>
                {/*<div ref={messagesEndRef} />*/}
            </Box>


            <MessageField task={activeTask()} scroll={scrollToBottom}/>

            <Box
                onClick={handleCloseChat}
                sx={{
                    borderTopLeftRadius: '4px',
                    borderBottomLeftRadius: '4px',
                    position: 'absolute',
                    cursor: 'pointer',
                    left: '6px',
                    top: '6px'
                    // zIndex: 200000
                }}
            >
                <CloseIcon/>
            </Box>
        </Card>
    )
}