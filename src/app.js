
import express from "express";
import handlebars from 'express-handlebars';
import { Server } from "socket.io";
import productRouter from './routes/products.router.js';
import cartRouter from './routes/cart.routes.js';
import config from './config.js';
import fs from 'fs';

const app = express();

export const httpServer = app.listen(config.PORT, () => {
    console.log(`Server activo en puerto ${config.PORT}`);
});

export const socketServer = new Server(httpServer);
socketServer.on('connection', (socket) => {
    console.log('Nuevo Cliente Conectado');

    const updateProducts = async () => {
        const content = await fs.promises.readFile("src/files/products.json", "utf-8");
        const products = JSON.parse(content);
        socketServer.emit('productUpdate', products);  
    };

    updateProducts();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', `${config.DIRNAME}/views`);
app.set('view engine', 'handlebars');

app.use(productRouter)
app.use (cartRouter)

app.use('/static', express.static(`${config.DIRNAME}/public`));

app.get('/', async (req, res) => {
    try {
        const content = await fs.promises.readFile("src/files/products.json", "utf-8");
        const products = JSON.parse(content);
        res.render('home', { products });
    } catch (error) {
        console.error("Error al cargar productos:", error.message);
        res.status(500).send("Error al cargar la página de productos.");
    }
});
