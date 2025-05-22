import {createContext, useContext, useState} from "react";
import {sendGetAllWorkspaces} from "../../services/fetch/tasks/ws/SendGetAllWorkspaces.js";
import {sendGetFullWsInformation} from "../../services/fetch/tasks/ws/SendGetFullWsInformation.js";
import {useAuthContext} from "../Auth/AuthContext.jsx";


const TaskLoadContext = createContext(null);

export const useTaskOperations = () => useContext(TaskLoadContext);


export const TaskLoadProvider = ({children}) => {

    const [workspaces, setWorkspaces] = useState([]);

    const {auth} = useAuthContext();

    const [permissions, setPermissions] = useState([]);

    const [fullWorkspaceInformation, setFullWorkspaceInformation] = useState({
        createdAt: "2025-05-14T09:49:41.258378Z",
        desks: [],
        id: "67304ccb-4998-499a-a1c9-394eeb133ea1",
        name: "1"
    });

    async function loadAllWorkspaces() {
        try {
            const allWs = await sendGetAllWorkspaces();
            setWorkspaces(allWs)
            return allWs;
        } catch (error) {
            console.log("failed to load all workspaces " + error);
        }
    }

    function deleteWorkspace(workspace){
        setWorkspaces(prev =>
        prev.filter(w => w.id !== workspace.id))
    }

    async function loadFullWorkspace(workspace) {
        const fullWs = await sendGetFullWsInformation(workspace.api.links.fullAggregatedInfo.href);
        setFullWorkspaceInformation(fullWs)
        const uap = fullWs.usersAndPermissions.find(uap => uap.info.email === auth.user.email);

        setPermissions(uap.permissions);

        return fullWs;
    }

    function userHasPermission(permission) {
        if (permissions === null) {
            return false;
        }

        return permissions.includes(permission);
    }

    function addNewDesk(newDesk) {
        const fullDesk = {
            ...newDesk,
            tasks: []
        }

        setFullWorkspaceInformation(prev => ({
            ...prev, // Копируем все существующие поля
            desks: [...prev.desks, fullDesk] // Создаем новый массив desks со старыми элементами + новый элемент
        }));
    }

    function deleteDesk(deskToDelete) {
        setFullWorkspaceInformation(prev => ({
            ...prev, // Копируем все существующие поля
            desks: prev.desks.filter(desk => desk.id !== deskToDelete.id) // Фильтруем массив, оставляя только элементы с id не равным deskId
        }));
    }

    function updateDeskOrder(deskIndex, deskForUpdate) {
        setFullWorkspaceInformation(prevData => {

            const updatedDesks = [...prevData.desks];
            updatedDesks[deskIndex] = {
                ...updatedDesks[deskIndex],
                orderIndex: deskForUpdate.orderIndex
            };
            console.log(updatedDesks)
            return {
                ...prevData,
                desks: updatedDesks
            }

        })
    }

    function updateDeskColor(deskForUpdate) {
        const deskIdForUpdate = deskForUpdate.id;
        setFullWorkspaceInformation(prevData => {
            const deskIndex = prevData.desks.findIndex(desk => desk.id === deskIdForUpdate);
            if (deskIndex === -1) {
                console.error("Desk not found");
                return prevData;
            }


            const updatedDesks = [...prevData.desks];
            updatedDesks[deskIndex] = {
                ...updatedDesks[deskIndex],
                color: deskForUpdate.color
            };
            console.log(updatedDesks)
            return {
                ...prevData,
                desks: updatedDesks
            }

        })
    }

    function updateDeskName(deskForUpdate) {
        const deskIdForUpdate = deskForUpdate.id;
        setFullWorkspaceInformation(prevData => {
            const deskIndex = prevData.desks.findIndex(desk => desk.id === deskIdForUpdate);
            if (deskIndex === -1) {
                console.error("Desk not found");
                return prevData;
            }


            const updatedDesks = [...prevData.desks];
            updatedDesks[deskIndex] = {
                ...updatedDesks[deskIndex],
                name: deskForUpdate.name
            };
            console.log(updatedDesks)
            return {
                ...prevData,
                desks: updatedDesks
            }

        })
    }

    function moveTaskToAnotherDesk(movingTask, targetDesk) {
        console.log(movingTask, targetDesk)
        const deskIdInMovingTask = movingTask.deskId;
        setFullWorkspaceInformation(prevData => {
            const movingTaskDeskIndex = prevData.desks.findIndex(desk => desk.id === deskIdInMovingTask);
            if (movingTaskDeskIndex === -1) {
                console.error("Desk not found");
                return prevData;
            }

            const updatedDesks = [...prevData.desks];
            updatedDesks[movingTaskDeskIndex] = {
                ...updatedDesks[movingTaskDeskIndex],
                tasks: updatedDesks[movingTaskDeskIndex].tasks.filter(t => t.id !== movingTask.id)
            };


            const targetDeskIndex = prevData.desks.findIndex(d => d.id === targetDesk)

            const alreadyExists = updatedDesks[targetDeskIndex].tasks.findIndex(t => t.name === movingTask.name);
            if (alreadyExists !== -1) {
                return prevData;
            }

            const newTask = {
                ...movingTask,
                deskId: targetDesk
            }

            updatedDesks[targetDeskIndex] = {
                ...updatedDesks[targetDeskIndex],
                tasks: [...updatedDesks[targetDeskIndex].tasks, newTask]
            }
            console.log(updatedDesks)
            return {
                ...prevData,
                desks: updatedDesks
            }

        })
        return true;
    }

    function updateLinks(api, newDeskId) {
        return Object.entries(api.links).map(([key, url]) => [
                key,
                url
            ]
        );
    }

    function refreshTask(updatedTask) {
        const deskIdForUpdate = updatedTask.deskId;
        setFullWorkspaceInformation(prevData => {
            const deskIndex = prevData.desks.findIndex(desk => desk.id === deskIdForUpdate);
            if (deskIndex === -1) {
                console.error("Desk not found");
                return prevData;
            }

            const updatedDesks = [...prevData.desks];

            const taskForUpdateIndex = updatedDesks[deskIndex].tasks.findIndex(task => task.id === updatedTask.id);

            const updatedTasks = updatedDesks[deskIndex].tasks;

            updatedTasks[taskForUpdateIndex] = {
                ...updatedTasks[taskForUpdateIndex],
                api: updatedTask.api
            }

            updatedDesks[deskIndex] = {
                ...updatedDesks[deskIndex],
                tasks: updatedTasks
            };
            console.log(updatedDesks)
            return {
                ...prevData,
                desks: updatedDesks
            }

        })
    }

    function addNewTask(newTask) {
        console.log(newTask);
        console.log(fullWorkspaceInformation)
        const deskIdForUpdate = newTask.deskId;
        setFullWorkspaceInformation(prevData => {
            const deskIndex = prevData.desks.findIndex(desk => desk.id === deskIdForUpdate);
            if (deskIndex === -1) {
                console.error("Desk not found");
                return prevData;
            }


            const updatedDesks = [...prevData.desks];
            updatedDesks[deskIndex] = {
                ...updatedDesks[deskIndex],
                tasks: [...updatedDesks[deskIndex].tasks, newTask]
            };
            console.log(updatedDesks)
            return {
                ...prevData,
                desks: updatedDesks
            }

        })
    }

    function deleteTask(taskToDelete) {
        const deskIdForUpdate = taskToDelete.deskId;
        setFullWorkspaceInformation(prevData => {
            const deskIndex = prevData.desks.findIndex(desk => desk.id === deskIdForUpdate);
            if (deskIndex === -1) {
                console.error("Desk not found");
                return prevData;
            }

            const updatedDesks = [...prevData.desks];
            updatedDesks[deskIndex] = {
                ...updatedDesks[deskIndex],
                tasks: updatedDesks[deskIndex].tasks.filter(t => t.id !== taskToDelete.id)
            };
            console.log(updatedDesks)
            return {
                ...prevData,
                desks: updatedDesks
            }

        })
    }

    function updateTaskColor(updatedTask) {
        const deskIdForUpdate = updatedTask.deskId;
        setFullWorkspaceInformation(prevData => {
            const deskIndex = prevData.desks.findIndex(desk => desk.id === deskIdForUpdate);
            if (deskIndex === -1) {
                console.error("Desk not found");
                return prevData;
            }

            const updatedDesks = [...prevData.desks];

            const taskForUpdateIndex = updatedDesks[deskIndex].tasks.findIndex(task => task.id === updatedTask.id);

            const updatedTasks = updatedDesks[deskIndex].tasks;

            updatedTasks[taskForUpdateIndex] = {
                ...updatedTasks[taskForUpdateIndex],
                color: updatedTask.color
            }

            updatedDesks[deskIndex] = {
                ...updatedDesks[deskIndex],
                tasks: updatedTasks
            };
            console.log(updatedDesks)
            return {
                ...prevData,
                desks: updatedDesks
            }

        })
    }

    function updateTaskOrder(deskIndex, taskForUpdateIndex, updatedTask) {
        setFullWorkspaceInformation(prevData => {

            const updatedDesks = [...prevData.desks];

            const updatedTasks = updatedDesks[deskIndex].tasks;

            updatedTasks[taskForUpdateIndex] = {
                ...updatedTasks[taskForUpdateIndex],
                orderIndex: updatedTask.orderIndex
            }

            updatedDesks[deskIndex] = {
                ...updatedDesks[deskIndex],
                tasks: updatedTasks
            };
            console.log(updatedDesks)
            return {
                ...prevData,
                desks: updatedDesks
            }

        })
    }

    function updateTaskName(updatedTask) {
        const deskIdForUpdate = updatedTask.deskId;
        setFullWorkspaceInformation(prevData => {
            const deskIndex = prevData.desks.findIndex(desk => desk.id === deskIdForUpdate);
            if (deskIndex === -1) {
                console.error("Desk not found");
                return prevData;
            }

            const updatedDesks = [...prevData.desks];

            const taskForUpdateIndex = updatedDesks[deskIndex].tasks.findIndex(task => task.id === updatedTask.id);

            const updatedTasks = updatedDesks[deskIndex].tasks;

            updatedTasks[taskForUpdateIndex] = {
                ...updatedTasks[taskForUpdateIndex],
                name: updatedTask.name
            }

            updatedDesks[deskIndex] = {
                ...updatedDesks[deskIndex],
                tasks: updatedTasks
            };
            console.log(updatedDesks)
            return {
                ...prevData,
                desks: updatedDesks
            }

        })
    }

    function updateTaskCompletion(updatedTask) {
        const deskIdForUpdate = updatedTask.deskId;
        setFullWorkspaceInformation(prevData => {
            const deskIndex = prevData.desks.findIndex(desk => desk.id === deskIdForUpdate);
            if (deskIndex === -1) {
                console.error("Desk not found");
                return prevData;
            }

            const updatedDesks = [...prevData.desks];

            const taskForUpdateIndex = updatedDesks[deskIndex].tasks.findIndex(task => task.id === updatedTask.id);

            const updatedTasks = updatedDesks[deskIndex].tasks;

            updatedTasks[taskForUpdateIndex] = {
                ...updatedTasks[taskForUpdateIndex],
                completed: updatedTask.completed
            }

            updatedDesks[deskIndex] = {
                ...updatedDesks[deskIndex],
                tasks: updatedTasks
            };
            console.log(updatedDesks)
            return {
                ...prevData,
                desks: updatedDesks
            }

        })
    }

//todo add name updating also heher
    return (
        <TaskLoadContext.Provider value={{
            workspaces,
            loadAllWorkspaces,

            loadFullWorkspace,
            fullWorkspaceInformation,
            setFullWorkspaceInformation,
            deleteWorkspace,

            permissions,
            userHasPermission,

            addNewTask,
            deleteTask,
            updateTaskColor,
            updateTaskCompletion,
            updateTaskName,
            moveTaskToAnotherDesk,
            updateTaskOrder,
            refreshTask,

            addNewDesk,
            deleteDesk,
            updateDeskColor,
            updateDeskOrder,
            updateDeskName
        }}>
            {children}
        </TaskLoadContext.Provider>
    );
}