import {createContext, useContext, useRef, useState} from "react";
import {sendGetAllWorkspaces} from "../../services/fetch/tasks/ws/SendGetAllWorkspaces.js";
import {sendGetFullWsInformation} from "../../services/fetch/tasks/ws/SendGetFullWsInformation.js";
import {useAuthContext} from "../Auth/AuthContext.jsx";
import {sendUserInfo} from "../../services/fetch/unauth/SendUserInfo.js";
import {sendGetAllComments} from "../../services/fetch/tasks/comments/SendGetAllComments.js";
import {connectToWebsocket} from "../../services/websocket/ConnectToWebsocket.js";
import SockJS from 'sockjs-client/dist/sockjs';
import {API_BASE_URL, API_CONTEXT} from "../../../UrlConstants.jsx";
import {Stomp} from "@stomp/stompjs";
import {sendCreateSticker} from "../../services/fetch/tasks/sticker/SendCreateSticker.js";


const TaskLoadContext = createContext(null);

export const useTaskOperations = () => useContext(TaskLoadContext);


export const TaskLoadProvider = ({children}) => {

    const [workspaces, setWorkspaces] = useState([]);

    const {auth} = useAuthContext();

    const [permissions, setPermissions] = useState([]);

    const [usersInWs, setUsersInWs] = useState([]);

    const [fullWorkspaceInformation, setFullWorkspaceInformation] = useState({
        createdAt: "205-05-14T09:49:41.58378Z",
        desks: [],
        id: "67304ccb-4998-499a-a1c9-394eeb133ea1",
        name: "1"
    });

    const [chatOpen, setChatOpen] = useState(false);
    const [currentOpenTask, setCurrentOpenTask] = useState(null);
    const [commentsInCurrentTask, setCommentsInCurrentTask] = useState([]);
    const [currentOffset, setCurrentOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const subscriptionRef = useRef(null);
    const subscriptionRefWs = useRef(null);

    function connectToWsWebsocket(workspaceId) {

        const socket = new SockJS(API_BASE_URL + API_CONTEXT + "/websocket");

        const stompClient = Stomp.over(socket);

        if (subscriptionRefWs.current) {
            subscriptionRefWs.current.unsubscribe();
        }

        stompClient.connect({}, () => {
            const subscription = stompClient.subscribe('/topic/workspace/' + workspaceId,
                (message) => {
                    const event = JSON.parse(message.body);
                    console.log('Получено обновление', event);
                    const eventType = event.type;
                    switch (eventType) {
                        case 'WORKSPACE_UPDATED':
                            const fieldName = Object.keys(event.payload.updatedField)[0];
                            updateWsField(fieldName, event.payload.updatedField[fieldName]);
                            break;

                        case 'DESK_CREATED':
                            addNewDesk(event.payload);
                            break;

                        case 'DESK_DELETED':
                            deleteDesk(event.payload);
                            break;

                        case 'DESK_UPDATED':
                            const fieldDesk = Object.keys(event.payload.updatedField)[0];
                            updateDeskField(event.payload.deskId, fieldDesk, event.payload.updatedField[fieldDesk]);
                            break;

                        case 'TASK_CREATED':
                            addNewTask(event.payload);
                            break;

                        case 'TASK_DELETED':
                            deleteTask(event.payload.deskId, event.payload.taskId);
                            break;

                        case 'TASK_UPDATED':
                            const fieldTask = Object.keys(event.payload.updatedField)[0];
                            // updateTaskField(event.payload.deskId, event.payload.taskId, fieldTask, event.payload.updatedField[fieldTask]);
                            if (fieldTask === 'deskId') {
                                console.log('old ', event.payload.deskId);
                                console.log('new ', event.payload.updatedField[fieldTask])
                                moveTaskInternal(event.payload.taskId, event.payload.deskId, event.payload.updatedField[fieldTask]);
                                // moveTaskToAnotherDesk()
                            } else {
                                updateTaskField(event.payload.deskId, event.payload.taskId, fieldTask, event.payload.updatedField[fieldTask]);
                            }
                            break;

                        case 'STICKER_CREATED':
                            addNewSticker(event.payload);
                            break;

                        case 'STICKER_DELETED':
                            deleteSticker(event.payload.taskId, event.payload.stickerId);
                            break;

                        case 'COMMENT_CREATED':
                            updateCommentsCount(event.payload);
                            break;

                        case 'COMMENT_DELETED':
                            updateCommentsCountMin(event.payload);
                            break;

                        default:
                            console.log('error with handling websocket message');
                    }
                }
            )
            subscriptionRefWs.current = subscription;
        })
    }


    function connectToChatWebsocket(workspaceId, taskId, task) {

        const socket = new SockJS(API_BASE_URL + API_CONTEXT + "/websocket");

        const stompClient = Stomp.over(socket);

        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
        }

        stompClient.connect({}, () => {
            const subscription = stompClient.subscribe('/topic/workspace/' + workspaceId + '/chat/' + taskId,
                (message) => {
                    const event = JSON.parse(message.body);
                    console.log('Получено обновление чата', event);
                    const eventType = event.type;
                    switch (eventType) {
                        case 'COMMENT_CREATED':
                            console.log(event.payload);
                            addNewComment(event.payload, task)
                            break;

                        case 'COMMENT_DELETED':
                            console.log('in deleting', event.payload);
                            deleteComment(event.payload, task);
                            break;

                        default:
                            console.log('error with handling websocket chat message');
                    }
                })
            subscriptionRef.current = subscription;
        })
    }

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
        subscriptionRef.current?.unsubscribe();
        setChatOpen(true);
        setCurrentOpenTask(task);
        setCurrentOffset(0);
        setHasMore(true);
        const allComs = await sendGetAllComments(task, 5, 0);
        connectToChatWebsocket(task.workspaceId, task.id, task);
        setCommentsInCurrentTask(allComs);
    }

    async function loadMoreComments() {
        if (hasMore && activeTask()) {
            const newCommsChunk = await sendGetAllComments(activeTask(), 5, currentOffset);
            if (newCommsChunk.length < 5) {
                setHasMore(false);
            }
            setCommentsInCurrentTask(prev => {
                if (prev) {
                    const commentMap = new Map([...prev, ...newCommsChunk].map(c => [c.id, c]));
                    return Array.from(commentMap.values());
                }
            });
            setCurrentOffset(currentOffset + newCommsChunk.length);
        }
    }

    function closeChat() {
        subscriptionRef.current?.unsubscribe();
        setChatOpen(false);
        setCurrentOpenTask(null);
        setCurrentOffset(0);
        setHasMore(true);
        setCommentsInCurrentTask([]);
    }

    function addNewComment(newComment, task) {
        if (newComment.taskId === task.id) {
            setCommentsInCurrentTask(prev => [...prev, newComment]);
        }
    }

    function deleteComment(comment, task) {
        if (comment.taskId === task.id) {
            setCommentsInCurrentTask(prev => prev.filter(c => c.id !== comment.commentId));
        }
    }


    async function loadAllWorkspaces() {
        try {
            console.log('fetching all workspaces');
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
        subscriptionRefWs.current?.unsubscribe();
        console.log(fullWs);
        setFullWorkspaceInformation(fullWs)
        const uap = fullWs.usersAndPermissions.find(uap => uap.info.email === auth.user.email);

        setPermissions(uap?.permissions);
        connectToWsWebsocket(wsId);
        await preloadWsUsers(fullWs.desks, fullWs.usersAndPermissions);

        return fullWs;
    }

    function updateWsField(field, newVal) {
        setFullWorkspaceInformation(prev => ({
            ...prev,
            [field]: newVal
        }))
    }


    //users----------------------------------------------------

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

    function loadUser(userId) {
        const alreadySavedUser = usersInWs.findIndex(user => user.id === userId);
        if (alreadySavedUser !== -1) {
            return usersInWs[alreadySavedUser];
        } else {
            return {email: 'unkonwn_user@mail'};
        }
    }


    function userHasPermission(permission) {
        if (permissions === null) {
            return false;
        }

        return permissions.includes(permission);
    }

    //------------------------------------------------------------------------


    //--DESKS----------------------------------------------------------------

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


    function deleteDesk(deskId) {
        setFullWorkspaceInformation(prev => ({
            ...prev, // Копируем все существующие поля
            desks: prev.desks.filter(desk => desk.id !== deskId) // Фильтруем массив, оставляя только элементы с id не равным deskId
        }));
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

    //------------------------------------------------------------------------


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

    function moveTaskInternal(movingTaskId, sourceDeskId, targetDeskId) {
        setFullWorkspaceInformation(prevData => {
            const movingTaskDeskIndex = prevData.desks.findIndex(desk => desk.id === sourceDeskId);
            if (movingTaskDeskIndex === -1) {
                console.error("Desk not found");
                return prevData;
            }

            const updatedDesks = [...prevData.desks];

            const movingTaskI = updatedDesks[movingTaskDeskIndex].tasks.findIndex(t => t.id === movingTaskId);

            if (movingTaskI === -1) {
                console.error("Task not found");
                return prevData;
            }

            const movingTask = updatedDesks[movingTaskDeskIndex].tasks[movingTaskI];

            updatedDesks[movingTaskDeskIndex] = {
                ...updatedDesks[movingTaskDeskIndex],
                tasks: updatedDesks[movingTaskDeskIndex].tasks.filter(t => t.id !== movingTaskId)
            };

            const targetDeskIndex = prevData.desks.findIndex(d => d.id === targetDeskId)

            if (targetDeskIndex === -1) {
                console.error("Task not found");
                return prevData;
            }

            if (updatedDesks[targetDeskIndex]
                .tasks.findIndex(t => t.name === movingTask.name) !== -1) {
                return prevData;
            }

            updatedDesks[targetDeskIndex] = {
                ...updatedDesks[targetDeskIndex],
                tasks: [...updatedDesks[targetDeskIndex].tasks, {...movingTask, deskId: targetDeskId}]
            }

            return {
                ...prevData,
                desks: updatedDesks
            }
        })
    }

    function addNewTask(newTask) {
        console.log(fullWorkspaceInformation);
        setFullWorkspaceInformation(prevData => {
            const deskIndex = prevData.desks.findIndex(desk => desk.id === newTask.deskId);
            if (deskIndex === -1) {
                console.error("Desk not found");
                return prevData;
            }

            const existingTaskIndex = prevData.desks[deskIndex].tasks.findIndex(
                task => task.id === newTask.id
            );

            if (existingTaskIndex !== -1) {
                console.log("Task with this ID already exists");
                return prevData; // Возвращаем неизмененные данные
            }

            const updatedDesks = [...prevData.desks];
            updatedDesks[deskIndex] = {
                ...updatedDesks[deskIndex],
                tasks: [
                    ...updatedDesks[deskIndex].tasks,
                    {
                        ...newTask,
                        stickers: [],
                        commentsCount: 0
                    }
                ]
            };

            return {
                ...prevData,
                desks: updatedDesks
            };
        });
    }

    function deleteTask(deskIdForUpdate, taskId) {
        setFullWorkspaceInformation(prevData => {
            const deskIndex = prevData.desks.findIndex(desk => desk.id === deskIdForUpdate);
            if (deskIndex === -1) {
                console.error("Desk not found");
                return prevData;
            }

            const updatedDesks = [...prevData.desks];
            updatedDesks[deskIndex] = {
                ...updatedDesks[deskIndex],
                tasks: updatedDesks[deskIndex].tasks.filter(t => t.id !== taskId)
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
        let retTask = null;
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
            retTask = updatedTasks[taskIndex];

            updatedDesks[deskIndex] = {
                ...updatedDesks[deskIndex],
                tasks: updatedTasks
            };

            return {
                ...prevData,
                desks: updatedDesks
            };
        });

        return retTask;
    }

    function updateCommentsCount(taskIdForUpdate) {
        setFullWorkspaceInformation(prevData => {
            const tasks = prevData.desks.flatMap(d => d.tasks);
            const deskIdForUpdate = tasks
                .find(t => t.id === taskIdForUpdate).deskId;

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
                commentsCount: +updatedTasks[taskIndex].commentsCount + 1
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

    function updateCommentsCountMin(taskIdForUpdate) {
        setFullWorkspaceInformation(prevData => {
            const tasks = prevData.desks.flatMap(d => d.tasks);
            const deskIdForUpdate = tasks
                .find(t => t.id === taskIdForUpdate).deskId;

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
                commentsCount: +updatedTasks[taskIndex].commentsCount - 1
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


    function addNewSticker(newSticker) {
        console.log(fullWorkspaceInformation);


        setFullWorkspaceInformation(prevData => {


            const taskIdForUpdate = newSticker.taskId;
            const tasks = prevData.desks.flatMap(d => d.tasks);
            const deskIdForUpdate = tasks
                .find(t => t.id === taskIdForUpdate).deskId;

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


    function deleteSticker(taskIdForUpdate, stickerId) {

        setFullWorkspaceInformation(prevData => {
            const tasks = prevData.desks.flatMap(d => d.tasks);
            const deskIdForUpdate = tasks
                .find(t => t.id === taskIdForUpdate).deskId;

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
                stickers: currentTask.stickers.filter(stick => stick.id !== stickerId)
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

            permissions,
            userHasPermission,

            moveTaskToAnotherDesk,
            updateTaskOrder,
            updateTaskField,


            addNewPermission,
            deletePermission,

            loadUser,

            openChat,
            chatOpen,
            activeTask,
            closeChat,
            commentsInCurrentTask,
            loadMoreComments
        }}>
            {children}
        </TaskLoadContext.Provider>
    );
}
