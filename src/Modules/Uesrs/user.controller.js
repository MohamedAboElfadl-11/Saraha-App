import { Router } from "express";
import * as userService from "./Services/profile.service.js";
import { authenticationMiddleware } from "../../Middlewares/authentication.middleware.js";
import { authorizationMiddleware } from "../../Middlewares/authorization.middleware.js";
import { systemRoles } from "../../Constants/constants.js";
import { errorHandlerMiddleware } from "../../Middlewares/error-handler.middleware.js";

const userRouter = Router();

const { USER, ADMIN } = systemRoles

userRouter.use(errorHandlerMiddleware(authenticationMiddleware()))

userRouter.get("/profile", authorizationMiddleware([USER]), errorHandlerMiddleware(userService.getProfile));
userRouter.patch("/update-password", userService.updatePasswordService);
userRouter.put("/update-profile", userService.updateProfileService);
userRouter.get("/list", authorizationMiddleware([ADMIN]), userService.listUserService)

export default userRouter
