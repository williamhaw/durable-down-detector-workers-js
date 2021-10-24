// In order for the workers runtime to find the class that implements
// our Durable Object namespace, we must export it from the root module.
export { UptimeActor } from './uptime-actor.mjs'

export default {
  async fetch(request, env) {
    return await handleRequest(request, env)
  },
}

async function handleRequest(request, env) {
  const path = new URL(request.url).pathname

  console.log(`Path requested: ${path}`)

  switch (path) {
    case '/schedule':
      const k = await env.URLS.list()
      const urls = k.keys.map(k => k.name)

      console.log(`URLS: ${urls}`)

      let responseData = {}

      await Promise.all(
        urls.map(async url => {
          const id = env.UPTIME.idFromName(url)
          console.log(`object id: ${id}`)
          const actor = env.UPTIME.get(id)
          const response = await actor.fetch(new Request(url))
          responseData[url] = response.json()
          console.log(`response: ${JSON.stringify(response)}`)
          console.log(`responseData: ${JSON.stringify(responseData)}`)
        }),
      )

      return new Response(JSON.stringify({ data: responseData }))

    case '/dashboard':
      return new Response()

    default:
      return new Response(null, { status: 404 })
  }
}
