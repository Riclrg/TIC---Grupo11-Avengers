import Fastify from 'fastify'
import {AppRoutes} from './routes'
import cors from '@fastify/cors'

const server = Fastify()
server.register(cors)
server.register(AppRoutes)
server.listen({
    port: 3333
})
.then( () => {
    console.log('HTTP Server running on port 3333')
})