import {Backdrop, Box, Card, CircularProgress, IconButton, Typography, useTheme} from "@mui/material";
import {deskColor, randomDeskColor} from "../../services/util/Utils.js";
import {EditableDeskName} from "./EditableDeskName.jsx";
import {DeskMenu} from "./DeskMenu.jsx";
import {NewTaskBadge} from "../Task/NewTaskBadge.jsx";
import {Task} from "../Task/Task.jsx";
import * as React from "react";
import {EditIcon} from "../../assets/icons/EditIcon.jsx";
import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";
import {useEffect, useRef, useState} from "react";
import {NewDeskIcon} from "../../assets/icons/NewDesk.jsx";
import {sendCreateDesk} from "../../services/fetch/tasks/desk/SendCreateDesk.js";
import ConflictException from "../../exception/ConflictException.jsx";

export const NewDeskBadge = () => {
    const {fullWorkspaceInformation, addNewDesk} = useTaskOperations();

    const [hovered, setHovered] = React.useState(false);

    const {userHasPermission} = useTaskOperations();

    const [isEditing, setIsEditing] = useState(false);
    const typographyRef = useRef(null);
    const lastSelectionRef = useRef(null);
    const [initialText, setInitialText] = useState("desk.name");
    const theme = useTheme();

    // Сохраняем выделение перед обновлением
    const saveSelection = () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            lastSelectionRef.current = selection.getRangeAt(0);
        }
    };

    // Восстанавливаем выделение после обновления
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


    const handleBlur = async (event, duplicatedCount = 0) => {
        saveSelection();
        setHovered(false);
        const newText = typographyRef.current?.textContent.trim() || '';
        if (newText !== initialText && newText !== '') { // Сравниваем с исходным текстом
            try {
                const newNameWithDubls = newText + (duplicatedCount === 0 ? '' : (' (' + duplicatedCount + ')'));
                let newDesk = await sendCreateDesk(fullWorkspaceInformation.api.links.createDesk.href,
                    {
                        name: newNameWithDubls,
                        color: randomDeskColor()
                    });
                addNewDesk(newDesk);
            } catch (error) {
                switch (true) {
                    case error instanceof ConflictException:
                        await handleBlur(event, duplicatedCount + 1);
                        break;
                    default:
                        console.log(error);
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
        // Не используем setText, чтобы избежать лишних ререндеров
    };

    useEffect(() => {
        if (isEditing && typographyRef.current) {
            typographyRef.current.focus();

            // Помещаем курсор в конец текста только при первом открытии
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


    function handleNewDeskCreation() {
        setIsEditing(true);
    }

    return (<>
            {
                !isEditing ?
                    <Card
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        onClick={handleNewDeskCreation}
                        elevation={0}
                        sx={{
                            boxShadow: 1,
                            borderRadius: 2,
                            position: 'relative',
                            maxWidth: '165px',
                            minWidth: '165px',
                            border: '1px solid',
                            borderColor: 'action.disabled',
                            height: '33px',
                            backgroundColor: 'desk',
                            display: 'flex',
                            cursor: 'pointer',
                            color: hovered ? 'rgb(0,137,246)' : 'taskName',
                            flexDirection: 'column',
                            // maxHeight: 'calc(100vh - 97px)', // Ограничиваем высоту карточки

                        }}>
                        <Box sx={{
                            display: 'flex',
                            gap: 0.6, pt: '9px',
                            pl: 1.5,
                            flexDirection: 'row',
                        }}>

                            <NewDeskIcon color={theme.palette.taskName} hovered={hovered}/>
                            <Typography sx={{fontSize: '0.9rem', p: 0, mt: '-3px', userSelect: 'none'}}>Новая
                                доска</Typography>
                        </Box>
                    </Card>
                    :
                    <Card
                        elevation={0}
                        sx={{
                            boxShadow: 1,
                            borderRadius: 3,
                            position: 'relative',
                            maxWidth: '300px',
                            minWidth: '300px',
                            minHeight: 22,
                            height: '100%',
                            backgroundColor: 'desk',
                            display: 'flex',
                            flexDirection: 'column',
                            // maxHeight: 'calc(100vh - 97px)', // Ограничиваем высоту карточки

                        }}>
                        <Box sx={{display: 'flex', alignItems: 'center'}}
                        >
                            <Typography
                                component="div"
                                // onMouseEnter={() => setHovered(true)}
                                // onMouseLeave={() => setHovered(false)}
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
                                    // backgroundColor: 'desk',
                                    fontSize: '18px',
                                    fontWeight: '500',
                                    alignSelf: 'start',
                                    minHeight: '30px',
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
                    </Card>
            }
        </>

    )

}