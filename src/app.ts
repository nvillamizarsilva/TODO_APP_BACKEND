import express from "express";
import cors from "cors";
import { tasksRoutes } from "./routes/tasks.routes";
import { errorMiddleware } from "./middlewares/errors.middleware";

export const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());


  app.get("/ping", (_req, res) => res.status(200).json({ message: "pong" }));
  // Routes
  app.use('/api/v1/tasks', tasksRoutes);

  app.use(errorMiddleware);

  return app;
};
