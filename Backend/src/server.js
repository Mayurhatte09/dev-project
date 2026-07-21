const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB, sequelize } = require("./config/database");

const userRoute = require("./routes/user.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoute);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();

    await sequelize.sync();

    console.log("Database Synced");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.log(error);
  }
}

startServer();