import express from "express";
import productRouter from './routes/products.router.js'
import cartRouter from './routes/cart.routes.js'
import config from './practica/config.js';

const PORT = "8080";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(productRouter)
app.use (cartRouter)

app.listen(PORT)