import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { eventController } from "../controllers/event.controller";

const eventRoute = Router();

eventRoute.post(
  "/create",
  authMiddleware.verifyToken,
  authMiddleware.isOrganizer,
  eventController.createEvent,
);
eventRoute.get("/", eventController.getAllEvents);
eventRoute.get("/:id", eventController.getEventById);
export default eventRoute;
