import { Signal, effect, useSignal } from '@preact/signals-react';
import { Task } from '../../models/task.model';
import styles from './Task.module.scss';
import { ChangeEvent, useCallback, useEffect, useRef } from 'react';

export const TaskCard: React.FC<{ 
    task: Task, 
    onUpdateTaskTitle: (taskId: any, title: string) => void, 
    onTaskStatusChange: React.ChangeEventHandler<HTMLInputElement>, 
    onTaskDelete?: Function }> = ({ 
        task, 
        onUpdateTaskTitle,
        onTaskStatusChange = () => { }, 
        onTaskDelete }) => {

    console.log('Render Task Card ', task.id);

    return (
        <div className={styles.task_card}>
            <TaskTitle 
                task={task} 
                onUpdateTaskTitle={onUpdateTaskTitle} 
                onTaskStatusChange={onTaskStatusChange} />
            <button type="button" className="btn btn-error btn-circle" onClick={() => {
                onTaskDelete && onTaskDelete();
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 32 32">
                    <path d="M 15 4 C 14.476563 4 13.941406 4.183594 13.5625 4.5625 C 13.183594 4.941406 13 5.476563 13 6 L 13 7 L 7 7 L 7 9 L 8 9 L 8 25 C 8 26.644531 9.355469 28 11 28 L 23 28 C 24.644531 28 26 26.644531 26 25 L 26 9 L 27 9 L 27 7 L 21 7 L 21 6 C 21 5.476563 20.816406 4.941406 20.4375 4.5625 C 20.058594 4.183594 19.523438 4 19 4 Z M 15 6 L 19 6 L 19 7 L 15 7 Z M 10 9 L 24 9 L 24 25 C 24 25.554688 23.554688 26 23 26 L 11 26 C 10.445313 26 10 25.554688 10 25 Z M 12 12 L 12 23 L 14 23 L 14 12 Z M 16 12 L 16 23 L 18 23 L 18 12 Z M 20 12 L 20 23 L 22 23 L 22 12 Z"></path>
                </svg>
            </button>
        </div>
    );
}

const TaskTitle: React.FC<{ 
    task: Task, 
    onUpdateTaskTitle: (taskId: any, title: string) => void, 
    onTaskStatusChange: React.ChangeEventHandler<HTMLInputElement> }> = 
    ({ 
        task, 
        onUpdateTaskTitle,
        onTaskStatusChange = () => { }
    }) => {
        console.log('Render Task Title ', task.id);

        return (
            <div className={styles.task_title}>
                <input
                    type="checkbox"
                    checked={task.completed}
                    className="checkbox"
                    onChange={onTaskStatusChange}
                />
                <TaskTitleTextInput task={task} onUpdateTaskTitle={onUpdateTaskTitle} />
            </div>
        );
}

const TaskTitleTextInput: React.FC<{ task: Task, onUpdateTaskTitle: (taskId: any, title: string) => void }> = ({ task, onUpdateTaskTitle }) => {
        const inputRef: any = useRef(null);   
        const ref: any = useRef('');    
        const editable: Signal<boolean> = useSignal(false); 
        
        const toggleEditable = useCallback(() => {
            editable.value = !editable.value;
        }, []);

        effect(() => {
            setTimeout(() => {
                inputRef && inputRef.current && (
                    inputRef.current?.focus(),
                    inputRef.current.value = task.title
                );
            }, 100);
        });

        const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
            ref.current = event.target?.value;
        }, []);

        const handleClickOutside = useCallback((event: any) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                editable.value = false;
            }
        }, []);
        
        useEffect(() => {
            document.addEventListener('click', handleClickOutside);
            return () => {
                document.removeEventListener('click', handleClickOutside);
            };
        }, [handleClickOutside]);

        const onSubmit = useCallback((e: React.SyntheticEvent) => {
            e.preventDefault();
            editable.value = false;
            onUpdateTaskTitle(task.id, ref.current);
        }, []);

        console.log('Render TaskTitleTextInput', task.id);

        return (
            <>
                {!editable.value && <span 
                    className={`${styles.task_title__text}${task.completed && ` ${styles.task_completed}` || ''}`}
                    onDoubleClick={toggleEditable}    
                    >
                        {task.title}
                </span>}
                {editable.value && <form onSubmit={onSubmit}><input 
                    ref={inputRef} 
                    type="text" 
                    className={styles.editable_input} 
                    onChange={handleChange} /></form>}
            </>
        );
}