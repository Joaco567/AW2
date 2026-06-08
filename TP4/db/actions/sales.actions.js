import { connectToDatabase } from "../connection.js"
import Sale from "../schemas/sales.schema.js"

export const createSale = async ({id_usuario, date, total, products, address, sent})=>{
    try {
        await connectToDatabase()
        const res = await Sale.create({id_usuario, date, total, products, address, sent})
        return JSON.parse(JSON.stringify(res))
    } catch (error) {
        console.log(error)
    }
}