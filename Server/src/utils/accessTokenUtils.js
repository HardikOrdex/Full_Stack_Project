import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
} from "../config/envconfig.js";
import jwt from "jsonwebtoken";


export const refreshAccessToken = async (req, res) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    await jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        const errorJson = {
          title: "Unauthorized User",
          error: "Invalid refresh token",
        };
        if (err.message === "jwt expired") {
          const errorJson = {
            title: "Unauthorized User",
            error: "Refresh Token Expired",
          };
          console.log("Unauthorized User: ", errorJson);
          return res.status(403).json(errorJson);
        }
        console.log("Unauthorized User: ", errorJson);
        return res.status(401).json(errorJson);
      }
      console.log("decoded");
      console.log(decoded);
      const id = decoded?.user?.id;
      const newAccessToken = jwt.sign(
        {
          user: {
            id,
          },
        },
        ACCESS_TOKEN_SECRET,
        {
          expiresIn: ACCESS_TOKEN_EXPIRY,
        }
      );
      await UserCreds.update(
        {
          accessToken: newAccessToken,
        },
        {
          where: {
            id: id,
          },
        }
      )
        .then(() => {
          return res.status(200).json({ accessToken: newAccessToken });
        })
        .catch(() => {
          const errorJson = {
            error: "Internal Server Error",
            message: "An error occured while DB interaction",
          };
          console.log("ERROR OCCURED: ", errorJson);
          return res.status(500).json(errorJson);
        });
    });
  }
  if (!token) {
    return res.status(401).json({
      title: "Unauthorized",
      message: "User is not authorized or token is missing",
    });
  }
};
