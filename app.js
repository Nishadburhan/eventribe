require("dotenv").config();
const express = require("express");
const app = express();
const Config = require("./src/config/config");
const connectDB = require("./src/config/database");
const v1Router = require("./src/routes/v1/index");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB(Config);


app.use("/api/v1", v1Router);


app.listen(Config.PORT, () => {
    console.log(`Server listening on http://localhost:${Config.PORT}`);
});