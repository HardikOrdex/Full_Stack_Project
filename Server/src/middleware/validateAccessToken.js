import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
} from "../config/envconfig.js";
import { promisify } from "util";

// Promisify the jwt.verify method for cleaner async/await handling
const verifyToken = promisify(jwt.verify);

// export const validateToken = async (req, res, next) => {
//   let accessToken;
//   let refreshToken;
//   let authHeader = req.headers.Authorization || req.headers.authorization;

//   if (authHeader && authHeader.startsWith("Bearer")) {
//     accessToken = authHeader.split(" ")[1];
//     refreshToken = req.headers["x-refresh-token"];

//     if (!accessToken) {
//         console.log("access Token not found and returning res");
//       return res.status(401).json({
//         title: "Unauthorized",
//         message: "Access token is missing",
//       });
//     }

//     // Verify the access token
//     jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, accessDecoded) => {
//       if (err) {
//         console.log("Error during accessToken verification");
//         // If the access token is expired, attempt to use the refresh token
//         if (err?.message === "jwt expired") {
//             console.log("AccessToken expired");
//           if (!refreshToken) {
//             console.log("refresh token not found");
//             return res.status(401).json({
//               title: "Unauthorized",
//               message: "Refresh token is missing",
//             });
//           }

//           // Verify the refresh token
//           jwt.verify(
//             refreshToken,
//             ACCESS_TOKEN_SECRET,
//             (err, refreshDecoded) => {
//               if (err) {
//                 console.log("error in refresh token verification and returning res")
//                 return res.status(403).json({
//                   title: "Unauthorized",
//                   message: "Refresh Token Expired",
//                 });
//               }
//               console.log("All good");
//               // If the refresh token is valid, generate a new access token
//               try {
//                 const newAccessToken = jwt.sign(
//                   { user: { id: refreshDecoded.user.id } },
//                   ACCESS_TOKEN_SECRET,
//                   { expiresIn: ACCESS_TOKEN_EXPIRY }
//                 );
//                 console.log("new accessTOken generated")
//                 // Attach the new access token to the request headers for further use
//                 req.headers["Authorization"] = `Bearer ${newAccessToken}`;
//                 req.user = refreshDecoded.user;

//                 // Proceed to the next middleware with the updated access token
//                 console.log("res.headersSent");
//                 console.log(res.headersSent);
//                 if(!res.headersSent) return next();
//               } catch (error) {
//                 console.error("Error refreshing access token:", error);
//                 return res.status(500).json({
//                   title: "Server Error",
//                   message: "Failed to refresh access token",
//                 });
//               }
//             }
//           );
//         } else {
//           return res.status(401).json({
//             title: "Unauthorized",
//             message: "Invalid Access Token",
//           });
//         }
//       }

//       // If the access token is valid, attach user info and proceed
//       console.log("If access token is valid");
//       req.user = accessDecoded?.user;
//       console.log("res.headersSent");
//       console.log(res.headersSent);
//       if(!res.headersSent) next()
//     });
//   } else {
//     return res
//       .status(401)
//       .json({ title: "Unauthorized", message: "Token is missing" });
//   }
// };

export const validateToken = async (req, res, next) => {
  let accessToken;
  let refreshToken;
  let authHeader = req.headers.Authorization || req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    accessToken = authHeader.split(" ")[1];
    refreshToken = req.headers["x-refresh-token"];

    if (!accessToken) {
      console.log("Access Token not found and returning res");
      return res.status(401).json({
        title: "Unauthorized",
        message: "Access token is missing",
      });
    }

    try {
      // Verify the access token
      const accessDecoded = await verifyToken(accessToken, ACCESS_TOKEN_SECRET);
      console.log("If access token is valid");

      req.user = accessDecoded?.user;

      // If access token is valid, proceed to the next middleware
      if (!res.headersSent) next();
    } catch (err) {
      console.log("Error during accessToken verification");

      if (err?.message === "jwt expired") {
        console.log("AccessToken expired");

        if (!refreshToken) {
          console.log("Refresh token not found");
          return res.status(401).json({
            title: "Unauthorized",
            message: "Refresh token is missing",
          });
        }

        // Verify the refresh token
        try {
          const refreshDecoded = await verifyToken(
            refreshToken,
            ACCESS_TOKEN_SECRET
          );
          console.log("All good");

          // If the refresh token is valid, generate a new access token
          const newAccessToken = jwt.sign(
            { user: { id: refreshDecoded.user.id } },
            ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRY }
          );
          console.log("New access token generated");

          // Attach the new access token to the request headers for further use
          req.headers["Authorization"] = `Bearer ${newAccessToken}`;
          req.user = refreshDecoded.user;

          // Proceed to the next middleware with the updated access token
          if (!res.headersSent) return next();
        } catch (error) {
          console.error("Error refreshing access token:", error);
          if (error?.message === "jwt expired") {
            return res.status(401).json({
              title: "Unauthorized",
              message: "Refresh Token expired. Pls login again",
            });
          }
          return res.status(500).json({
            title: "Server Error",
            message: "Failed to refresh access token",
          });
        }
      } else {
        return res.status(401).json({
          title: "Unauthorized",
          message: "Invalid Access Token",
        });
      }
    }
  } else {
    return res.status(401).json({
      title: "Unauthorized",
      message: "Token is missing",
    });
  }
};
