import { ChangeEvent, useCallback, useRef } from "react";
import styles from './AddTaskInput.module.scss';
import useApp from '../../hooks/useApp';

export const AddTaskInput = () => {
    const { addTask } = useApp();
    const ref: any = useRef();
    const inputRef: any = useRef();
    

    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        ref.current = event.target?.value;
    }, []);

    const onAddTask = (e: React.SyntheticEvent) => {
        e.preventDefault();
        addTask({
            id: 0,
            title: ref?.current,
            completed: false
        });
        inputRef.current.value = '';
    }

    return (
        <form onSubmit={onAddTask}>
            <div className={styles.task_input}>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Add New Task"
                    className="input input-bordered input-accent w-full max-w-xs"
                    onChange={handleChange}
                />
                <button type="submit"
                    className="btn btn-active btn-accent w-64 rounded-full">Add</button>

            </div>
        </form>
    );
}