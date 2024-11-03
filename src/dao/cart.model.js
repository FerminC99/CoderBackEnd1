import mongoose from 'mongoose';
import productModel from './product.model.js';

mongoose.pluralize(null);

const collection = 'carts';

const schema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'products' },
        qty: { type: Number, required: true }
    }]
});

schema.pre('find', function () {
    this.populate({ path: 'products.product', model: productModel });
});

schema.pre('findOne', function () {
    this.populate({ path: 'products.product', model: productModel });
});

const model = mongoose.model(collection, schema);

export default model;