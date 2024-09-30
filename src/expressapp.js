import express from "express";

const PORT = 5050;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(`/`, (req,res) =>{
    res.status(200).send ({error: null, data:`Buenas, Todo va Ok`});
});

app.listen (PORT, () => {
    console.log (`Server Activo en puerto ${PORT}`);
});