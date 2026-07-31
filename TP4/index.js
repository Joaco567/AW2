import express from 'express'
import dotenv from 'dotenv'
import { readFile, writeFile } from 'fs/promises'
import { json } from 'stream/consumers'
import e from 'express'
import path from 'path'

//Importaciones de rutas
import productosRoutes from './routes/productos.routes.js'
import usuariosRoutes from './routes/usuarios.routes.js'
import ventasRoutes from './routes/ventas.routes.js'

//Traer variables de entorno
dotenv.config()

const app = express()

const port = process.env.PORT || 3000

app.use(express.json());

app.listen(port, () =>{
    console.log(`Servidor levantado en puerto ${port}`)
})

// Levantar Frontend
/* app.use(express.static('./public')) */

app.use(express.static(path.join(process.cwd(), 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'pages', 'home.html'))
})

// Rutas de productos - Endpoints
app.use('/product', productosRoutes)
app.use('/user', usuariosRoutes)
app.use('/sale', ventasRoutes)