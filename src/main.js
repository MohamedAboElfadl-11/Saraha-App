import express from "express";
import database_connection from "./DB/connection.js";
import controllerHandler from "./Utils/routers-handlers.utils.js";
import { config } from "dotenv";
import path from "path";
import jwt from "jsonwebtoken"
if (process.env.NODE_ENV === "prod")
  config({ path: path.resolve(`src/Config/.prod.env`) });
if (process.env.NODE_ENV === "dev")
  config({ path: path.resolve(`src/Config/.dev.env`) });
config();
const boostrap = function () {
  const app = express();
  const PORT = process.env.PORT;
  app.use(express.json());
  database_connection();
  controllerHandler(app);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
// const accesstoken = jwt.sign("beko", "hsjfijan+dcs")
// const refreshtoken = jwt.sign("beko", "sdsd+daawawd")
// console.log({ accesstoken, refreshtoken })
// const decode = jwt.verify(refreshtoken, "sdsd+daawawd")
// const newAccessToken = jwt.sign({})
// console.log(decode)
export default boostrap;
