import e, { Router } from "express"
import { readFile, writeFile } from 'fs/promises'
import { createUser } from "../db/actions/user.actions.js"
import { getUserByEmail } from "../db/actions/user.actions.js"
import { getUserById } from "../db/actions/user.actions.js"
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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

//MongoDB

router.post('/registermongo/', async (req, res) => {
    const { nombre, apellido, email, contrasena, fecha, direccion } = req.body

    try {
        const hashedPass = bcrypt.hashSync(contrasena, 8)

        const usuarioCreado = await createUser({ nombre, apellido, email, contrasena: hashedPass, fecha, direccion })
        const token = jwt.sign({id: usuarioCreado._id}, process.env.SECRET, { expiresIn: 86400 })

        res.status(201).json({ usuario: usuarioCreado, token: token })
        console.log("Usuario registrado con éxito y token generado:", usuarioCreado._id)
    } catch (error) {
        console.log(error)
        res.status(400).json("Hubo un problema al crear la cuenta.")
    }
})

router.get('/byEmail/:email', async (req, res) => {
    const email = req.params.email

    try {
        const result = await getUserByEmail({email})
        res.status(200).json(result)
        console.log(result)
    } catch (error) {
        res.status(400).json()
    }
})

router.get('/byId/:id', async (req, res) => {
    const id = req.params.id
    try {
        const result = await getUserById({id})
        res.status(200).json(result)
        console.log(result)
    } catch (error) {
        res.status(400).json()
    }
})

router.post('/loginmongo/', async (req, res) => {
    const { email, contrasena } = req.body

    try {
        const usuario = await getUserByEmail({email})
        
        if (!usuario) {
            return res.status(400).json("No se pudo iniciar sesion. El correo ingresado no existe.")
        }

        const controlPass = bcrypt.compareSync(contrasena, usuario.contrasena)
        console.log("¿Contraseña correcta?:", controlPass)

        if (controlPass) {
            const token = jwt.sign({id: usuario._id}, process.env.SECRET, {expiresIn: 86400})
            
            res.status(200).json({ usuario, token })
        } else {
            res.status(400).json("No se pudo iniciar sesion. La contraseña ingresada no es correcta.")
        }
    } catch (error) {
        console.error(error)
        res.status(500).json("Hubo un error interno en el servidor al intentar loguearse.")
    }
})

export default router