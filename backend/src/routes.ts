import {FastifyInstance} from 'fastify'
import {z} from 'zod'
import {prisma} from './lib/prisma'

export async function AppRoutes(server:FastifyInstance){
server.get('/posts', async () => {
const posts = await prisma.post.findMany()
return posts
})


server.get('/posts/patrimony/:patrimony', async (request) => {
const patrimonyParam = z.object({
    patrimony: z.string()
})
const {patrimony} = patrimonyParam.parse(request.params)

const posts = await prisma.post.findMany({
    where: {
        patrimony: {
            startsWith: patrimony
        }
    }
})
return posts
})

server.get('/posts/user/:userId', async (request) => {
const userIdParam = z.object({
    userId: z.string()
})

const {userId} = userIdParam.parse(request.params)

const posts = await prisma.post.findMany({
    where: {
        userId: Number(userId)     
    }          
    })
return posts
})


server.post('/post', async (request) => {
const postBody = z.object({
    code: z.number(),
    patrimony: z.string(),
    description: z.string(),
    date: z.string(),
    local: z.string(),
    status: z.boolean(),
    userId: z.number()
})
const {code, patrimony, description, date, local, status, userId} = postBody.parse(request.body)
const newPost = await prisma.post.create({
    data: {
        code,
        patrimony,
        description,
        date,
        local,
        status,
        userId
    }
})

return newPost
})

server.patch('/post/local', async (request) => {
const contentBody = z.object({
    id: z.number(),
    local: z.string()
})
const {id, local} = contentBody.parse(request.body)
const postUpdated = await prisma.post.update({
    where: {
        id: id
    },
    data: {
        local: local
    }
})
return postUpdated
})

server.delete('/post/:id', async (request) => {
const idParam = z.object({
    id: z.string()
})
const {id} = idParam.parse(request.params)

const idNumber = Number(id)
const postDeleted = await prisma.post.delete({
    where: {
        id: idNumber
    }
})
return postDeleted
})

server.put('/post', async (request) => {
const putBody = z.object({
    "id": z.number(),
    "code": z.number(),
    "patrimony": z.string(),
    "description": z.string(),
    "local": z.string(),
    "status": z.boolean()
})

const {id, code, patrimony, description, local, status} = putBody.parse(request.body)

const resposta = await prisma.post.updateMany({
    where: {
        id: Number(id)
    },
    data: {
        code,
        patrimony,
        description,
        local,
        status: Boolean(status)
    }
})
return (resposta.count >= 1) ?  'atualização com sucesso' :  'nada foi atualizado'
})

server.post('/user', async (request) => {
const userBody = z.object({
    username: z.string(),
    password: z.string(),
    email: z.string()
})

let {username, password, email} = userBody.parse(request.body)

const newUser = await prisma.user.create({
    data: {
        username,
        password,
        email
    }
})
return newUser
})

server.post('/user/verifica', async (request) => {
    const verificaBody = z.object({
        username: z.string(),
        password: z.string()
    })
    const {username, password} = verificaBody.parse(request.body)
    const result = await prisma.user.findFirst({
        where: {
            username,
            password
        }
    })
    return result
})

server.get('/users', async () => {
const users = await prisma.user.findMany()
return users
})
}