import { Router } from "express";
import * as userService from "./Services/profile.service.js";
import { authenticationMiddleware } from "../../Middlewares/authentication.middleware.js";
import { authorizationMiddleware } from "../../Middlewares/authorization.middleware.js";
import { systemRoles } from "../../Constants/constants.js";
import { errorHandlerMiddleware } from "../../Middlewares/error-handler.middleware.js";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";
import { updatePasswordSchema, updateProfileSchema } from "../../Validators/user.schema.js";

const userRouter = Router();

const { USER, ADMIN } = systemRoles

userRouter.use(errorHandlerMiddleware(authenticationMiddleware()))

userRouter.get("/profile", authorizationMiddleware([USER]), errorHandlerMiddleware(userService.getProfile));

userRouter.patch("/update-password", validationMiddleware(updatePasswordSchema), errorHandlerMiddleware(userService.updatePasswordService));

userRouter.put("/update-profile", validationMiddleware(updateProfileSchema), errorHandlerMiddleware(userService.updateProfileService));

userRouter.get("/list", authorizationMiddleware([ADMIN]), errorHandlerMiddleware(userService.listUserService))

export default userRouter
