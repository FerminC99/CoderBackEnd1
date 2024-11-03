import { config } from '../config.js'

class ProductManager {
    constructor(model) {
        this.model = model;
    }

    async getAll(limit) {
        try {

            const products = await this.model.find().limit(limit).lean();
            return {status: 200, payload: products };
        } catch (error) {
            console.error("Error en la consulta:", error);
            return { status: 500, error: "Error al obtener productos" };
        }
    }

    async add(newData) {
        try {
            const newProduct = new this.model(newData);
            await newProduct.save();
            return {status: 201, payload: newProduct };
        } catch (err) {
            console.error("Error al agregar producto:", err);
            return { status: 500, error: err.message };
        }
    }
    async getById(id) {
        try {
            const product = await this.model.findById(id).lean();
            if (!product) {
                return { status: 404, error: "Producto no encontrado" };
            }
            return { status: 200, payload: product };
        } catch (err) {
            console.error("Error al obtener producto:", err);
            return { status: 500, error: err.message };
        }
    }

    async update(id, updProd) {
        try {
            const updatedProduct = await this.model.findByIdAndUpdate(id, updProd, { new: true }).lean();
            if (!updatedProduct) {
                return { status: 404, error: "Producto no encontrado" };
            }
            return {status: 200, payload: updatedProduct };
        } catch (err) {
            console.error("Error al actualizar producto:", err);
            return { status: 500, error: err.message };
        }
    }

    async delete(idDelete) {
        try {
            const deletedProduct = await this.model.findByIdAndDelete(idDelete).lean();
            if (!deletedProduct) {
                return { status: 404, error: "Producto no encontrado" };
            }
            return {status: 200, payload: deletedProduct };
        } catch (err) {
            console.error("Error al eliminar producto:", err);
            return { status: 500, error: err.message };
        }
    }

    async paginateProducts({ limit = 10, page = 1, query = {}, sort = 1 }) {
        try {
            const sortOrder = parseInt(sort);
            const order = sortOrder === 1 ? 1 : -1;

            const options = {
                limit: parseInt(limit),
                page: parseInt(page),
                sort: { price: order }
            };
            const result = await this.model.paginate(query, options);
            return { origin: config.SERVER, status: 200, payload: result };
        } catch (error) {
            console.error("Error paginating products:", error);
            return { status: 500, error: error.message };
        }
    }
}

export default ProductManager;