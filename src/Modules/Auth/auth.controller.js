import { Router } from "express";
import * as auth from "./Services/authentication.service.js";
import * as schemas from "../../Validators/auth.schema.js";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";
import { errorHandlerMiddleware } from "../../Middlewares/error-handler.middleware.js";

const authRouter = Router();

authRouter.post(
    "/signup",
    validationMiddleware(schemas.signupSchema),
    errorHandlerMiddleware(auth.signupService)
);
authRouter.post(
    "/login",
    validationMiddleware(schemas.loginSchema),
    errorHandlerMiddleware(auth.loginService)
);
authRouter.get(
    "/verify/:token",
    errorHandlerMiddleware(auth.verifyEmailService)
);
authRouter.post("/refresh", errorHandlerMiddleware(auth.refreshTokenService));
authRouter.post("/logout", errorHandlerMiddleware(auth.logoutService));

authRouter.patch(
    "/forget-password",
    validationMiddleware(schemas.forgetPasswordSchema),
    errorHandlerMiddleware(auth.forgetPasswordService)
);
authRouter.put(
    "/reset-password",
    validationMiddleware(schemas.resetPasswordSchema),
    errorHandlerMiddleware(auth.resetPasswordService)
);

export default authRouter;
