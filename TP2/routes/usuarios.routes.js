import e, { Router } from "express"
import { readFile, writeFile } from 'fs/promises'

const router = Router() 

const file = await readFile('./data/usuarios.json', 'utf-8')
const userData = JSON.parse(file)

router.post('/login/', (req, res) =>{
    const correo = req.body.email
    const contrasena = req.body.contrasena

    const result = userData.find(e => e.email == correo && e.contrasena == contrasena)

    try {
        if (result){
            res.status(200).json(`Inicio de sesion exitoso! Bienvenido ${result.nombre}`)
        }
        else{
            res.status(400).json(`No se pudo iniciar sesion. Por favor, revisa que el correo y contraseña sean correctos.`)
        }
    } catch (error) {
        res.status(500).json(`Hubo un problema al intentar iniciar sesion...`)
    }
})

export default router