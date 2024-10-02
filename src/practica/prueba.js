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



router.post('/:cid/product/:pid', async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    
    try {
        let products = await fs.promises.readFile('src/files/products.json', 'utf8');
        products = JSON.parse(products);
        
        let carts = await fs.promises.readFile('src/files/cart.json', 'utf8'); 
        carts = JSON.parse(carts);
    
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
                await fs.promises.writeFile('src/files/cart.json', JSON.stringify(carts));  
                res.status(200).send({ message: "OK" });
            } else {
                res.status(400).send({ error: "El producto no existe" });}}
                 else {
            res.status(400).send({ error: "El carrito no existe" });}} 
            catch (e) {
        res.status(400).send({ error: e.message }); }
});