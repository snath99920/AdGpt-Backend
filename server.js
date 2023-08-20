// This is your test secret API key.
const express = require("express");
const dotenv = require("dotenv");
var cors = require("cors");
const port = 4243;
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", require("./paymentRoute.js"));

app.listen(port, () => console.log("Running on port", port));
