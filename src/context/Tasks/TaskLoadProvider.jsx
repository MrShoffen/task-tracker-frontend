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

    async function loadFullWorkspace(workspace) {
        const fullWs = await sendGetFullWsInformation(workspace);
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

    function addNewTaskToCurrentWorkspace(task) {
        console.log(task);
        console.log(fullWorkspaceInformation)
        const deskIdForUpdate = task.deskId;
        setFullWorkspaceInformation(prevData => {
            const deskIndex = prevData.desks.findIndex(desk => desk.id === deskIdForUpdate);
            if (deskIndex === -1) {
                console.error("Desk not found");
                return prevData;
            }


            const updatedDesks = [...prevData.desks];
            updatedDesks[deskIndex] = {
                ...updatedDesks[deskIndex],
                tasks: [...updatedDesks[deskIndex].tasks, task]
            };
            console.log(updatedDesks)
            return {
                ...prevData,
                desks: updatedDesks
            }

        })
    }

    return (
        <TaskLoadContext.Provider value={{
            workspaces,
            loadAllWorkspaces,

            loadFullWorkspace,
            fullWorkspaceInformation,

            permissions,
            userHasPermission,

            addNewTaskToCurrentWorkspace,

            addNewDesk,
            deleteDesk
        }}>
            {children}
        </TaskLoadContext.Provider>
    );
}