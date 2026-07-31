import { readFile } from 'fs/promises'
import path from 'path'

let productData = []
try {
    const file = await readFile(path.join(process.cwd(), 'data', 'productos.json'), 'utf-8')
    productData = JSON.parse(file)
} catch (error) {
    console.log("Aviso: No se pudo leer productos.json en Vercel, continuando...")
}

export const get_product_byId = (id) => {
    return productData.find(e => e.id === id)
}