
// Нужно создать обертку SortableTask для Task
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {Task} from "./Task.jsx";

export function SortableTask({task, setContentIsLoading}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id: task.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Task
                task={task}
                setContentIsLoading={setContentIsLoading}
            />
        </div>
    );
}