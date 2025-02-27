import express from "express"; 
import { PORT } from "./config/envconfig.js";
import router from "./routes/userRoutes.js";
import sequelize from "./config/database.js";
import cors from 'cors'

const app = express();

app.use(cors());
app.use(express.json());

app.use("/user", router);

// Sync the database (create tables if they don't exist)
const syncDB = async () => {
    try {
        await sequelize.sync(); // Sync all models with the database
        console.log("Database synced successfully!");
    } catch (error) {
        console.error("Error syncing database:", error);
        process.exit(1); // Exit if syncing fails
    }
};

syncDB(); // Call the sync function

app.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`);
})