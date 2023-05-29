
import { MutableRefObject, useContext, useRef } from 'react';
import { AppContext } from '../../context/AppContext';
import { Task } from '../../models/task.model';
import { effect } from "@preact/signals-react";
import styles from './TasksList.module.scss';
import { TaskCard } from '../Task/Task';

export const TasksList: React.FC = () => {
    console.log('Render Tasks List');

    return (
        <ul className={styles.tasks_list}>
            <List />
        </ul>
    );
}

const List: React.FC = () => {
    const { tasks, toggleTaskCompleted, removeTask } = useContext(AppContext);

    console.log('Render List ', tasks.value);

    return (
        <>
            {tasks.value.map((task: Task) => <li key={task.id}>
                <TaskCard task={task} 
                onChange={(e) => {
                    toggleTaskCompleted(
                        task.id,
                        e.target.checked
                    )}} 
                onDelete={() => {
                    removeTask(task.id);
                }} />
            </li>)}
        </>
    );
}