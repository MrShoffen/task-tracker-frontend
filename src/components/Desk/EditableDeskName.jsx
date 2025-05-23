import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {Box, IconButton, Typography, useTheme} from "@mui/material";
import {EditIcon} from "../../assets/icons/EditIcon.jsx";
import ConflictException from "../../exception/ConflictException.jsx";
import {sendEditDesk} from "../../services/fetch/tasks/desk/SendEditDesk.js";
import {useNotification} from "../../context/Notification/NotificationProvider.jsx";

export function EditableDeskName({desk = {name: ''}}) {
    const [hovered, setHovered] = React.useState(false);

    const {userHasPermission, updateDeskName} = useTaskOperations();

    const [isEditing, setIsEditing] = useState(false);
    const typographyRef = useRef(null);
    const lastSelectionRef = useRef(null);
    const [initialText, setInitialText] = useState(desk.name);
    const theme = useTheme();

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
    };

    const {showWarn} = useNotification();

    const handleBlur = async (event, duplicatedCount = 0) => {
        saveSelection();
        const newText = typographyRef.current?.textContent.trim() || '';
        if (newText !== initialText && newText !== '') {
            try {
                const newNameWithDubls = newText + (duplicatedCount === 0 ? '' : (' (' + duplicatedCount + ')'));
                await sendEditDesk(desk.api.links.updateDeskName.href,
                    {
                        newName: newNameWithDubls.trim()
                    });
                updateDeskName(desk.id, newNameWithDubls);
                typographyRef.current.textContent = newNameWithDubls + ' ';
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
    };

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            await handleBlur();
        } else if (e.key === 'Escape') {
            typographyRef.current.textContent = desk.name;
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
        <Box sx={{display: 'flex', alignItems: 'center'}}
        >
            <Typography
                component="div"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                ref={typographyRef}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onInput={handleInput}
                sx={{
                    m: 1,
                    ml: 2,
                    zIndex: 2,
                    color: 'taskName',
                    fontSize: '18px',
                    fontWeight: '500',
                    alignSelf: 'start',
                    mr: 3,
                    userSelect: "none",
                    overflowWrap: 'break-word',
                    wordBreak: 'break-all',
                    whiteSpace: 'normal',
                    borderBottom: isEditing ? '1px solid #90caf9' : 'none',
                    outline: 'none',
                    width: '250px',
                }}
            >
                {desk.name} {userHasPermission('UPDATE_DESK') && hovered && !isEditing && (
                <IconButton
                    disableRipple
                    sx={{width: '16px', height: '16px', p: 0, mb: '2px', ml: '2px'}}
                    onClick={handleEditClick}
                >
                    <EditIcon color={theme.palette.taskName} size="16px"/>
                </IconButton>
            )}

                {!hovered && !isEditing && (
                    <Box
                        sx={{
                            backgroundColor: 'task',
                            boxShadow: '2px',
                            borderRadius: '9px',
                            borderColor: 'action.disabled',
                            display: 'inline-flex',
                            minWidth: '18px',
                            height: '18px',
                            alignItems: 'center',
                            justifyContent: 'center',

                        }}>
                        <Typography
                            sx={{
                                fontWeight: 500,
                                fontSize: '12px',
                                color: 'text.secondary',
                                mb: 'px',
                                p: 1
                            }}
                        >
                            {desk.tasks && desk.tasks.length}
                        </Typography>
                    </Box>
                )}
            </Typography>

        </Box>
    );
}
