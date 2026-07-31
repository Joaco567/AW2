import mongoose from "mongoose"

const { Schema, models, model } = mongoose

// Estructura de los productos a crear
const ProductSchema = new Schema({
    name: {type: String, required: true, unique: true},
    desc: {type: String, required: true},
    price: {type: Number, required: true},
    category: {type: String, required: true},
    image: {type: String, required: true},
    instock: {type: Boolean, default: false}
}) 

// Busca el producto, si no está, lo crea
const Product = models.product || model('product', ProductSchema)

export default Product