import { ReactNode, createContext, useEffect } from "react";
import { ReadonlySignal, Signal, batch, computed, signal } from '@preact/signals-react';
import { Task } from '../models/task.model';
import { generateGUID } from '../utils';
import { AppService } from '../services/AppService';

export interface AppContextType {
    tasks: Signal<Task[]>;
    allTasksCount: ReadonlySignal<number>;
    activeTasks: ReadonlySignal<Task[]>;
    activeTasksCount: ReadonlySignal<number>;
    completedTasks: ReadonlySignal<Task[]>;
    completedTasksCount: ReadonlySignal<number>;
    currentFilter: Signal<string>;
    filterTasks: ReadonlySignal<Task[]>;
    addTask: (task: Task) => void;
    handleTaskChange: (taskId: any, key: any, value: any) => void;
    deleteTask: (taskId: any) => void;
    handleFilterChange: (filter: any) => void;
}

function createAppState(): AppContextType {
    const tasks: Signal<Task[]> = signal([]);

    const allTasksCount = computed(() => {
        return tasks.value.length;
    });

    const activeTasks = computed(() => {
        return tasks.value.filter(todo => !todo.completed)
    });

    const activeTasksCount = computed(() => {
        return activeTasks.value.length;
    });

    const completedTasks = computed(() => {
        return tasks.value.filter(todo => todo.completed)
    });

    const completedTasksCount = computed(() => {
        return completedTasks.value.length;
    });

    const currentFilter: Signal<string> = signal('all');

    const filterTasks = computed(() => {
        const filtersMap: Record<string, any> = {
            'all': tasks.value,
            'active': activeTasks.value,
            'completed': completedTasks.value
        };
        return filtersMap[currentFilter.value];
    });

    const addTask = (task: Task) => {
        batch(() => {
            task.id = generateGUID();
            tasks.value = [...tasks.value, task];
        });
    }

    const handleTaskChange = (taskId: any, key: any, value: any) => {
        tasks.value = [...tasks.value].map((task) => {
            if (task.id !== taskId) {
                return task;
            }
            return {
                ...task,
                [key]: value
            };
        });
    }

    const deleteTask = (taskId: any) => {
        tasks.value = tasks.value.filter(t => t.id !== taskId);
    }

    const handleFilterChange = (filter: any) => {
        currentFilter.value = filter;
    }

    return {
        tasks,
        allTasksCount,
        activeTasks,
        activeTasksCount,
        completedTasks,
        completedTasksCount,
        currentFilter,
        filterTasks,
        addTask,
        handleTaskChange,
        deleteTask,
        handleFilterChange
    };
}

const state = createAppState();

export const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: ReactNode }) {
    async function loadTodos() {
        try {
          const data = await AppService.getTodos();
          const tasks: Task[] = data.map((item: any) => {
            return {
                ...item,
                title: item.todo,
            };
          });
          state.tasks.value = tasks;
        } catch (error) {
          console.log(error);
        }
      }

    useEffect(() => {
        loadTodos();
    }, [loadTodos])

    return (
        <AppContext.Provider value={state}>
            {children}
        </AppContext.Provider>
    );
}