import express from "express";
import productRouter from './routes/products.router.js'

const PORT = "8080";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(productRouter)

app.listen(PORT)