import express from 'express'
import dotenv from 'dotenv'
import { readFile, writeFile } from 'fs/promises'
import { json } from 'stream/consumers'
import e from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

// Crear __dirname de forma nativa para módulos ES6
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

// Servir archivos estáticos apuntando a la ruta absoluta de public
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(process.cwd(), 'public')))

// Redireccionar la raíz '/' al Home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'home.html'))
})

// Rutas de productos - Endpoints
app.use('/product', productosRoutes)
app.use('/user', usuariosRoutes)
app.use('/sale', ventasRoutes)