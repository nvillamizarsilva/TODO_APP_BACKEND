import { NextFunction, Request, Response } from "express";
import { TaskService } from "../services/task.service";

export class TasksController {
    constructor(private readonly taskService: TaskService) {}

    getTasks = async (_req: Request, res: Response, next: NextFunction) =>  {
        try {
            const tasks = await this.taskService.getTasks();
            res.status(200).json({ data: { tasks } });
        } catch (error) {
            next(error);
        }
    }

    getTaskById = async (req: Request, res: Response, next: NextFunction) =>  {
        try {
            const { id } = req.params;
            const task = await this.taskService.getTaskById(Number(id));
            res.status(200).json({ data: { task } });
        } catch (error) {
            next(error);
        }
    }

    createTask = async (req: Request, res: Response, next: NextFunction) =>  {
        try {
            const { title, description } = req.body;
            const task = await this.taskService.createTask({ title, description, isCompleted: false });
            res.status(201).json({ data: { task } });
        } catch (error) {
            next(error);
        }
    }

    updateTask = async (req: Request, res: Response, next: NextFunction) =>  {
        try {
            const { id } = req.params;
            const { title, description, isCompleted } = req.body;
            const task = await this.taskService.updateTask(Number(id), { id: Number(id), title, description, isCompleted });
            res.status(200).json({ data: { task } });
        } catch (error) {
            next(error);
        }
    }

    deleteTask = async (req: Request, res: Response, next: NextFunction) =>  {
        try {
            const { id } = req.params;
            const isDeleted = await this.taskService.deleteTask(Number(id));
            res.status(200).json({ data: { isDeleted } });
        } catch (error) {
            next(error);
        }
    }
}