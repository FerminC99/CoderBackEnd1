import { Router } from 'express';
import CartModel from '../dao/cart.model.js';
import CartsManager from '../dao/cart.controller.js';

const router = Router();
const cartManager = new CartsManager(CartModel);

router.get('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartsModel.findById(cartId).populate('products.product').lean();
        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }
        res.render('cart', { cart });
    } catch (error) {
        console.error("Error al recuperar el carrito:", error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/', async (req, res) => {
    try {
        const process = await cartManager.getAll();
        res.status(process.status).send({ origin: process.origin, payload: process.payload });
    } catch (error) {
        console.error("Error al obtener carritos:", error);
        res.status(500).send({ error: 'Error al obtener carritos' });
    }
});

router.get('/one/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const process = await cartManager.getById(cid);
        if (!process.payload) {
            return res.status(404).send({ error: 'Carrito no encontrado' });
        }
        res.status(process.status).send({ payload: process.payload, error: process.error });
    } catch (error) {
        console.error("Error al obtener carrito:", error);
        res.status(500).send({ error: 'Error al obtener carrito' });
    }
});

router.post('/', async (req, res) => {
    const { content, products } = req.body;

 
    if (!content) {
        return res.status(400).send({ error: 'Se requiere el ID .' });
    }

    try {
        const process = await cartManager.createCart(content, products);
        res.status(process.status).send({ payload: process.payload, error: process.error });
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        res.status(500).send({ error: 'Error al crear el carrito' });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { qty } = req.body;

    if (!qty || qty < 1) {
        return res.status(400).send({ error: 'La cantidad debe ser un número positivo.' });
    }

    try {
        const process = await cartManager.addProductToCart(cid, pid, qty);
        if (process.error) {
            return res.status(process.status).send({ error: process.error });
        }
        res.status(process.status).send({ message: process.message, cart: process.payload });
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).send({ error: 'Error al agregar producto al carrito' });
    }
});

router.delete('/:cid/products', async (req, res) => {
    const cartId = req.params.cid;

    try {
        const process = await cartManager.clearCartProducts(cartId);
        res.status(process.status).send({ payload: process.payload, error: process.error });
    } catch (error) {
        console.error("Error al limpiar productos del carrito:", error);
        res.status(500).send({ error: 'Error al limpiar productos del carrito' });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const process = await cartManager.removeProductFromCart(cid, pid);
        if (process.error) {
            return res.status(process.status).send({ error: process.error });
        }
        res.status(process.status).send({ payload: process.payload, error: process.error });
    } catch (error) {
        console.error("Error al eliminar producto del carrito:", error);
        res.status(500).send({ error: 'Error al eliminar producto del carrito' });
    }
});

router.delete('/:id', async (req, res) => {
    const cartId = req.params.id;

    try {
        const process = await cartManager.deleteCart(cartId);
        if (process.error) {
            return res.status(process.status).send({ error: process.error });
        }
        res.status(process.status).send({ payload: process.payload, error: process.error });
    } catch (error) {
        console.error("Error al eliminar carrito:", error);
        res.status(500).send({ error: 'Error al eliminar carrito' });
    }
});

export default router;



