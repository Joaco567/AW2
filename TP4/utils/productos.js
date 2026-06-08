import { readFile } from 'fs/promises'

const file = await readFile('./data/productos.json', 'utf-8')
const productData = JSON.parse(file)

export const get_product_byId = (id)=>{
    return productData.find(e => e.id === id)
}