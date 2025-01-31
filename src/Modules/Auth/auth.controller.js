import { Router } from "express";
import * as auth from "./Services/authentication.service.js";

const authRouter = Router();

authRouter.post("/signup", auth.signupService);
authRouter.post("/login", auth.loginService);
authRouter.get("/verify/:token", auth.verifyEmailService);
authRouter.post("/refresh", auth.refreshTokenService);
authRouter.post("/logout", auth.logoutService)
authRouter.patch("/forget-password", auth.forgetPasswordService)
authRouter.put("/reset-password", auth.resetPasswordService)

export default authRouter;
