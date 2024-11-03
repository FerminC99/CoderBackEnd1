import { Router } from 'express';
import ProductModel from '../dao/product.model.js';
import ProductManager from '../dao/product.controller.js';
import uploader from '../middlewares/uploader.js'; 

const router = Router();
const productManager = new ProductManager(ProductModel);


router.get('/paginate', async (req, res) => {
    try {
        const { limit = 10, page = 1, query, sort } = req.query;
        const parsedQuery = query ? JSON.parse(query) : {};
        const result = await productManager.paginateProducts({ limit, page, query: parsedQuery, sort });
        res.status(result.status).send({ origin: result.origin, payload: result.payload });
    } catch (error) {
        console.error(`Error al obtener productos paginados: ${error.message}`);
        res.status(500).send({ error: 'Error al obtener productos paginados' });
    }
});


router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 10;
        const result = await productManager.getAll(limit);
        res.status(result.status).send({ origin: result.origin, payload: result.payload });
    } catch (error) {
        console.error(`Error al obtener productos: ${error.message}`);
        res.status(500).send({ error: 'Error al obtener productos' });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await productManager.getById(id);
        if (!result.payload) {
            return res.status(404).send({ error: 'Producto no encontrado' });
        }
        res.status(result.status).send({ origin: result.origin, payload: result.payload });
    } catch (error) {
        console.error(`Error al obtener producto: ${error.message}`);
        res.status(500).send({ error: 'Error al obtener producto' });
    }
});

router.post('/', uploader.array('thumbnails', 4), async (req, res) => {
    const { title, description, price, code, stock, category } = req.body;

    if (!title || !description || !price || !code || !stock || !category) {
        return res.status(400).send({ error: 'Todos los campos requeridos deben estar presentes.' });
    }

    try {
        const thumbnails = req.files ? req.files.map(file => file.filename) : [];
        const newProduct = {
            title,
            description,
            price: parseFloat(price), 
            code,
            stock: parseInt(stock, 10), 
            category,
            thumbnails
        };

        const addedProduct = await ProductModel.create(newProduct);
        res.status(201).send(addedProduct);
    } catch (error) {
        console.error(`Error al crear producto: ${error.message}`);
        res.status(500).send({ error: 'Error al crear producto' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updProd = req.body;
        const result = await productManager.update(id, updProd);
        if (!result.payload) {
            return res.status(404).send({ error: 'Producto no encontrado para actualizar' });
        }
        res.status(result.status).send({ origin: result.origin, payload: result.payload });
    } catch (error) {
        console.error(`Error al actualizar producto: ${error.message}`);
        res.status(500).send({ error: 'Error al actualizar producto' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await productManager.delete(id);
        if (!result.payload) {
            return res.status(404).send({ error: 'Producto no encontrado para eliminar' });
        }
        res.status(result.status).send({ origin: result.origin, payload: result.payload });
    } catch (error) {
        console.error(`Error al eliminar producto: ${error.message}`);
        res.status(500).send({ error: 'Error al eliminar producto' });
    }
});

export default router;
