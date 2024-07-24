const express = require("express");
const connectionDB = require("./config/connection");
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;

//connection to database
connectionDB(process.env.DB_CONNECTION_STRING);

//Middlewares


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes

app.get("/", (req, res) => {
  res.send("Hello From Server");
});

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);



app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Your Server is running at PORT ${PORT}`);
});
