require("dotenv").config({ path: "./config.env" });
const express = require("express");
//connecting to db
const connectDb = require("./config/db");
connectDb();

const app = express();
app.use(express.json());

//routing start
app.use("/auth", require("./routers/userAuth"));
//routers end

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () =>
  console.log(`server running on port ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`logged error ${err}`);
  server.close(() => process.exit(1));
});
