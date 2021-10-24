// In order for the workers runtime to find the class that implements
// our Durable Object namespace, we must export it from the root module.
export { UptimeActor } from './uptime-actor.mjs'

export default {
  async fetch(request, env) {
    try {
      return await handleRequest(request, env)
    } catch (e) {
      return new Response(e.message, {status: 500})
    }
  },
}

async function handleRequest(request, env) {
  const path = new URL(request.url).pathname

  switch (path) {
    case 'schedule':
      const urls = await env.URLS.list().keys.map(k => k.name)

      let responseData = {}

      urls.foreach(url => {
        const id = env.UPTIME.idFromName(url)
        const actor = env.UPTIME.get(id)
        const response = await actor.fetch()
        responseData[url] = response
      })

      return new Response(JSON.stringify({data: responseData}))

    case 'dashboard':
      return new Response()

    default:
      return new Response(null, { status: 404 })
  }
}
