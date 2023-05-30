import styles from './TasksList.module.scss';
import useApp from '../../hooks/useApp';
import { Task } from '../../models/task.model';
import { TaskCard } from '../TaskCard';
import { ReadonlySignal } from '@preact/signals-react';

export const TasksList: React.FC = () => {
    const { 
        filterTasks, 
        handleTaskChange, 
        deleteTask,
    } = useApp();

    console.log('Render Tasks List');

    return (
        <ul className={styles.tasks_list}>
            <List 
                tasks={filterTasks} 
                onUpdateTaskTitle={(taskId, title) => {
                    handleTaskChange(
                        taskId,
                        'title',
                        title,
                    );
                }}
                onTaskStatusChange={(taskId, checked) => {
                    handleTaskChange(
                        taskId,
                        'completed',
                        checked,
                    );
                }}
                onTaskDelete={(taskId) => {
                    deleteTask(taskId);
                }}  
            />
        </ul>
    );
}

const List: React.FC<{ 
    tasks: ReadonlySignal<Task[]>,
    onUpdateTaskTitle: (taskId: any, title: string) => void, 
    onTaskStatusChange: (taskId: any, checked: boolean) => void, 
    onTaskDelete: (taskId: any) => void
    }> = ({ tasks, onUpdateTaskTitle, onTaskStatusChange, onTaskDelete }) => {

    console.log('Render List ', tasks.value);

    return (
        <>
            {tasks.value.map((task: Task) => <li key={task.id}>
                <TaskCard task={task} 
                onUpdateTaskTitle={onUpdateTaskTitle}
                onTaskStatusChange={(e) => {
                    onTaskStatusChange(
                        task.id,
                        e.target.checked
                    )}} 
                onTaskDelete={() => {
                    onTaskDelete(task.id);
                }} />
            </li>)}
        </>
    );
}