import ProductModel from './product.model.js';


class CartsManager {
    constructor(cartModel) {
        this.cartModel = cartModel;
        this.productModel = ProductModel;
    }

    async getAll() {
        try {
            const carts = await this.cartModel.find().populate('products._id').lean();
            return {status: 200, payload: carts };
        } catch (error) {
            console.error("Error al obtener carritos:", error);
            return { status: 500, error: "Error al obtener los carritos" };
        }
    }

    async getById(id) {
        try {
            const cart = await this.cartModel.findById(id).populate('products._id').lean();
            if (!cart) {
                return { status: 404, error: "Carrito no encontrado" };
            }
            return {status: 200, payload: cart };
        } catch (error) {
            console.error("Error al obtener el carrito por id:", error);
            return { status: 500, error: "Error al obtener el carrito por id" };
        }
    }

    async createCart(products) {
        try {
            const productPromises = products.map(async product => {
                const prod = await productModel.findById(product._id).lean();
                if (!prod) {
                    throw new Error(`Producto no encontrado: ${product._id}`);
                }
            });
            await Promise.all(productPromises);

            const newCart = await this.cartModel.create({ products });
            return {status: 200, payload: newCart };
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            return { status: 500, error: error.message };
        }
    }

    async updateCart(cartId, updateData) {
        try {
            const updatedCart = await this.cartModel.findByIdAndUpdate(cartId, updateData, { new: true }).lean();
            if (!updatedCart) {
                return { status: 404, error: "Carrito no encontrado" };
            }
            return {status: 200, payload: updatedCart };
        } catch (error) {
            console.error("Error al actualizar el carrito:", error);
            return { status: 500, error: error.message };
        }
    }

    async addProductToCart(cartId, productId, qty = 1) {
        try {
            const product = await this.productModel.findById(productId).lean();
            if (!product) {
                return { status: 404, error: 'Producto no encontrado' };
            }
            let cart = await this.cartModel.findById(cartId).lean();
            const existingProduct = cart.products.find(item => String(item.product._id) === productId);
            if (existingProduct) {
                existingProduct.qty += qty;
            } else {
                cart.products.push({ product: productId, qty });
            }
            await cart.save();
            return { status: 201, message: 'Producto agregado al carrito', payload: cart };
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            return { status: 500, error: 'Error del Servidor' };
        }
    }
    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await this.cartModel.findById(cartId).lean();
            if (!cart) {
                return { status: 404, error: "Carrito no encontrado" };
            }

            cart.products = cart.products.filter(item => String(item.product._id) !== productId);
            await this.cartModel.findByIdAndUpdate(cartId, { products: cart.products });
            return { status: 200, payload: cart };
        } catch (error) {
            console.error("Error al eliminar el producto del carrito:", error);
            return { status: 500, error: "Error del Servidor" };
        }
    }

    async clearCartProducts(cartId) {
        try {
            const cart = await this.cartModel.findById(cartId);
            if (!cart) {
                return { status: 404, error: "Carrito no encontrado" };
            }
            cart.products = [];
            await cart.save();
            return { status: 200, payload: cart };
        } catch (error) {
            console.error("Error al borrar los productos del carrito:", error);
            return { status: 500, error: "Error del Servidor" };
        }
    }

    async deleteCart(cartId) {
        try {
            const deletedCart = await this.cartModel.findByIdAndDelete(cartId).lean();
            if (!deletedCart) {
                return { status: 404, error: "Carrito no encontrado" };
            }
            return { status: 200, payload: deletedCart };
        } catch (error) {
            console.error("Error al eliminar el carrito:", error);
            return { status: 500, error: error.message };
        }
    }
 

}

export default CartsManager;