import {Box, Card, CircularProgress, IconButton, ListItemIcon, useTheme} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useNotification} from "../context/Notification/NotificationProvider.jsx";
import {sendGetPublicWs} from "../services/fetch/tasks/ws/SendGetPublicWs.js";
import Typography from "@mui/material/Typography";
import {useSortable} from "@dnd-kit/sortable";
import {useTaskOperations} from "../context/Tasks/TaskLoadProvider.jsx";
import {darkTaskColor, deskColor, lightTaskColor} from "../services/util/Utils.jsx";
import {useCustomThemeContext} from "../context/GlobalThemeContext/CustomThemeProvider.jsx";
import {sendEditTask} from "../services/fetch/tasks/task/SendEditTask.js";
import {TaskCover} from "../components/Task/TaskCover.jsx";
import {UncheckedIcon} from "../assets/icons/UncheckedIcon.jsx";
import {CheckedIcon} from "../assets/icons/CheckedIcon.jsx";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import LightModeIcon from "@mui/icons-material/LightMode";


function PublicTask({task}) {
    const [hovered, setHovered] = React.useState(false);
    const theme = useTheme();
    const {isDarkMode} = useCustomThemeContext();

    const taskColor = (taskColor) => {
        return !isDarkMode ? lightTaskColor[taskColor] : darkTaskColor[taskColor];
    }

    return (
        <div
        >
            <Card
                elevation={1}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                sx={{
                    ml: '7px',
                    marginBottom: '10px',
                    flex: 1,
                    border: '1px solid',
                    borderColor: !hovered ? taskColor(task.color) : 'action.disabled',
                    borderRadius: 2,
                    position: 'relative',
                    minWidth: '286px',
                    maxWidth: '286px',
                    transition: 'none',
                    backgroundColor: taskColor(task.color),
                    display: 'flex',
                    fontSize: '10px',
                    flexDirection: 'column',
                    ':hover': {
                        cursor: 'pointer',
                    }
                }}>

                <Box>
                    {task.coverUrl && <TaskCover coverUrl={task.coverUrl}/>}

                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        <IconButton
                            sx={{width: '17px', opacity: 1, height: '17px', p: 0, ml: 1, mt: 1.2,}}>
                            {!task.completed
                                ? <UncheckedIcon color={theme.palette.taskName} size={"17px"}/>
                                : <CheckedIcon size="17px"/>
                            }
                        </IconButton>

                        <Box sx={{display: 'flex', flexDirection: 'column'}}>
                            <Typography
                                component="div"
                                suppressContentEditableWarning
                                sx={{
                                    m: 1,
                                    zIndex: 2,
                                    color: 'taskName',
                                    mr: 3,
                                    userSelect: "none",
                                    fontSize: '14px',
                                    alignSelf: 'start',
                                    overflowWrap: 'break-word',
                                    wordBreak: 'break-all',
                                    whiteSpace: 'normal',
                                    outline: 'none',
                                    width: '227px',
                                }}
                            >
                                {task.name}
                            </Typography>
                        </Box>

                    </Box>
                </Box>
            </Card>
        </div>
    )
}

function PublicDesk({desk, sx}) {
    return (
        <div
        >
            <Card
                elevation={0}
                sx={{
                    boxShadow: 1,
                    borderRadius: 3,
                    position: 'relative',
                    width: '300px',
                    backgroundColor: deskColor(desk.color),
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: 'calc(100vh - 100px)', // Ограничение максимальной высоты
                    ...sx
                }}>

                <Box
                    sx={{
                        backgroundColor: deskColor(desk.color),
                        height: '15px',
                    }}
                />
                <Box
                    sx={{
                        backgroundColor: 'desk',
                        width: '360px',
                        top: '8px',
                        left: '-30px',
                        borderRadius: 12.5,
                        position: 'absolute',
                        height: '9000px',
                        // zIndex: 200,
                    }}
                />
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    pb: 1.5

                    // flexShrink: 0, // Фиксированная высота
                }}>
                    <Typography
                        component="div"
                        suppressContentEditableWarning

                        sx={{
                            m: 1,
                            ml: 2,
                            zIndex: 2,
                            color: 'taskName',
                            // backgroundColor: 'desk',
                            fontSize: '18px',
                            fontWeight: '500',
                            alignSelf: 'start',
                            mr: 3,
                            userSelect: "none",
                            overflowWrap: 'break-word',
                            wordBreak: 'break-all',
                            whiteSpace: 'normal',
                            outline: 'none',
                            width: '250px',
                        }}
                    >
                        {desk.name}

                        <Box
                            sx={{
                                backgroundColor: 'task',
                                boxShadow: '2px',
                                borderRadius: '9px',
                                borderColor: 'action.disabled',
                                display: 'inline-flex',
                                minWidth: '18px',
                                height: '18px',
                                ml: 1,
                                alignItems: 'center', // выравнивание по вертикали
                                justifyContent: 'center', // выравнивание по горизонтали

                            }}>
                            <Typography
                                sx={{
                                    fontWeight: 500,
                                    fontSize: '12px',
                                    color: 'text.secondary',
                                    mb: 'px',
                                    p: 1,
                                }}
                            >
                                {desk.tasks && desk.tasks.length}
                            </Typography>
                        </Box>
                    </Typography>

                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden', // Скрываем переполнение
                    position: 'relative',
                }}>
                    {/* Внутренний контейнер с прокруткой */}
                    <Box sx={{
                        overflowY: 'auto',
                        flex: 1,
                        '&::-webkit-scrollbar': {
                            width: '7px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'action.disabled',
                            borderRadius: '3px',
                            visibility: 'hidden', // Скрываем по умолчанию
                            transition: 'visibility 0.6s ease',
                        },
                        '&:hover::-webkit-scrollbar-thumb': {
                            visibility: 'visible', // Показываем при наведении на область прокрутки
                        }


                    }}>
                        {desk.tasks && desk.tasks
                            .sort((a, b) => b.orderIndex - a.orderIndex)
                            .map(task =>
                                <PublicTask
                                    key={task.id}
                                    task={task}
                                />
                            )
                        }
                    </Box>
                </Box>

            </Card>
        </div>
    )
}

