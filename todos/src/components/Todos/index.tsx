import styles from './Todos.module.scss';
import useApp from '../../hooks/useApp';
import { Todo } from '../../models/todo.model';
import { TodoCard } from '../TodoCard';
import { ReadonlySignal } from '@preact/signals-react';
import { useEffect } from 'react';

export const Todos: React.FC = () => {
    const {
        filterTodos,
        isLoading,
        handleTodoChange,
        deleteTodo,
    } = useApp();

    console.log('Render Todos');

    return (
        <ul className={styles.todos}>
            <List
                todos={filterTodos}
                isLoading={isLoading}
            />
        </ul>
    );
}

const List: React.FC<{
    todos: ReadonlySignal<Todo[]>,
    isLoading: ReadonlySignal<boolean>
}> = ({ todos, isLoading }) => {

    // console.log('Render List ', todos.peek());

    const dummyTodos = Array(8).fill(1).map((_, i) => {
       return {
        id: i + 1,
        name: '',
        completed: false,
       };
    });

    return (
        <>
            {!isLoading.value ? todos.value.map((todo: Todo) => <li key={todo.id}>
                <TodoCard todo={todo} />
            </li>) : dummyTodos.map((todo: Todo) => <li key={todo.id}>
                <TodoCard todo={todo} />
            </li>)}
        </>
    );
}