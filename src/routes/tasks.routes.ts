import { Router } from "express";
import { TasksController } from "../controllers/tasks.controller";
import { TaskService } from "../services/task.service";
import { TasksRepository } from "../repositories/tasks.repository";

export const tasksRoutes = Router();

const tasksRepository = new TasksRepository();
const taskService = new TaskService(tasksRepository);
const tasksController = new TasksController(taskService);

tasksRoutes.get('/', tasksController.getTasks)
tasksRoutes.get('/:id', tasksController.getTaskById)
tasksRoutes.post('/', tasksController.createTask)
tasksRoutes.put('/:id', tasksController.updateTask)
tasksRoutes.delete('/:id', tasksController.deleteTask)