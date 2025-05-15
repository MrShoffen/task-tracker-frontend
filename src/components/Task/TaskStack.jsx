import {Task} from "./Task.jsx";
import {Box} from "@mui/material";
import {NewTaskBadge} from "./NewTaskBadge.jsx";
import {useTaskOperations} from "../../context/Tasks/TaskLoadProvider.jsx";


export function TaskStack({tasks, taskCreationLink, setContentIsLoading}) {

    const {userHasPermission} = useTaskOperations();
    return (<Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                minHeight: 0,
            }}
        >
            {userHasPermission("CREATE_TASK") &&
                <NewTaskBadge taskCreationLink={taskCreationLink}/>
            }

            {
                tasks
                    .sort((a, b) => b.orderIndex - a.orderIndex)
                    .map(task =>
                        <Task
                            key={task.id}
                            task={task}
                            setContentIsLoading={setContentIsLoading}
                        />
                    )
            }
        </Box>
    )
}