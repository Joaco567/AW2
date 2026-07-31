import { Router } from "express"
import { readFile, writeFile } from 'fs/promises'
import { get_user_byId } from "../utils/user.js"
import { get_product_byId } from "../utils/productos.js"
import { createSale } from "../db/actions/sales.actions.js"
import { getUserById } from "../db/actions/user.actions.js"
import User from "../db/schemas/user.schema.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { verifyToken } from "../public/utils/middleware.js"


const router = Router() 

const getDataSales = async () => {
    const fileSales = await readFile('./data/ventas.json', 'utf-8')
    return JSON.parse(fileSales)
}

const getDataUser = async () => {
    const fileUser = await readFile('./data/usuarios.json', 'utf-8')
    return JSON.parse(fileUser)
}


router.post('/detail', async (req, res) =>{
    const from = req.body.from
    const to = req.body.to
    let aux_name = ''
    let aux_product = ''

    try {
        const dataSales = await getDataSales()
        const arr = dataSales.filter(e => e.total >= from && e.total <= to)

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

router.post('/checkout', async (req, res)=>{
    try {
        const { id_usuario, productos, total } = req.body

        const sales = await getDataSales()
        const users = await getDataUser()

        const usuario = users.find(e => e.id == id_usuario)

        const nuevaVenta = {
            id: sales.length + 1,
            id_usuario,
            fecha: new Date().toLocaleDateString('es-AR'),
            total: total,
            direccion: usuario.direccion,
            enviado: false,
            productos: productos.map(item=>({
                id_producto: item.id_producto,
                cantidad: item.cantidad,
                precio_unitario: item.precio
            }))
        }

        sales.push(nuevaVenta)
        await writeFile('./data/ventas.json', JSON.stringify(sales, null, 2));
        res.status(200).json('Compra exitosa!')
    } catch (error) {
        res.status(400).json('Hubo un problema al procesar la compra...')
    }
})

//MongoDB
router.post('/checkoutmongo', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader ? authHeader.split(' ')[1] : null;

        const tokenValido = await verifyToken(token);
        if (!tokenValido) {
            return res.status(401).json("Tu sesión ha expirado o el token es inválido. Vuelve a loguearte.");
        }

        const { id_usuario, total, products, address } = req.body
        const user = await getUserById({id: id_usuario})
        if (!user) {
            return res.status(404).json('Usuario no encontrado.')
        }

        const ventaGuardada = await createSale({
            id_usuario: id_usuario,
            total: total,
            products: products.map(item => ({
                id_producto: item.id_producto,
                cantidad: item.cantidad,
                precio: item.precio || item.price,
                nombre: item.nombre
            })),
            address: address
        })

        res.status(201).json(ventaGuardada)
        console.log("Venta procesada con éxito en MongoDB:", ventaGuardada)

    } catch (error) {
        console.error(error)
        res.status(400).json('Hubo un problema al procesar la compra...')
    }
})

export default router