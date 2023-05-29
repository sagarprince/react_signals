import { ChangeEvent, useContext, useRef } from "react";
import styles from './AddTaskInput.module.scss';
import { AppContext } from "../../context/AppContext";

export const AddTaskInput = () => {
    const { addTask } = useContext(AppContext);
    const ref: any = useRef();
    const inputRef: any = useRef();
    
    console.log('Render AddTaskInput');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        ref.current = event.target?.value;
    };

    const onAddTask = (e: React.SyntheticEvent) => {
        e.preventDefault();
        addTask({
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