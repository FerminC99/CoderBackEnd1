import express from "express";
import usersRouter from "./routes/users.router.js";
import config from '../config.js';

const PORT = 5050;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', usersRouter);

app.use('/static', express.static(`${config.DIRNAME}/public`));

app.listen(config.PORT, () => {
    console.log(`Server activo en puerto ${config.PORT}`);
});