import { Router } from "express"
import { readFile, writeFile } from 'fs/promises'
import { get_user_byId } from "../utils/user.js"
import { get_product_byId } from "../utils/productos.js"

const router = Router() 

const file = await readFile('./data/ventas.json', 'utf-8')
const salesData = JSON.parse(file)

router.post('/detail', (req, res) =>{
    const from = req.body.from
    const to = req.body.to
    let aux_name = ''
    let aux_product = ''

    try {
        const arr = salesData.filter(e => e.total >= from && e.total <= to)

        const result = arr.map(e =>{
            aux_name = get_user_byId(e.id_usuario)
            aux_name = aux_name.nombre + ' ' + aux_name.apellido

            const salesDetails = e.productos.map(itemSold =>{ //Recorrer los productos de la venta 
                const infoProducto = get_product_byId(itemSold.id_producto) //Encontrar el id y ubicarlos
                return{
                    nombre: infoProducto.nombre,
                    cantidad: itemSold.cantidad
                }
            })

            return {
                idSale : e.id,
                items : salesDetails,
                total : e.total,
                date : e.fecha,
                seller : aux_name
            }
        })

        if (result.length > 0){
            res.status(200).json(result)
        }
        else{
            res.status(400).json(`No existen ventas entre ${from} y ${to}`)
        }
    } catch (error) {
        res.status(500).json(`Hubo un error en el servidor al buscar las ventas...`)
    }
})

export default router