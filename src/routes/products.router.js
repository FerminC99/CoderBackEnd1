import { Router } from "express";
import fs from 'fs';
import { socketServer } from '../app.js';

const router = Router();

router.get('/products', async (req, res) => {
    
    try{
        let content = await fs.promises.readFile("src/files/products.json", "utf-8")
        let products = JSON.parse(content)
        products = products.slice(0,11)
        res.status(200).send({ error: null, data: products })
    } catch(error){
        res.status(400).send({ error: "No existe el archivo"})
    }
    
    
});

router.get('/products/:pid', async (req, res) => {
    const  productid  = parseInt(req.params.pid);
    console.log("Id: ", productid)
try{
    const productsData = await fs.promises.readFile("src/files/products.json", "utf-8");
    const products = JSON.parse(productsData);
    
    let index = products.findIndex(element => element.id === productid);
    
    if (index > -1) {
        return res.status(200).json(products[index]);
    } else {
       return res.status(400).send({ error: 'Producto no encontrado' });
    }
}catch (error) {
        console.error('Error leyendo products', error.message);
        return res.status(400).send({ error: 'Error interno del servidor' }); 
    }
});


router.post('/products', async (req, res) => {
    const {id,title,description,code,price,status,stock,category} = req.body
    let content = await fs.promises.readFile("src/files/products.json", "utf-8")
    const products = JSON.parse (content)


    if (req.body.hasOwnProperty('title') && req.body.hasOwnProperty('description')
        && req.body.hasOwnProperty('code') && req.body.hasOwnProperty('price')&& req.body.hasOwnProperty('status')
        && req.body.hasOwnProperty('stock')&& req.body.hasOwnProperty('category')){ 
        
        const maxId =  Math.max(...products.map(element => +element.id));
        req.body.id = maxId+1
        products.push(req.body); 
        await fs.promises.writeFile("src/files/products.json", JSON.stringify(products));
        socketServer.emit('productUpdate', products);
        res.status(200).send({ error: null, data: products});
    }
        else {
            res.status(400).send({ error: 'Faltan campos obligatorios por completar', data: [] });
        }
 });


router.put('/products/:pid', async (req, res) => {
    const id = parseInt(req.params.pid);
    const productsData = await fs.promises.readFile("src/files/products.json", "utf-8");
    const products = JSON.parse(productsData);
    const index = products.findIndex(element => element.id === id);
    if (index > -1) {
        products[index] = req.body;
        const upd = JSON.stringify (products)
        await fs.promises.writeFile("src/files/products.json", upd)

        res.status(200).send({ error: null, data: products[index] });
    } else {
        res.status(404).send({ error: 'No se encuentro el producto', data: [] });
    }
});

router.delete('/products/:pid',async (req, res) => {
    const id = parseInt(req.params.pid);
    const productsData = await fs.promises.readFile("src/files/products.json", "utf-8");
    const products = JSON.parse(productsData)
    const index = products.findIndex(element => element.id === id);
    
    if (index > -1) {
        products.splice(index, 1);
        await fs.promises.writeFile("src/files/products.json", JSON.stringify (products))
        socketServer.emit('productUpdate', products);
        res.status(200).send({ error: null, data: 'Producto eliminado' });
    } else {
        res.status(404).send({ error: 'No se encuentro el producto', data: [] });
    }
});


router.get('/home', async (req, res) => {
    try {
        const content = await fs.promises.readFile("src/files/products.json", "utf-8");
        const products = JSON.parse(content);
        res.render('home', { products });  
    } catch (error) {
        console.error("Error al cargar productos:", error.message);
        res.status(400).send({ error: 'Error al cargar la página de productos' });
    }
});




router.get('/realtimeproducts', async (req, res) => {
    try {
        const content = await fs.promises.readFile("src/files/products.json", "utf-8");
        const products = JSON.parse(content);
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error("Error al cargar productos:", error.message);
        res.status(400).send("Error al cargar la página de productos en tiempo real.");
    }
});

export default router;




