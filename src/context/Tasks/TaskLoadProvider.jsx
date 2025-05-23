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

    function deleteWorkspace(workspace) {
        setWorkspaces(prev =>
            prev.filter(w => w.id !== workspace.id))
    }

    async function loadFullWorkspace(workspace) {
        const fullWs = await sendGetFullWsInformation(workspace.api.links.fullAggregatedInfo.href);
        setFullWorkspaceInformation(fullWs)
        const uap = fullWs.usersAndPermissions.find(uap => uap.info.email === auth.user.email);

        setPermissions(uap?.permissions);

        return fullWs;
    }

    async function loadFullWs(wsId) {
        const fullWs = await sendGetFullWsInformation("/api/v1/workspaces/" + wsId + "/full");
        setFullWorkspaceInformation(fullWs)
        const uap = fullWs.usersAndPermissions.find(uap => uap.info.email === auth.user.email);

        setPermissions(uap?.permissions);

        return fullWs;
    }

    function userHasPermission(permission) {
        if (permissions === null) {
            return false;
        }

        return permissions.includes(permission);
    }

    function updateWsField(field, newVal) {
        setFullWorkspaceInformation(prev => ({
            ...prev,
            [field]: newVal
        }))
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

    function addNewPermission(uap, email) {
        const alreadyExists = fullWorkspaceInformation.usersAndPermissions
            .findIndex(u => u.info.email === email);
        if(alreadyExists !== -1){
            setFullWorkspaceInformation(prev => ({
                ...prev,
                usersAndPermissions: prev.usersAndPermissions.filter(u => u.userId !== uap.userId)
            }))
        }
        setFullWorkspaceInformation(prev => ({
            ...prev,
            usersAndPermissions: [...prev.usersAndPermissions,
                {
                    ...uap,
                    info: {
                        email: email
                    }
                }]
        }))
    }

    function deletePermission(userId){
        setFullWorkspaceInformation(prev => ({
            ...prev,
            usersAndPermissions: prev.usersAndPermissions.filter(u => u.userId !== userId)
        }))
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

    function updateDeskField(deskIdForUpdate, field, newVal) {
        setFullWorkspaceInformation(prevData => {
            const deskIndex = prevData.desks.findIndex(desk => desk.id === deskIdForUpdate);
            if (deskIndex === -1) {
                console.error("Desk not found");
                return prevData;
            }

            const updatedDesks = [...prevData.desks];
            updatedDesks[deskIndex] = {
                ...updatedDesks[deskIndex],
                [field]: newVal
            };
            return {
                ...prevData,
                desks: updatedDesks
            }

        })
    }

    function moveTaskToAnotherDesk(movingTask, targetDesk) {
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

            if (updatedDesks[targetDeskIndex]
                .tasks.findIndex(t => t.name === movingTask.name) !== -1) {
                return prevData;
            }

            updatedDesks[targetDeskIndex] = {
                ...updatedDesks[targetDeskIndex],
                tasks: [...updatedDesks[targetDeskIndex].tasks, {...movingTask, deskId: targetDesk}]
            }

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

    function updateTaskField(deskIdForUpdate, taskIdForUpdate, fieldName, newValue) {
        setFullWorkspaceInformation(prevData => {
            const deskIndex = prevData.desks.findIndex(desk => desk.id === deskIdForUpdate);
            if (deskIndex === -1) {
                console.error("Desk not found");
                return prevData;
            }

            const updatedDesks = [...prevData.desks];
            const taskIndex = updatedDesks[deskIndex].tasks.findIndex(task => task.id === taskIdForUpdate);

            if (taskIndex === -1) {
                console.error("Task not found");
                return prevData;
            }

            const updatedTasks = [...updatedDesks[deskIndex].tasks];

            updatedTasks[taskIndex] = {
                ...updatedTasks[taskIndex],
                [fieldName]: newValue
            };

            updatedDesks[deskIndex] = {
                ...updatedDesks[deskIndex],
                tasks: updatedTasks
            };

            return {
                ...prevData,
                desks: updatedDesks
            };
        });
    }

//todo add name updating also heher
    return (
        <TaskLoadContext.Provider value={{
            workspaces,
            loadAllWorkspaces,
            loadFullWs,
            loadFullWorkspace,
            fullWorkspaceInformation,
            setFullWorkspaceInformation,
            deleteWorkspace,
            updateWsField,

            permissions,
            userHasPermission,

            addNewTask,
            deleteTask,
            moveTaskToAnotherDesk,
            updateTaskOrder,
            updateTaskField,

            addNewDesk,
            deleteDesk,
            updateDeskField,
            updateDeskOrder,

            addNewPermission,
            deletePermission
        }}>
            {children}
        </TaskLoadContext.Provider>
    );
}