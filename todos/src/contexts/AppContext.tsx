import { ReactNode, createContext } from "react";
import { ReadonlySignal, Signal, batch, computed, signal } from '@preact/signals-react';
import { Task } from '../models/task.model';

export interface AppContextType {
    tasks: Signal<Task[]>;
    activeTasks: ReadonlySignal<Task[]>;
    activeTasksCount: ReadonlySignal<number>;
    completedTasks: ReadonlySignal<Task[]>;
    completedTasksCount: ReadonlySignal<number>;
    addTask: (task: Task) => void;
    toggleTaskCompleted: (taskId: any, completed: boolean) => void;
    removeTask: (taskId: any) => void;
}

function createAppState(): AppContextType {
    const tasks: Signal<Task[]> = signal([]);

    const activeTasks = computed(() => {
        return tasks.value.filter(todo => !todo.completed)
    });

    const activeTasksCount = computed(() => {
        return activeTasks.peek().length;
    });

    const completedTasks = computed(() => {
        return tasks.value.filter(todo => todo.completed)
    });

    const completedTasksCount = computed(() => {
        return completedTasks.peek().length;
    });

    const generateQuickGuid = () => {
        return Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
    }

    const addTask = (task: Task) => {
        batch(() => {
            task.id = generateQuickGuid();
            tasks.value = [...tasks.value, task];
        });
    }

    const toggleTaskCompleted = (taskId: any, completed: boolean) => {
        tasks.value = [...tasks.value].map((task) => {
            if (task.id !== taskId) {
                return task;
            }
            return {
                ...task,
                completed
            };
        });
    }


    const removeTask = (taskId: any) => {
        tasks.value = tasks.value.filter(t => t.id !== taskId);
    }

    return {
        tasks,
        activeTasks,
        activeTasksCount,
        completedTasks,
        completedTasksCount,
        addTask,
        toggleTaskCompleted,
        removeTask
    };
}

const state = createAppState();

export const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: ReactNode }) {
    return (
        <AppContext.Provider value={state}>
            {children}
        </AppContext.Provider>
    );
}