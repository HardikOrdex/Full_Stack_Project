import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
} from "../config/envconfig.js";
import { UserCreds } from "../models/UserCreds.js";

//@desc Register a user
//@route POST /api/users/register
//@access public
export const registerUser = async (req, res) => {
  try {
    if (req?.body) {
      console.log(JSON.stringify(req.body, null, 2));
      const { username, mail, password } = req.body;
      if (!username || !mail || !password) {
        return res.status(400).json({
          error: "Validation Error",
          message: "All fields are mandatory",
        });
      }

      // Find if the email ID is used before or not?
      const userAvailable = await User.findOne({
        where: { mail },
      });
      if (userAvailable) {
        const resJson = {
          error: "Validation Error",
          message: "Email id already in use",
        };
        console.log(JSON.stringify(resJson, null, 2));
        return res.status(400).json(resJson);
      }

      // Hashing the password:
      const hashedPassword = await hash(password, 10);
      console.log("Password hashing done");
      const result = await User.create({
        username,
        mail,
        password: hashedPassword,
      });

      if (result) {
        // Log the JSON-formatted result
        console.log("New User created: ");
        console.log(JSON.stringify(result, null, 2));
        // Send the response as JSON
        return res
          .status(201)
          .json({ message: "User created successfully", ID: result.id });
      } else {
        const errorJson = {
          error: "Internal Server Error",
          message: "Failed to create user",
        };
        console.error(
          `Something went wrong: \n${JSON.stringify(errorJson, null, 2)}`
        );
        return res.status(500).json(errorJson);
      }
    } else {
      // If the request body is missing or invalid
      return res.status(400).json({
        error: "Bad Request",
        message: "Request body is missing or invalid",
      });
    }
  } catch (error) {
    console.log("Something went wrong:");
    console.log(error.stack);
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
      "error message": error?.message,
    });
  }
};

//@desc Login user
//@route POST /api/users/login
//@access public
export const loginUser = async (req, res) => {
  const { mail, password } = req.body;
  console.log(JSON.stringify(req.body, null, 2));
  if (!mail || !password) {
    return res
      .status(400)
      .json({ error: "Validation Error", message: "All fields are mandatory" });
  }

  // Find if the user with given email ID
  const user = await User.findOne({
    where: { mail },
  });
  // User found
  if (user) {
    // User found and password matched
    if (await compare(password, user.password)) {
      const accessToken = jwt.sign(
        {
          user: {
            id: user.id,
          },
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
      );
      const refreshToken = jwt.sign(
        {
          user: {
            id: user.id,
          },
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
      );
      // Check if the user's data already exists in UserCreds or not?
      const userCredData = await UserCreds.findOne({
        where: {
            userId: user.id
        }
      });
      if(userCredData){
        await UserCreds.update(
            {
              accessToken: accessToken,
              refreshToken: refreshToken,
            },
            {
              where: {
                id: user.id,
              },
            }
          )
            .then(() => {
              res.status(200).json({ accessToken, refreshToken });
            })
            .catch(() => {
              const errorJson = {
                error: "Internal Server Error",
                message: "An error occured while DB interaction",
              };
              console.log("ERROR OCCURED: ", errorJson);
              return res.status(500).json(errorJson);
            });
      }else{
        const data = {
            accessToken, 
            refreshToken, 
            userId: user.id
        };
        await UserCreds.create(data).then(() => {
            res.status(200).json({ accessToken, refreshToken });
          })
          .catch(() => {
            const errorJson = {
              error: "Internal Server Error",
              message: "An error occured while DB interaction",
            };
            console.log("ERROR OCCURED: ", errorJson);
            return res.status(500).json(errorJson);
          });
      }
      
      // User found but password did not match
    } else {
      const errorJson = { message: "The password is incorrect" };
      console.error(
        `Something went wrong: \n${JSON.stringify(errorJson, null, 2)}`
      );
      return res.status(400).json(errorJson);
    }
    // User not found:
  } else {
    const errorJson = {
      error: "User not found with given credentials",
      message: "User name or password is incorrect",
    };
    console.error(
      `Something went wrong: \n${JSON.stringify(errorJson, null, 2)}`
    );
    return res.status(404).json(errorJson);
  }
};

//@desc Current user data
//@route GET /api/users/current
//@access private
export const currentUser = async (req, res) => {
  const result = await User.findByPk(req?.user?.id);
  console.log(result);
  return res.json({ message: "Authorized user identified", user: result.dataValues });
};
