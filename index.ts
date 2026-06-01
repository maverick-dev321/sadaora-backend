import app from "./app";
import { sequelize } from "./config/database";

const PORT = process.env.PORT || 5000;

// Test database connection and sync models
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected.");
    return sequelize.sync({ alter: true }); // Use { force: true } to drop tables in development
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
