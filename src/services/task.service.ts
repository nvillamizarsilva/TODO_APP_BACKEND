import { Task, TasksRepository } from "../repositories/tasks.repository"
import { HttpError } from "../utils/http-error";

export class TaskService {
    constructor(private readonly tasksRepository: TasksRepository) {}

    private validateTitle(title: string | undefined | null): void {
        if (!title || typeof title !== 'string') {
            throw new HttpError(400, 'Title is required');
        }
        if (title.trim().length < 3) {
            throw new HttpError(400, 'Title must be at least 3 characters long');
        }
    }

    getTasks =  async () =>  {
        const tasks = await this.tasksRepository.findAll();
        if (!tasks) throw new HttpError(404, 'Tasks not found');
        return tasks;
    }

    getTaskById = async (id: number) =>  {
        const task = await this.tasksRepository.findById(id);
        if (task === null) throw new HttpError(404,'Task not found');
        return task;
    }

    createTask = async (task: Task) =>  {
        this.validateTitle(task.title);
        const newTask = await this.tasksRepository.save(task);
        if (!newTask) throw new HttpError(400, 'Task not created');
        return newTask;
    }

    updateTask = (id: number, task: Task) =>  {
        this.validateTitle(task.title);
        const updatedTask = this.tasksRepository.update(id, task);
        if (!updatedTask) throw new HttpError(404, 'Task not found');
        return updatedTask;
    }

    deleteTask = (id: number) =>  {
        const deletedTask = this.tasksRepository.destroy(id);
         console.log('deletedTask', deletedTask);
        if (!deletedTask) throw new HttpError(404, 'Task not found');
        return deletedTask;
    }
} 