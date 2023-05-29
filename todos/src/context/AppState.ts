import { Signal, computed, signal, batch } from "@preact/signals-react";
import { Task } from "../models/task.model";

function createAppState() {
    const tasks: Signal<Task[]> = signal([]);

    const completed = computed(() => {
        return tasks.value.filter(todo => todo.completed).length
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


    const removeTask = (id: any) => {
        tasks.value = tasks.value.filter(t => t.id !== id);
    }

    return {
        tasks,
        completed,
        addTask,
        toggleTaskCompleted,
        removeTask
    }
}

export default createAppState();