import {Box, CircularProgress} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useTaskOperations} from "../context/Tasks/TaskLoadProvider.jsx";
import WorkspaceHeader from "../components/Workspace/WorkspaceHeader.jsx";
import {useNotification} from "../context/Notification/NotificationProvider.jsx";
import {TaskDesk} from "../components/Desk/TaskDesk.jsx";


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
            if (currentWs !== null) {
                const content = await loadFullWorkspace(currentWs);
                console.log(content);
                setWorkspaceLoading(false);
            }
        } catch (error) {
            console.log(error);
            navigate("/profile");
            showWarn("Страница не найдена");
        }
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
            flex: 1
        }}>
            {workspaceLoading
                ?

                <Box sx={{
                    height: '65px',
                    backgroundColor: 'header',
                    position: 'sticky',
                    alignItems: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'action.selected',
                    px: 2,
                    boxShadow: 3
                }}>
                    <CircularProgress/> </Box> :
                <WorkspaceHeader workspace={fullWorkspaceInformation}/>
            }
            <Box sx={{
                width: '100%',
                minHeight: 0,
                justifyContent: 'left',
                fontSize: '0.9rem',
            }}>
                <Box
                    sx={{
                        display: "flex",
                        height: '100%',
                        flexDirection: "row",
                        m: 2,
                        gap: 1.5
                    }}>
                    {fullWorkspaceInformation
                        .desks
                        .sort((a, b) => a.orderIndex - b.orderIndex)
                        .map(desk =>
                            <TaskDesk key={desk.id} desk={desk}/>)
                    }
                </Box>
            </Box>
        </Box>
    )
}