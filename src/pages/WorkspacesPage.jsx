import {Box, CircularProgress} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useTaskOperations} from "../context/Tasks/TaskLoadProvider.jsx";
import WorkspaceHeader from "../components/Workspace/WorkspaceHeader.jsx";
import {useNotification} from "../context/Notification/NotificationProvider.jsx";
import {TaskDesk} from "../components/Desk/TaskDesk.jsx";
import {NewDeskBadge} from "../components/Desk/NewDeskBadge.jsx";

export default function WorkspacesPage() {
    const {fullWorkspaceInformation, workspaces, loadFullWorkspace, loadAllWorkspaces} = useTaskOperations();

    const navigate = useNavigate();
    const location = useLocation();
    const {showWarn} = useNotification();

    const [onConcreteWs, setOnConcreteWs] = useState(false);
    const [workspaceLoading, setWorkspaceLoading] = useState(true);

    async function checkAndLoadWorkspace() {
        const workspaceId = location.pathname.replace("/workspaces/", '');

        try {
            setWorkspaceLoading(true);
            setOnConcreteWs(true);
            let loadedWorkspaces = workspaces;
            if (loadedWorkspaces.length === 0) {
                loadedWorkspaces = await loadAllWorkspaces();
            }

            const currentWs = loadedWorkspaces.find(ws => ws.id === workspaceId);
            console.log('current workspace', currentWs);
            // if (currentWs !== null) {
                const content = await loadFullWorkspace(currentWs);
                console.log(content);
                setWorkspaceLoading(false);
            // }
        } catch (error) {
            console.log(error);
            navigate("/profile");
            showWarn("Страница не найдена");
        }
    }

    const addNewDesk = (newDesk) => {

    }

    useEffect(() => {
        checkAndLoadWorkspace();
    }, [location.pathname]);

    if (!onConcreteWs) {
        return (
            <Box></Box>
        )
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'hidden'
        }}>
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
                <WorkspaceHeader workspace={fullWorkspaceInformation}/>
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
                        alignItems: 'flex-start',
                        height: 'fit-content'
                    }}>
                        {fullWorkspaceInformation?.desks
                            ?.sort((a, b) => a.orderIndex - b.orderIndex)
                            .map(desk => (
                                <TaskDesk
                                    key={desk.id}
                                    desk={desk}
                                    sx={{
                                        flexShrink: 0
                                    }}
                                />
                            ))}
                        <NewDeskBadge/>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}