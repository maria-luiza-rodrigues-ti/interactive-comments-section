import Fastify from 'fastify'

const server = Fastify({
  logger: true
})

server.get('/', async function handler (request, reply) {
  return { hello: 'world' }
})

 server.listen({ port: 3333 }).then(() => {
    console.log('HTTP server running!')
  })
