import jwt from 'jsonwebtoken'
import 'dotenv/config'

export const verifyToken = async (token) => {
    console.log("Token recibido en middleware:", token)
    if (!token) return false

    try {
        const decode = jwt.verify(token, process.env.SECRET)
        console.log("Token verificado con éxito:", decode)
        return true
    } catch (error) {
        console.log("Error al verificar token:", error.message)
        return false
    }
}

export const decodeToken = async (token) =>{
    if (!verifyToken){
        return false
    }
    const decode = await jwt.verify(token, SECRET)
    return decode
}