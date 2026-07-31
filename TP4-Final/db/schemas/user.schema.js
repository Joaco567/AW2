import mongoose from "mongoose"

const { Schema, models, model } = mongoose

// Estructura de los usuarios a crear
const UserSchema = new Schema({
    nombre: {type: String, required: true},
    apellido: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    contrasena: {type: String, required: true},
    fecha: {type: Date, required: true},
    direccion: {type: String, required: true},
    activo: {type: Boolean, default: true}
}) 

// Busca el usuario, si no está, lo crea
const User = models.user || model('user', UserSchema)

export default User