import jwt from "jsonwebtoken";
import BlackListTokensModel from "../DB/Models/black-list.model.js";
import UserModel from "../DB/Models/user.model.js";

// authentication middleware
export const authenticationMiddleware = () => {
  return async (req, res, next) => {
    try {
      const { accesstoken } = req.headers;
      if (!accesstoken)
        return res.status(400).json({ message: "Login agin.." });
      // verify token
      const decodedToken = jwt.verify(accesstoken, process.env.JWT_ACCESS);
      // check if token is black listed
      const isTokenBlackListed = await BlackListTokensModel.findOne({ tokenId: decodedToken.jti });
      if (isTokenBlackListed)
        return res
          .status(401)
          .json({ message: "Token expired, please login agin" });

      // get data from database
      const user = await UserModel.findById(decodedToken._id, "-password -__v");
      if (!user)
        return res
          .status(404)
          .json({ message: "user not found, please sign up" });
      // add user deta in request
      req.authUser = user;
      req.authUser.token = {
        tokenId: decodedToken.jti,
        expiryDate: decodedToken.exp,
      };
      next();
    } catch (error) {
      console.log(error);
      if (error.name === "jwt expired") {
        return res
          .status(401)
          .json({ message: "Token expired, please login agin" });
      }
      res.status(500).json({
        error: `server error try later ${error}`,
      });
    }
  };
};
