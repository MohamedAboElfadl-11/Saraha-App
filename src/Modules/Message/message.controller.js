import { Router } from "express";
import * as  messageService from "./Services/message.service.js";
import { errorHandlerMiddleware } from "../../Middlewares/error-handler.middleware.js";
import { authenticationMiddleware } from "../../Middlewares/authentication.middleware.js";

const messageRouter = Router()

messageRouter.post("/send", errorHandlerMiddleware(messageService.sendMessageService))
messageRouter.get("/list", errorHandlerMiddleware(messageService.getMessageService))
messageRouter.get("/user-message", authenticationMiddleware(), errorHandlerMiddleware(messageService.getUserMessageService))

export default messageRouter