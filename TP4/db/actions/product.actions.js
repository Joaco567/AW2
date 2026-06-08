import { connectToDatabase } from "../connection.js"
import Product from "../schemas/product.schema.js"

export const createProd = async ({name, desc, price, category, image, instock})=>{
    try {
        await connectToDatabase()
        const res = await Product.create({name, desc, price, category, image, instock})
        return JSON.parse(JSON.stringify(res))
    } catch (error) {
        console.log(error)
    }
}

export const getProducts = async()=>{
    try {
        await connectToDatabase()
        const res = await Product.find()
        return JSON.parse(JSON.stringify(res))
    } catch (error) {
        console.log(error)
    }
}