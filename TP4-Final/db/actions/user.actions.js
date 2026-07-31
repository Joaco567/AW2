import { connectToDatabase } from "../connection.js"
import User from "../schemas/user.schema.js"

export const createUser = async ({nombre, apellido, email, contrasena, fecha, direccion, activo})=>{
    try {
        await connectToDatabase()
        const res = await User.create({nombre, apellido, email, contrasena, fecha, direccion, activo})
        return JSON.parse(JSON.stringify(res))
    } catch (error) {
        console.log(error)
    }
}

export const getUserByEmail = async ({email})=>{
    try {
        await connectToDatabase()
        const res = await User.findOne({email})
        return JSON.parse(JSON.stringify(res))
    } catch (error) {
        console.log(error)
    }
}

export const getUserById = async ({id})=>{
    try {
        await connectToDatabase()
        const res = await User.findById(id)
        return JSON.parse(JSON.stringify(res))
    } catch (error) {
        console.log(error)
    }
}