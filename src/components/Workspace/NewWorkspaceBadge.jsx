import {Box, IconButton, ListItemButton, ListItemIcon, ListItemText, Typography, useTheme} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";
import {workspaceCovers} from "../../services/util/Utils.jsx";
import ConflictException from "../../exception/ConflictException.jsx";
import {EditIcon} from "../../assets/icons/EditIcon.jsx";
import {useNotification} from "../../context/Notification/NotificationProvider.jsx";
import {sendCreateWs} from "../../services/fetch/tasks/ws/SendCreateWs.js";


export function NewWorkspaceBadge() {

    const {loadAllWorkspaces} = useTaskOperations();

    const [hovered, setHovered] = React.useState(false);

    const {userHasPermission} = useTaskOperations();

    const [isEditing, setIsEditing] = useState(false);
    const typographyRef = useRef(null);
    const lastSelectionRef = useRef(null);
    const [initialText, setInitialText] = useState("desk.name");
    const theme = useTheme();

    function getRandomCover() {
        return workspaceCovers[Math.floor(Math.random() * workspaceCovers.length)];
    }

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
        setHovered(false);
        const newText = typographyRef.current?.textContent.trim() || '';
        if (newText !== initialText && newText !== '') {
            try {
                const newNameWithDubls = newText + (duplicatedCount === 0 ? '' : (' (' + duplicatedCount + ')'));
                let newWs = await sendCreateWs(
                    {
                        name: newNameWithDubls,
                        isPublic: false,
                        coverUrl: getRandomCover()
                    });
                await loadAllWorkspaces();
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
        <>

            <ListItemButton sx={{pl: 2, maxHeight: 33,}} onClick={handleEditClick}>

                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        border: '1px solid',
                        borderColor: 'info.dark',
                        borderRadius: 3,
                        pr: 5,
                        width: '100%',
                        maxHeight: 28,
                    }}
                >
                    {!isEditing
                        ?
                        <>
                            <ListItemIcon>
                                <AddIcon sx={{fontSize: "20px", ml: 0.6}}/>
                            </ListItemIcon>
                            <ListItemText primary="Добавить" sx={{
                                '& .MuiTypography-root': {
                                    ml: -3,
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                }
                            }}/>
                        </>

                        :
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <ListItemIcon>
                                <AddIcon sx={{fontSize: "20px", ml: 0.6}}/>
                            </ListItemIcon>
                            <Typography
                                component="div"


                                ref={typographyRef}
                                contentEditable={isEditing}
                                suppressContentEditableWarning
                                onBlur={handleBlur}
                                onKeyDown={handleKeyDown}
                                onInput={handleInput}
                                sx={{

                                    zIndex: 2,
                                    p: 1,
                                    ml: -4,
                                    color: 'taskName',

                                    fontSize: '0.8rem',
                                    fontWeight: '400',
                                    alignSelf: 'start',
                                    minHeight: '30px',
                                    maxWidth: '100px',
                                    userSelect: "none",
                                    whiteSpace: 'nowrap',
                                    overflowX: 'auto',
                                    textOverflow: 'clip',
                                    outline: 'none',
                                    width: '250px',
                                    scrollbarWidth: 'none',
                                    '&::-webkit-scrollbar': {
                                        display: 'none'
                                    },

                                    msOverflowStyle: 'none'
                                }}
                            >
                                {userHasPermission('CREATE_DESK') && hovered && !isEditing && (
                                    <IconButton
                                        disableRipple
                                        sx={{width: '16px', height: '16px', p: 0, mb: '2px', ml: '2px'}}
                                        onClick={handleEditClick}
                                    >
                                        <EditIcon color={theme.palette.taskName} size="16px"/>
                                    </IconButton>
                                )}
                            </Typography>

                        </Box>
                    }
                </Box>
            </ListItemButton>

        </>
    )
}