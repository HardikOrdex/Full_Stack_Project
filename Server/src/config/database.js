import { Sequelize } from "sequelize";
import { MYSQL_DATABASE, MYSQL_HOST, MYSQL_PASSWORD, MYSQL_USER } from "./envconfig.js";

// Create a new Sequelize instance and connect to the database
const sequelize = new Sequelize({
  dialect: "mysql",
  host: MYSQL_HOST, // e.g. 'localhost'
  username: MYSQL_USER, // e.g. 'root'
  password: MYSQL_PASSWORD, // your password
  database: MYSQL_DATABASE, // your database name
  logging: false, // Disable SQL query logging (optional)
});

// Test the DB connection
const connectDB = async () => {
  try {
    await sequelize.authenticate(); // Try authenticating the connection
    console.log("Database connected successfully!!!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1); // Exit the process if the connection fails
  }
};

connectDB(); // Call the function to connect to the database

export default sequelize; // Export the Sequelize instance
