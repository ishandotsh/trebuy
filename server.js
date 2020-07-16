const express = require("express");
const cors = require("cors");

require("dotenv").config();

const connectDB = require("./config/db.config");
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
