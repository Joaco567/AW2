import e, { Router } from "express"
import { readFile, writeFile } from 'fs/promises'

const router = Router() 

const getDataUser = async () => {
    const file = await readFile('./data/usuarios.json', 'utf-8')
    return JSON.parse(file)
}

router.post('/login/', async (req, res) =>{
    const correo = req.body.email
    const contrasena = req.body.contrasena

    const user = await getDataUser()
    const result = user.find(e => e.email == correo && e.contrasena == contrasena)

    try {
        if (result){
            res.status(200).json(result)
        }
        else{
            res.status(400).json(`No se pudo iniciar sesion. Por favor, revisa que el correo y contraseña sean correctos.`)
        }
    } catch (error) {
        res.status(500).json(`Hubo un problema al intentar iniciar sesion...`)
    }
})

router.post('/register/', async (req, res) =>{
    const { nombre, apellido, email, contrasena, fecha, direccion } = req.body
    const users = await getDataUser()

    const nuevoUsuario = {
        id : users.length + 1,
        nombre,
        apellido,
        email,
        contrasena,
        fecha,
        direccion,
        activo: true
    }

    const usuarioExiste = users.find(e => e.email == email)
    try {
        if (usuarioExiste){
            res.status(400).json("Ya existe un usuario registrado con ese correo.")
        }
        else{
            users.push(nuevoUsuario)
            await writeFile('./data/usuarios.json', JSON.stringify(users, null, 2));
            res.status(201).json(nuevoUsuario)
        }
    } catch (error) {
        res.status(400).json('Hubo un problema al registrarse...')
    }
})

export default router