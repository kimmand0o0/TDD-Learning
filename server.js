const express = require("express");

require("dotenv").config();

const PORT = 3000;

const app = express();
const productRoutes = require("./routes");
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGOOSE_URL)
  .then(() => console.log("MongoDB Connected..."), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

//body-parser
app.use(express.json());

app.use("/api/products", productRoutes);

app.get("/", (request, response) => {
  response.send("Hello World");
});

// error handler
app.use((error, request, response, next) => {
  response.status(500).json({ message: error.message });
});

app.listen(PORT);
console.log(`Running on port ${PORT}`);

module.exports = app;
