
const express = require("express");
const {auth} = require("./middlewares/auth");
const connectionDB = require("./config/connection");
const {notFound, errorHandler} = require("./middlewares/errorHandler");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const cookieParser = require('cookie-parser')
const cors = require('cors');
//routes
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");
const categoryRouter = require("./routes/category");
const wishlistRouter = require("./routes/wishlist");
const contactRouter = require("./routes/contact");

//connection to database
connectionDB(process.env.DB_CONNECTION_STRING);

//Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));

//Routes

app.get("/", (req, res) => {
    res.send("Hello From Server");
});

app.use("/api/user", authRouter);
app.use("/api/product",  productRouter);
app.use("/api/cart", auth, cartRouter);
app.use("/api/order", auth, orderRouter);
app.use("/api/category",  categoryRouter);
app.use("/api/wishlist",auth,  wishlistRouter);
app.use("/api/contact",  contactRouter);


app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Your Server is running at PORT ${PORT}`);
});
