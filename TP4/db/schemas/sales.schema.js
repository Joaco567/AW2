import mongoose from "mongoose"

const { Schema, models, model } = mongoose

// Estructura de las ventas a crear
const SaleSchema = new Schema({
    id_usuario: {type: Schema.Types.ObjectId, required: true, ref:"user"},
    date: {type: Date, required: true, default: Date.now},
    total: {type: Number, required: true},
    products: [{
        id_producto: { type: String, required: true },
        nombre: { type: String, required: true },
        precio: { type: Number, required: true },
        cantidad: { type: Number, required: true },
        imagen: { type: String }
    }],
    address: {type: String, required: true},
    sent: {type: Boolean, default: false}
}) 

// Busca la venta, si no está, lo crea
const Sale = models.sale || model('sale', SaleSchema)

export default Sale