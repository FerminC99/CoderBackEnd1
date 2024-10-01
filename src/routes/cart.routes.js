import { Router } from "express";
import fs from 'fs';

router.get('/cart', async (req, res) => {
    
    try{
        let content = await fs.promises.readFile("src/files/cart.json", "utf-8")
        let cart = JSON.parse(content)
        res.status(200).send({ error: null, data: cart })
    } catch(error){
        res.status(400).send({ error: "No existe el archivo"})
        return content
    }});


    