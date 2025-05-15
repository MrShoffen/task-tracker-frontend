import {Box, Card, IconButton, Typography} from "@mui/material";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import AddIcon from "@mui/icons-material/Add";
import {EditIcon} from "../../assets/icons/EditIcon.jsx";
import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";
import {sendEditTask} from "../../services/fetch/tasks/task/SendEditTask.js";
import {UncheckedIcon} from "../../assets/icons/UncheckedIcon.jsx";
import {CheckedIcon} from "../../assets/icons/CheckedIcon.jsx";
import {sendCreateTask} from "../../services/fetch/tasks/task/SendCreateTask.js";
import ConflictException from "../../exception/ConflictException.jsx";


export function NewTaskBadge({taskCreationLink, addNewTask}) {

    const handleNewTaskClick = async () => {
        setIsEditing(true);
    }

    const [isEditing, setIsEditing] = useState(false);
    const typographyRef = useRef(null);
    const lastSelectionRef = useRef(null);
    const [initialText, setInitialText] = useState('');

    const saveSelection = () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            lastSelectionRef.current = selection.getRangeAt(0);
        }
    };

    const restoreSelection = () => {
        if (lastSelectionRef.current) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(lastSelectionRef.current);
        }
    };

    const handleBlur = async (event, conflictText = '', duplicatedCount = 0) => {
        setIsEditing(false);
        saveSelection();
        const taskName = conflictText || typographyRef.current?.textContent.trim() || '';
        if (taskName !== initialText && taskName !== '') { // Сравниваем с исходным текстом
            try {
                const taskNameWithDubls = taskName + (duplicatedCount === 0 ? '' : (' (' + duplicatedCount + ')'));
                const newTask = await sendCreateTask(taskCreationLink,
                    {name: taskNameWithDubls});
                addNewTask(newTask);
            } catch (error) {
                switch (true) {
                    case error instanceof ConflictException:
                        await handleBlur(event, taskName, duplicatedCount + 1);
                        break;
                    default:
                        console.log(error);
                        typographyRef.current.textContent = initialText;
                }
            }
        } else {
            typographyRef.current.textContent = initialText;
        }
    };

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            await handleBlur();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
        }
    };

    const handleInput = () => {
        saveSelection();
    };

    useEffect(() => {
        if (isEditing && typographyRef.current) {
            typographyRef.current.focus();

            if (!lastSelectionRef.current) {
                const range = document.createRange();
                range.selectNodeContents(typographyRef.current);
                range.collapse(false);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                restoreSelection();
            }
        } else {
            lastSelectionRef.current = null;
        }
    }, [isEditing]);


    return (
        <Card
            elevation={0}
            sx={{
                mt: isEditing ? -0.8 : -1.6,
                mb: isEditing ? '0px' : '-8px',
                ml: '7px',
                border: isEditing && '1px solid',
                borderColor: 'action.disabled',

                backgroundColor: isEditing ? "task" : 'transparent',
                borderRadius: 2,
                position: 'relative',
                minWidth: '286px',
                maxWidth: '286px',
                display: 'flex',
                flexDirection: 'row',

            }}>
            {!isEditing
                ?
                <Box
                    onClick={handleNewTaskClick}
                    sx={{
                        height: '30px',
                        display: 'flex',
                        mt: 1,
                        ml: 0.8,
                        borderRadius: '2px',
                        color: 'info.main',
                        ':hover': {
                            cursor: 'pointer',
                            opacity: 0.6
                        }
                    }}>
                    <AddIcon sx={{fontSize: '22px', height: '30px', pb: '9px'}}/>

                    <Typography
                        sx={{
                            userSelect: "none",
                            fontSize: '0.9rem',
                            alignSelf: 'start',
                        }}
                    >
                        Добавить задачу
                    </Typography>
                </Box>
                :
                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <IconButton
                        sx={{width: '17px', opacity: 1, height: '17px', p: 0, ml: 1}}>
                        <UncheckedIcon color={"rgb(99,99,99)"} size={"17px"}/>
                    </IconButton>
                    <Typography
                        ref={typographyRef}
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        onInput={handleInput}
                        sx={{
                            m: 1,
                            zIndex: 2,
                            mr: 3,
                            userSelect: "none",
                            fontSize: '0.9rem',
                            overflowWrap: 'break-word',
                            wordBreak: 'break-all',
                            whiteSpace: 'normal',
                            outline: 'none',
                            borderBottom: isEditing ? '1px solid #90caf9' : 'none',
                            width: '227px',
                        }}
                    >
                    </Typography>

                </Box>
            }


        </Card>
    )
}