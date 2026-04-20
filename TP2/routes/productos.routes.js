import { Router } from "express"
import { readFile, writeFile } from 'fs/promises'

const router = Router() 

const file = await readFile('./data/productos.json', 'utf-8')
const productData = JSON.parse(file)

const salesFile = await readFile('./data/ventas.json', 'utf-8')
const salesData = JSON.parse(salesFile)

router.get('/all', (req, res) =>{
    res.status(200).json(productData)
})

router.get('/:id', (req, res) => {
    const idBuscado = parseInt(req.params.id) 
    const result = productData.find(p => p.id === idBuscado)

    if (result) {
        res.status(200).json(result)
    } else {
        res.status(404).json({ mensaje: `El producto con ID ${idBuscado} no existe` })
    }
})

router.put('/precio/update/:id', (req, res) =>{
    const product_id = req.params.id
    const new_price = req.body.precio

    try {
        const index = productData.findIndex(e => e.id == product_id)
        if(index != -1){
            productData[index].precio = new_price
            writeFile('./data/productos.json', JSON.stringify(productData, null, 2))

            res.status(200).json('Precio actualizado!')
        }
        else{
            res.status(400).json('No se encontro el producto.')
        }
    } catch (error) {
        res.status(500).json('Hubo un problema con el servidor...')
    }
})

router.delete('/delete/:productID', async (req, res) =>{
    const product_id = req.params.productID

    const estaEnVenta = salesData.some(venta =>
        venta.productos.some(p => p.id_producto == product_id)
    )

    if (estaEnVenta){
        return res.status(400).json(`No se puede eliminar el producto: está vinculado a una venta.`)
    }

    try {
        const index = productData.findIndex(e => e.id == product_id)

        if(index != -1){
            productData.splice(index, 1)
            await writeFile('./data/productos.json', JSON.stringify(productData, null, 2))

            res.status(200).json('Producto eliminado!')
        }
        else{
            res.status(400).json('No se encontro el producto.')
        }
    } catch (error) {
        res.status(500).json('Hubo un problema al eliminar el producto...')
    }
})

export default router