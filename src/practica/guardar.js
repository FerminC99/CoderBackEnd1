
router.post('/products', async (req, res) => {
    const {id,title,description,code,price,status,stock,category} = req.body
    let content = await fs.promises.readFile("src/files/products.json", "utf-8")
    const products = JSON.parse (content)

    if (req.body.hasOwnProperty('title') && req.body.hasOwnProperty('description')
         && req.body.hasOwnProperty('code') && req.body.hasOwnProperty('price')&& req.body.hasOwnProperty('status')
     && req.body.hasOwnProperty('stock')&& req.body.hasOwnProperty('category')) 
     
     {const maxId = Math.max(...products.map(element => +element.id));
         const newProduct = { 
            id: maxId + 1, 
            title: req.body.title, 
            description: req.body.description,
            code: req.body.code,
            price: req.body.price,
            status: req.body.status, 
            stock: req.body.stock, 
            category: req.body.category};

         products.push(newProduct); 
         await fs.promises.writeFile("src/files/products.json", JSON.stringify(products));
         res.status(200).send({ error: null, data: newProduct });}
     
        else {
         res.status(400).send({ error: 'Faltan campos obligatorios por completar', data: [] });
     }
 });









 router.post('/products', async (req, res) => {
    const { title, description, code, price, status, stock, category } = req.body;
    if (title && description && code && price !== undefined && status !== undefined && stock !== undefined && category) {
        try {
            const content = await fs.promises.readFile("src/files/products.json", "utf-8");
            const products = JSON.parse(content);
            const maxId = products.length > 0 ? Math.max(...products.map(product => +product.id)) : 0;
            const newProduct = {
                id: maxId + 1,
                title,
                description,
                code,
                price,
                status,
                stock,
                category
            };
            products.push(newProduct);
            await fs.promises.writeFile("src/files/products.json", JSON.stringify(products, null, 2));e
            res.status(201).send({ error: null, data: newProduct });
        } catch (error) {
            console.error('Error adding product:', error);
            res.status(500).send({ error: 'Internal Server Error', data: [] });
        }
    } else {
        res.status(400).send({ error: 'Missing required fields', data: [] });
    }
});




console.log ('title: ', req.body.hasOwnProperty('title'))
console.log ('description',req.body.hasOwnProperty('description'))
console.log ('code',req.body.hasOwnProperty('code'))
console.log ('price',req.body.hasOwnProperty('price')) 
console.log ('status',req.body.hasOwnProperty('status'))
console.log ('stock',req.body.hasOwnProperty('stock'))
console.log ('category',req.body.hasOwnProperty('category'))