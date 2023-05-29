import styles from './TasksList.module.scss';
import useApp from '../../hooks/useApp';
import { Task } from '../../models/task.model';
import { TaskCard } from '../Task/Task';

export const TasksList: React.FC = () => {
    console.log('Render Tasks List');

    return (
        <div>
            <div className="tabs tabs-boxed">
                <a className="tab">All</a> 
                <a className="tab tab-active">Active</a> 
                <a className="tab">Completed</a>
            </div>
            <ul className={styles.tasks_list}>
                <List />
            </ul>
        </div>
    );
}

const List: React.FC = () => {
    const { tasks, toggleTaskCompleted, removeTask } = useApp();

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