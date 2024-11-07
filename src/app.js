import express from "express";
import handlebars from 'express-handlebars';
import { Server } from "socket.io";
import config from './config.js';
import fs from 'fs';
import mongoose from 'mongoose';
import cartRoutes from './routes/routes.cart.js';
import productsRoutes from './routes/routes.products.js';

const app = express();

const startServer = async () => {
    try {
        await mongoose.connect(config.MONGODB_URI);
        const httpServer = app.listen(config.PORT, () => {
            console.log(`Servidor escuchando en el puerto ${config.PORT}`);
        });

        const socketServer = new Server(httpServer);
        socketServer.on('connection', (socket) => {
            console.log('Nuevo Cliente Conectado');

            const updateProducts = async () => {
                try {
                    const content = await fs.promises.readFile("src/files/products.json", "utf-8");
                    const products = JSON.parse(content);
                    socket.emit('productUpdate', products);  
                } catch (error) {
                    console.error("Error al leer productos:", error.message);
                }
            };

            updateProducts();
        });
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error.message);
    }
};

startServer();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', `${config.DIRNAME}/views`);
app.set('view engine', 'handlebars');

app.use('/api/db/products', productsRoutes);
app.use('/api/db/cart', cartRoutes);

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
