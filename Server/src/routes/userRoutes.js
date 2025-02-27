import express from "express";
import { currentUser, loginUser, registerUser} from "../controller/userController.js";
import { validateToken } from "../middleware/validateAccessToken.js";
import { refreshAccessToken } from "../utils/accessTokenUtils.js";
const router = express.Router();

router.post("/login", loginUser)
router.get("/current", validateToken, currentUser)
router.post("/register", registerUser)
router.get("/refresh-token", refreshAccessToken)

export default router;