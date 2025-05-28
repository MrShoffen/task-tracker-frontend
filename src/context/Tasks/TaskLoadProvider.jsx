import {createContext, useContext, useState} from "react";
import {sendGetAllWorkspaces} from "../../services/fetch/tasks/ws/SendGetAllWorkspaces.js";
import {sendGetFullWsInformation} from "../../services/fetch/tasks/ws/SendGetFullWsInformation.js";
import {useAuthContext} from "../Auth/AuthContext.jsx";
import {sendUserInfo} from "../../services/fetch/unauth/SendUserInfo.js";
import {sendGetAllComments} from "../../services/fetch/tasks/comments/SendGetAllComments.js";


const TaskLoadContext = createContext(null);

export const useTaskOperations = () => useContext(TaskLoadContext);


export const TaskLoadProvider = ({children}) => {

    const [workspaces, setWorkspaces] = useState([]);

    const {auth} = useAuthContext();

    const [permissions, setPermissions] = useState([]);

    const [usersInWs, setUsersInWs] = useState([]);

    const [chatOpen, setChatOpen] = useState(false);

    const [currentOpenTask, setCurrentOpenTask] = useState(null);


    const [commentsInCurrentTask, setCommentsInCurrentTask] = useState([]);
    const [currentOffset, setCurrentOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);


    function activeTask() {
        if (!currentOpenTask) {
            return null;
        }
        const deskIndex = fullWorkspaceInformation.desks.findIndex(desk => desk.id === currentOpenTask.deskId);
        if (deskIndex === -1) {
            return null;
        }

        const taskIndex = fullWorkspaceInformation.desks[deskIndex].tasks.findIndex(task => task.id === currentOpenTask.id);

        if (taskIndex === -1) {
            return null;
        }

        return fullWorkspaceInformation.desks[deskIndex].tasks[taskIndex]
    }

    async function openChat(task) {
        setChatOpen(true);
        setCurrentOpenTask(task);
        setCurrentOffset(0);
        setHasMore(true);
        const allComs = await sendGetAllComments(task, 25, 0);
        setCommentsInCurrentTask(allComs);
    }

    async function loadMoreComments() {
        if (hasMore) {
            const newCommsChunk = await sendGetAllComments(activeTask(), 25, currentOffset);
            if (newCommsChunk.length < 25) {
                setHasMore(false);
            }
            setCommentsInCurrentTask(prev => {
                const commentMap = new Map([...prev, ...newCommsChunk].map(c => [c.id, c]));
                return Array.from(commentMap.values());
            });
            setCurrentOffset(currentOffset + newCommsChunk.length);
        }
    }

    function closeChat() {
        setChatOpen(false);
        setCurrentOpenTask(null);
        setCurrentOffset(0);
        setHasMore(true);
        setCommentsInCurrentTask([]);
    }

    function addNewComment(newComment) {
        setCommentsInCurrentTask(prev => [...prev, newComment]);
    }

    function deleteComment(comment) {
        setCommentsInCurrentTask(prev => prev.filter(c => c.id !== comment.id));
    }


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

    async function loadFullWs(wsId) {
        const fullWs = await sendGetFullWsInformation("/api/v1/workspaces/" + wsId + "/full");
        setFullWorkspaceInformation(fullWs)
        const uap = fullWs.usersAndPermissions.find(uap => uap.info.email === auth.user.email);

        setPermissions(uap?.permissions);

        preloadWsUsers(fullWs.desks, fullWs.usersAndPermissions);

        return fullWs;
    }


    async function preloadWsUsers(desks, usersAndPermissions) {
        async function preloadDesk(desk, allUsers, usersAndPermissions) {
            for (const task of desk.tasks) {
                await loadUserFromTask(task, allUsers, usersAndPermissions);
            }
        }

        async function loadUserFromTask(task, allUsers, usersAndPermissions) {
            if (allUsers.findIndex(user => user.id === task.userId) !== -1) {
                return;
            }

            console.log('fetching unknown user');
            const fetchedUser = await sendUserInfo(task.userId);
            const nUser = {...fetchedUser, id: task.userId};
            allUsers.push(nUser);
        }

        const allUsers = usersAndPermissions.map(uap => ({
            ...uap.info,
            id: uap.userId,
        }));
        for (const desk of desks) {
            await preloadDesk(desk, allUsers, usersAndPermissions);
        }

        setUsersInWs(allUsers);
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
        if (alreadyExists !== -1) {
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

    function deletePermission(userId) {
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
                tasks: [...updatedDesks[deskIndex].tasks,
                    {
                        ...newTask,
                        stickers: []
                    }]
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


    function addNewSticker(deskIdForUpdate, newSticker) {
        console.log(newSticker);
        const taskIdForUpdate = newSticker.taskId;
        setFullWorkspaceInformation(prevData => {
            const deskIndex = prevData.desks.findIndex(desk => desk.id === deskIdForUpdate);
            if (deskIndex === -1) {
                console.error("Desk not found");
                return prevData;
            }

            const updatedDesks = [...prevData.desks];


            const taskIndex = prevData.desks[deskIndex].tasks.findIndex(task => task.id === taskIdForUpdate);

            const updatedTasks = [...prevData.desks[deskIndex].tasks];

            updatedTasks[taskIndex] = {
                ...updatedTasks[taskIndex],
                stickers: [...updatedTasks[taskIndex].stickers, newSticker],
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


    function deleteSticker(deskIdForUpdate, sticker) {
        const taskIdForUpdate = sticker.taskId;

        setFullWorkspaceInformation(prevData => {
            const deskIndex = prevData.desks.findIndex(desk => desk.id === deskIdForUpdate);
            if (deskIndex === -1) {
                console.error("Desk not found");
                return prevData;
            }

            const updatedDesks = [...prevData.desks];

            const taskIndex = prevData.desks[deskIndex].tasks.findIndex(task => task.id === taskIdForUpdate);


            if (taskIndex === -1) {
                console.error("Task not found");
                return prevData;
            }

            const updatedTasks = [...prevData.desks[deskIndex].tasks];

            const currentTask = updatedTasks[taskIndex];
            if (!currentTask || !currentTask.stickers) {
                console.error("Task or stickers not found");
                return prevData;
            }

            updatedTasks[taskIndex] = {
                ...currentTask,
                stickers: currentTask.stickers.filter(stick => stick.id !== sticker.id)
            };

            // Обновляем доску
            updatedDesks[deskIndex] = {
                ...updatedDesks[deskIndex],
                tasks: updatedTasks
            };

            return {
                ...prevData,
                desks: updatedDesks
            };

        })
    }

//todo add name updating also heher
    return (
        <TaskLoadContext.Provider value={{
            workspaces,
            loadAllWorkspaces,
            loadFullWs,
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
            deletePermission,

            usersInWs,

            addNewSticker,
            deleteSticker,

            openChat,
            chatOpen,
            activeTask,
            closeChat,
            commentsInCurrentTask,
            addNewComment,
            deleteComment,
            loadMoreComments
        }}>
            {children}
        </TaskLoadContext.Provider>
    );
}
