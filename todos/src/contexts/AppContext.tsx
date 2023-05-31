import { ReactNode, createContext, useEffect } from "react";
import { ReadonlySignal, Signal, batch, computed, signal } from '@preact/signals-react';
import { Todo } from '../models/todo.model';
import { AppService } from '../services/AppService';

export interface AppContextType {
    todos: Signal<Todo[]>;
    isLoading: Signal<boolean>;
    allTodosCount: ReadonlySignal<number>;
    activeTodos: ReadonlySignal<Todo[]>;
    activeTodosCount: ReadonlySignal<number>;
    completedTodos: ReadonlySignal<Todo[]>;
    completedTodosCount: ReadonlySignal<number>;
    currentFilter: Signal<string>;
    filterTodos: ReadonlySignal<Todo[]>;
    setTodos: (items: Todo[]) => void;
    fetchTodos: () => void;
    addTodo: (todo: Todo) => void;
    handleTodoChange: (todoId: any, key: any, value: any) => void;
    deleteTodo: (todoId: any) => void;
    handleFilterChange: (filter: any) => void;
}

function createAppState(): AppContextType {
    const todos: Signal<Todo[]> = signal([]);
    const isLoading: Signal<boolean> = signal(true);

    const allTodosCount = computed(() => {
        return todos.value.length;
    });

    const activeTodos = computed(() => {
        return todos.value.filter(todo => !todo.completed)
    });

    const activeTodosCount = computed(() => {
        return activeTodos.value.length;
    });

    const completedTodos = computed(() => {
        return todos.value.filter(todo => todo.completed)
    });

    const completedTodosCount = computed(() => {
        return completedTodos.value.length;
    });

    const currentFilter: Signal<string> = signal('all');

    const filterTodos = computed(() => {
        const filtersMap: Record<string, any> = {
            'all': todos.value,
            'active': activeTodos.value,
            'completed': completedTodos.value
        };
        return filtersMap[currentFilter.value];
    });

    const setTodos = (items: Todo[]) => {
        todos.value = items;
    }

    async function fetchTodos() {
        try {
            const todos = await AppService.getTodos();
            setTodos(todos);
        } catch (error) {
            console.log(error);
        } finally {
            isLoading.value = false;
        }
    }

    const addTodo = async (todo: Todo) => {
        batch(() => {
            todos.value = [todo, ...todos.value];
        });
        
        try {
            await AppService.addTodo(todo);
        } catch (error) {
            console.log(error);
        }
    }

    const handleTodoChange = (todoId: any, key: any, value: any) => {
        todos.value = [...todos.value].map((todo) => {
            if (todo.id !== todoId) {
                return todo;
            }
            return {
                ...todo,
                [key]: value
            };
        });
    }

    const deleteTodo = (todoId: any) => {
        todos.value = todos.value.filter(t => t.id !== todoId);
    }

    const handleFilterChange = (filter: any) => {
        currentFilter.value = filter;
    }

    return {
        todos,
        isLoading,
        allTodosCount,
        activeTodos,
        activeTodosCount,
        completedTodos,
        completedTodosCount,
        currentFilter,
        filterTodos,
        setTodos,
        fetchTodos,
        addTodo,
        handleTodoChange,
        deleteTodo,
        handleFilterChange
    };
}

const state = createAppState();

export const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        state.fetchTodos();
    }, [state.fetchTodos])

    return (
        <AppContext.Provider value={state}>
            {children}
        </AppContext.Provider>
    );
}