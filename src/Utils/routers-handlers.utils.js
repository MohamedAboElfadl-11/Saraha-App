import { globalErrorHandler } from "../Middlewares/error-handler.middleware.js";
import authRouter from "../Modules/Auth/auth.controller.js";
import messageRouter from "../Modules/Message/message.controller.js";
import userRouter from "../Modules/Uesrs/user.controller.js";

const controllerHandler = (app) => {
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/message", messageRouter)
  app.use(globalErrorHandler)
};

export default controllerHandler;
