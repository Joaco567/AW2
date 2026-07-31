import { readFile } from 'fs/promises'
import path from 'path'

let userData = []
try {
    const file = await readFile(path.join(process.cwd(), 'data', 'usuarios.json'), 'utf-8')
    userData = JSON.parse(file)
} catch (error) {
    console.log("Aviso: No se pudo leer usuarios.json en Vercel, continuando...")
}

export const get_user_byId = (id) => {
    return userData.find(e => e.id === id)
}