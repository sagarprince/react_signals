import { ChangeEvent, useCallback, useRef } from "react";
import styles from './AddTodoForm.module.scss';
import { generateGUID } from "../../utils";
import useApp from '../../hooks/useApp';
import { Signal, useSignal } from "@preact/signals-react";

export const AddTodoForm = () => {
    const { addTodo } = useApp();

    const inputRef: any = useRef();

    const todoName = useSignal<string>('');

    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        todoName.value = event.target?.value;
    }, []);

    const onAddTodo = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const name = todoName.peek();
        if (name) {
            addTodo({
                id: generateGUID(),
                name,
                completed: false
            });
            inputRef.current.value = '';
        }
    }

    console.log('Render AddTodoInput');

    return (
        <form onSubmit={onAddTodo} className={styles.add_todo_form}>
            <input
                ref={inputRef}
                type="text"
                placeholder="What need to be done?"
                className="input input-bordered input-accent w-full max-w-xs"
                onChange={handleChange}
            />
            <AddTodoButton todoName={todoName} />
        </form>
    );
}

const AddTodoButton: React.FC<{
    todoName: Signal<string>
}> = ({ todoName }) => {
    console.log('Render AddTodoButton');

    return (
        <button type="submit" disabled={!todoName.value}
            className="btn btn-active btn-accent w-64 rounded-full">Add</button>
    )
}