export default function PublicWsPage() {


    const navigate = useNavigate();
    const location = useLocation();
    const {showWarn} = useNotification();
    const {isDarkMode, toggleTheme} = useCustomThemeContext();

    const [onConcreteWs, setOnConcreteWs] = useState(false);
    const [workspaceLoading, setWorkspaceLoading] = useState(true);

    const [publicWs, setPublicWs] = useState(null);

    useEffect(() => {
        checkAndLoadWorkspace();
    }, [location.pathname]);

    async function checkAndLoadWorkspace() {

        const workspaceId = location.pathname.replace("/public-workspaces/", '');
        try {
            setWorkspaceLoading(true);
            setOnConcreteWs(true);
            const loadedWorkspace = await sendGetPublicWs(workspaceId);
            console.log(loadedWorkspace)
            setPublicWs(loadedWorkspace);
            setWorkspaceLoading(false);
            setOnConcreteWs(true);

        } catch (error) {
            console.log(error);
            navigate("/profile");
            showWarn(error.message);
        }

    }


    if (!onConcreteWs) {
        return (
            <Box></Box>
        )
    }

    return (
        <Box

            sx={theme => ({
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                overflow: 'hidden',
                ...(publicWs?.coverUrl !== null && {
                    '&::before': {
                        content: '""',
                        position: 'fixed',
                        zIndex: 0,
                        bottom: 0,
                        left: 0,

                        width: '100%',
                        height: '100%',

                        backgroundImage: `url(${publicWs?.coverUrl})`, // Путь к изображению
                        backgroundSize: 'cover', // или 'contain' в зависимости от потребностей
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundAttachment: 'fixed', // Фиксированный фон при скролле
                        filter: theme.palette.mode === 'dark' ? 'brightness(0.7)' : 'none'
                    }
                })

            })

            }>
            {/* Хедер - фиксированная высота */}
            {workspaceLoading ? (
                <Box sx={{
                    height: '65px',
                    backgroundColor: 'header',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    alignItems: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'action.selected',
                    px: 2,
                    boxShadow: 3,
                    flexShrink: 0
                }}>
                    <CircularProgress/>
                </Box>
            ) : (
                <Box sx={{
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    height: '65px',
                    backgroundColor: 'header',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1100,
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'action.selected',
                    px: 2,
                    boxShadow: 3
                }}>
                    <Typography variant="h6" sx={{
                        ml: 2,
                        maxWidth: '250px', textAlign: 'left',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        userSelect: 'none'
                    }}>
                        {publicWs.name}
                    </Typography>
                    <Typography variant="h7" sx={{
                    ml: 2,
                    userSelect: 'none'
                }}>
                    {'(Публичный проект)'}
                </Typography>
                    <IconButton
                        sx={{
                            // maxHeight: 40,
                            justifyContent: open ? "initial" : "center",
                            // px: 2.5,
                        }}
                        onClick={toggleTheme}
                    >
                        {!isDarkMode ? <ModeNightIcon sx={{fontSize: "20px"}}/> :
                            <LightModeIcon sx={{fontSize: "20px"}}/>}


                    </IconButton>
                </Box>
            )}

            {/* Основной контент с горизонтальным скроллом */}
            <Box sx={{
                flex: 1,
                minHeight: 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
            }}>
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    px: 2,
                    py: 2
                }}>

                    <Box sx={{
                        display: 'inline-flex',
                        gap: 1.5,
                        // mr: 200,
                        alignItems: 'flex-start',
                        height: 'fit-content'
                    }}>

                        {publicWs?.desks
                            ?.sort((a, b) => a.orderIndex - b.orderIndex)
                            .map(desk => (
                                <PublicDesk
                                    key={desk.id}
                                    desk={desk}
                                    sx={{
                                        flexShrink: 0
                                    }}
                                />
                            ))}

                    </Box>

                </Box>
            </Box>

        </Box>
    )
}