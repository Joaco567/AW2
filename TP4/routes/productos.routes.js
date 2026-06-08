import { Router } from "express"
import { readFile, writeFile } from 'fs/promises'
import { createProd } from "../db/actions/product.actions.js"
import { getProducts } from "../db/actions/product.actions.js"

const router = Router() 

const getDataProduct = async () => {
    const fileProduct = await readFile('./data/productos.json', 'utf-8')
    return JSON.parse(fileProduct)
}

const getDataSales = async () => {
    const salesFile = await readFile('./data/ventas.json', 'utf-8')
    return JSON.parse(salesFile)
}

router.get('/all', async (req, res) => {
    const products = await getDataProduct()
    res.status(200).json(products)
})

router.get('/allmongo', async (req, res) => {
    const products = await getProducts()
    console.log(products)
    res.status(200).json(products)
})

router.get('/:id', async (req, res) => {
    const idBuscado = parseInt(req.params.id) 
    const products = await getDataProduct()
    const result = products.find(p => p.id === idBuscado)

    if (result) {
        res.status(200).json(result)
    } else {
        res.status(404).json({ mensaje: `El producto con ID ${idBuscado} no existe` })
    }
})

router.put('/update/:id', async (req, res) => {
    const { id } = req.params
    
    try {
        const products = await getDataProduct()
        const index = products.findIndex(e => e.id == id)

        if (index !== -1) {
            if (req.body.precio && isNaN(Number(req.body.precio))) {
                return res.status(400).json("El precio debe ser un número válido.")
            }

            products[index] = { ...products[index], ...req.body }
            
            await writeFile('./data/productos.json', JSON.stringify(products, null, 2))
            res.status(200).json('Producto actualizado!')
        } else {
            res.status(404).json('No se encontró el producto.')
        }
    } catch (error) {
        res.status(500).json('Hubo un problema con el servidor...')
    }
})

router.delete('/delete/:productID', async (req, res) => {
    const product_id = req.params.productID

    try {
        const sales = await getDataSales()
        const products = await getDataProduct()

        const estaEnVenta = sales.some(venta =>
            venta.productos.some(p => p.id_producto == product_id)
        )

        if (estaEnVenta) {
            return res.status(400).json(`No se puede eliminar el producto: está vinculado a una venta.`)
        }

        const index = products.findIndex(e => e.id == product_id)

        if (index !== -1) {
            products.splice(index, 1)
            await writeFile('./data/productos.json', JSON.stringify(products, null, 2))
            res.status(200).json('Producto eliminado!')
        } else {
            res.status(404).json('No se encontró el producto.')
        }
    } catch (error) {
        res.status(500).json('Hubo un problema al eliminar el producto...')
    }
})

//MongoDB
router.post('/create', async (req, res) =>{
    const {name, desc, price, category, image, instock} = req.body

    try {
        const result = await createProd({name, desc, price, category, image, instock})
        res.status(200).json(result)
        console.log(result)
    } catch (error) {
        res.status(400).json()
    }
})

export default router

