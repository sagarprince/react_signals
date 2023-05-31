import { Todo } from '../models/todo.model';
import RestAPI from './RestApi';

export const AppService = {
  async getTodos(): Promise<Todo[]> {
    try {
      const response = await RestAPI.get('todos?limit=100');
      const todos = response.data && response.data.todos || [];
      return todos.map((item: any) => {
        return {
          ...item,
          name: item.todo,
        };
      });
    } catch (error: any) {
      const data: any = (error && error.response && error.response.data) || null;
      throw {
        status: (data && data.status) || -1,
        message: (data && data.message) || '',
      };
    }
  },

  async addTodo(todo: Todo): Promise<Todo> {
    try {
      const data = {
        ...todo,
        todo: todo.name,
        userId: 1
      };
      const response = await RestAPI.post('todos/add', data);
      console.log(response.data);
      const todos = response.data && response.data.todos || [];
      return todos.map((item: any) => {
        return {
          ...item,
          name: item.todo,
        };
      });
    } catch (error: any) {
      const data: any = (error && error.response && error.response.data) || null;
      throw {
        status: (data && data.status) || -1,
        message: (data && data.message) || '',
      };
    }
  },
};
