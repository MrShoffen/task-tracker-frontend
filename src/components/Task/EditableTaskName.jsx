import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {sendEditTask} from "../../services/fetch/tasks/task/SendEditTask.js";
import {Box, IconButton, Typography, useTheme} from "@mui/material";
import {EditIcon} from "../../assets/icons/EditIcon.jsx";
import ConflictException from "../../exception/ConflictException.jsx";
import {useNotification} from "../../context/Notification/NotificationProvider.jsx";

export function EditableTaskName({task = {name: ''}, taskCompleted, hovered, disableDragging}) {

    const {userHasPermission, updateTaskField} = useTaskOperations();
    const theme = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const typographyRef = useRef(null);
    const lastSelectionRef = useRef(null);
    const [initialText, setInitialText] = useState(task.name);
    const {showWarn} = useNotification();

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

    const handleEditClick = () => {
        setIsEditing(true);
        disableDragging(true);
    };

    const handleBlur = async (event, duplicatedCount = 0) => {
        saveSelection();
        const newText = typographyRef.current?.textContent.trim() || '';
        if (newText !== initialText && newText !== '') {
            try {
                const newNameWithDubls = newText + (duplicatedCount === 0 ? '' : (' (' + duplicatedCount + ')'));
               await sendEditTask(task.api.links.updateTaskName.href,
                    {
                        newName: newNameWithDubls
                    });
                typographyRef.current.textContent = newNameWithDubls + ' ';
                updateTaskField(task.deskId, task.id, 'name', newNameWithDubls);
            } catch (error) {
                switch (true) {
                    case error instanceof ConflictException:
                        await handleBlur(event, duplicatedCount + 1);
                        break;
                    default:
                        console.log(error);
                        showWarn(error.message);
                        typographyRef.current.textContent = initialText;
                }

            }
        } else {
            typographyRef.current.textContent = initialText;
        }
        setIsEditing(false);
        disableDragging(false);
    };

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            await handleBlur();
        } else if (e.key === 'Escape') {
            typographyRef.current.textContent = task.name;
            typographyRef.current?.blur();
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
        <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography
                component="div"
                ref={typographyRef}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onInput={handleInput}
                sx={{
                    m: 1,
                    opacity: isEditing || !taskCompleted ? 1 : (!hovered ? 0.5 : 1),
                    zIndex: 2,
                    color: 'taskName',
                    mr: 3,
                    userSelect: "none",
                    fontSize: '14px',
                    alignSelf: 'start',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-all',
                    whiteSpace: 'normal',
                    borderBottom: isEditing ? '1px solid #90caf9' : 'none',
                    outline: 'none',
                    width: '227px',
                    cursor: isEditing? 'text' : 'pointer'
                }}
            >
                {task.name} {userHasPermission('UPDATE_TASK_NAME') && hovered && !isEditing && (
                <IconButton disableRipple
                            sx={{width: '16px', height: '16px', p: 0, mb: '2px', ml: '2px'}}
                            onClick={handleEditClick}
                >
                    <EditIcon color={theme.palette.taskName} size="16px"/>
                </IconButton>
            )}
            </Typography>

        </Box>
    );
}
