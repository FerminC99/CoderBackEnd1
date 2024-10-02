import { json, Router } from "express";
import fs from 'fs';


const router = Router();
    
    router.get('/cart/:cid', async (req, res) => {
        const  cartid  = parseInt(req.params.cid);
       
    
        const cartData = await fs.promises.readFile("src/files/cart.json", "utf-8");
        
        if(!cartData)
            return res.status(400).send({ error: 'El archivo esta vacio' })
        
        const cart = JSON.parse(cartData);
        
        let index = cart.findIndex(element => element.id === cartid);
        
        if (index > -1) {
            return res.status(200).json(cart[index])
        } else {
           return res.status(400).send({ error: 'No existe carrito' });
        }
    
    });


    router.post('/cart', async (req, res) => {
        let content = await fs.promises.readFile("src/files/cart.json", "utf-8")
        if (content){
            content = JSON.parse(content)
            const maxId =  Math.max(...content.map(element => +element.id));
            req.body.id = maxId +1
            content.push(req.body); 
            await fs.promises.writeFile("src/files/cart.json", JSON.stringify(cart));
        }
        else{
            req.body.id = 1
            let carts = [req.body]
            await fs.promises.writeFile("src/files/cart.json", JSON.stringify(carts));
            res.status(200).send({ error: null, data: "Ok" })
            res.status(400).send({ error: "No existe el archivo"})
            return content} 
    
    })
       
    router.post('/:cid/product/:pid', async (req, res) => {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);
        
        try {
            let productsData = await fs.promises.readFile('src/files/products.json', 'utf8');
            let products = productsData ? JSON.parse(productsData) : [];
    
            let cartsData = await fs.promises.readFile('src/files/cart.json', 'utf8');
            let carts = cartsData ? JSON.parse(cartsData) : [];
            const productIndex = products.findIndex((product) => product.id === pid);
            const cartIndex = carts.findIndex((cart) => cart.id === cid);
            if (cartIndex > -1) {
                if (productIndex > -1) {
                    let cartProducts = carts[cartIndex].products;
                    const productIndexCart = cartProducts.findIndex((product) => product.productId === pid);
                    if (productIndexCart > -1) {
                        cartProducts[productIndexCart].quantity++;
                    } else {
                        cartProducts.push({ productId: pid, quantity: 1 });
                    }
                    carts[cartIndex].products = cartProducts;
                } else {
                    return res.status(400).send({ error: "El producto no existe" });
                }
            } else {
                if (productIndex > -1) {
                    carts.push({
                        id: cid,
                        products: [{ productId: pid, quantity: 1 }]
                    });
                } else {
                    return res.status(400).send({ error: "El producto no existe" });
                }
            }
            await fs.promises.writeFile('src/files/cart.json', JSON.stringify(carts));  
            res.status(200).send({ message: "Producto añadido al carrito" });
        } catch (e) {
            res.status(400).send({ error: e.message });
        }
    });

    export default router;





    
    

    
       
            