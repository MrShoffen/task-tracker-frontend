import {Backdrop, Box, Card, CircularProgress} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import {EditableDeskName} from "./EditableDeskName.jsx";
import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";
import {NewTaskBadge} from "../Task/NewTaskBadge.jsx";
import {Task} from "../Task/Task.jsx";
import {deskColor} from "../../services/util/Utils.js";
import {DeskMenu} from "./DeskMenu.jsx";
import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {arrayMove, SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {restrictToVerticalAxis} from "@dnd-kit/modifiers";
import {SortableTask} from "../Task/SortableTask.jsx";


export function TaskDesk({desk, sx, onTaskReorder}) {
    const [contentIsLoading, setContentIsLoading] = useState(false);
    const [activeTask, setActiveTask] = useState(null);
    const {userHasPermission} = useTaskOperations();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor)
    );

    const handleDragStart = (event) => {
        const {active} = event;
        setActiveTask(desk.tasks.find(task => task.id === active.id));
    };

    const handleDragEnd = async (event) => {
        const {active, over} = event;

        if (active.id !== over.id) {
            const oldIndex = desk.tasks.findIndex(task => task.id === active.id);
            const newIndex = desk.tasks.findIndex(task => task.id === over.id);

            // Оптимистичное обновление UI
            const reorderedTasks = arrayMove(desk.tasks, oldIndex, newIndex);

            try {
                setContentIsLoading(true);
                // Вызываем callback для отправки запроса на сервер
                // await onTaskReorder(desk.id, active.id, newIndex, reorderedTasks);
                console.log('send fetch reorder')
            } catch (error) {
                console.error('Failed to reorder tasks:', error);
                // В случае ошибки можно откатить изменения
            } finally {
                setContentIsLoading(false);
            }
        }

        setActiveTask(null);
    };

    return (
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
                maxHeight: 'calc(100vh - 120px)',
                ...sx
            }}
        >
            <Backdrop
                sx={(theme) => ({
                    color: '#fff',
                    zIndex: theme.zIndex.drawer + 1,
                    position: 'absolute'
                })}
                open={contentIsLoading}
            >
                <CircularProgress sx={{width: '20px', height: '20px'}} color="inherit"/>
            </Backdrop>

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

                // flexShrink: 0,  Фиксированная высота
            }}>
                <EditableDeskName desk={desk} hovered={true}/>
                <DeskMenu desk={desk}/>
                {userHasPermission("CREATE_TASK") &&
                    <NewTaskBadge taskCreationLink={desk.api.links.createTask.href}
                    />
                }

            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
            }}>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                >
                    <SortableContext
                        items={desk.tasks.map(task => task.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <Box sx={{
                            overflowY: 'auto',
                            flex: 1,
                            '&::-webkit-scrollbar': {
                                width: '7px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'action.disabled',
                                borderRadius: '3px',
                                visibility: 'hidden',
                                transition: 'visibility 0.6s ease',
                            },
                            '&:hover::-webkit-scrollbar-thumb': {
                                visibility: 'visible',
                            }
                        }}>
                            {desk.tasks
                                .sort((a, b) => b.orderIndex - a.orderIndex)
                                .map(task => (
                                <SortableTask
                                    key={task.id}
                                    task={task}
                                    setContentIsLoading={setContentIsLoading}
                                />
                            ))}
                        </Box>
                    </SortableContext>

                    <DragOverlay>
                        {activeTask ? (
                            <Task
                                task={activeTask}
                                setContentIsLoading={setContentIsLoading}
                                style={{
                                    boxShadow: '0px 5px 15px rgba(0,0,0,0.2)',
                                    transform: 'scale(1.02)',
                                    opacity: 0.8,
                                }}
                            />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </Box>
        </Card>
    );
}

//
// export function TaskDesk({desk, sx}) {
//
//     const [contentIsLoading, setContentIsLoading] = useState(false);
//
//     const {userHasPermission} = useTaskOperations();
//
//     return (
//         <Card
//             elevation={0}
//             sx={{
//                 boxShadow: 1,
//                 borderRadius: 3,
//                 position: 'relative',
//                 width: '300px',
//                 backgroundColor: deskColor(desk.color),
//                 display: 'flex',
//                 flexDirection: 'column',
//                 maxHeight: 'calc(100vh - 120px)', // Ограничение максимальной высоты
//                 ...sx
//             }}>
//             <Backdrop
//                 sx={
//                     (theme) => ({
//                         color: '#fff',
//                         zIndex: theme.zIndex.drawer + 1,
//                         position: 'absolute'
//                     })
//                 }
//                 open={contentIsLoading}
//             >
//                 <CircularProgress sx={{width: '20px', height: '20px'}} color="inherit"/>
//             </Backdrop>
//             <Box
//                 sx={{
//                     backgroundColor: deskColor(desk.color),
//                     height: '15px',
//                 }}
//             />
//             <Box
//                 sx={{
//                     backgroundColor: 'desk',
//                     width: '360px',
//                     top: '8px',
//                     left: '-30px',
//                     borderRadius: 12.5,
//                     position: 'absolute',
//                     height: '9000px',
//                     // zIndex: 200,
//                 }}
//             />
//             <Box sx={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 pb: 1.5
//
//                 // flexShrink: 0, // Фиксированная высота
//             }}>
//                 <EditableDeskName desk={desk} hovered={true}/>
//                 <DeskMenu desk={desk}/>
//                 {userHasPermission("CREATE_TASK") &&
//                     <NewTaskBadge taskCreationLink={desk.api.links.createTask.href}
//                     />
//                 }
//
//             </Box>
//             <Box sx={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 overflow: 'hidden', // Скрываем переполнение
//                 position: 'relative',
//             }}>
//                 {/* Внутренний контейнер с прокруткой */}
//                 <Box sx={{
//                     overflowY: 'auto',
//                     flex: 1,
//                     '&::-webkit-scrollbar': {
//                         width: '7px',
//                     },
//                     '&::-webkit-scrollbar-thumb': {
//                         backgroundColor: 'action.disabled',
//                         borderRadius: '3px',
//                         visibility: 'hidden', // Скрываем по умолчанию
//                         transition: 'visibility 0.6s ease',
//                     },
//                     '&:hover::-webkit-scrollbar-thumb': {
//                         visibility: 'visible', // Показываем при наведении на область прокрутки
//                     }
//
//
//                 }}>
//
//                     {desk.tasks && desk.tasks
//                         .sort((a, b) => b.orderIndex - a.orderIndex)
//                         .map(task =>
//                             <Task
//                                 key={task.id}
//                                 task={task}
//                                 setContentIsLoading={setContentIsLoading}
//                             />
//                         )
//                     }
//                 </Box>
//             </Box>
//
//         </Card>
//     )
// }