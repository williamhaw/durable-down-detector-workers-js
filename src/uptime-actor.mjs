import { DateTime, Interval } from 'luxon'

export class UptimeActor {
  constructor(state, env) {
      this.state = state
      this.env = env
  }

  async fetch(request) {
    try {
      console.log(`My id is ${this.state.id}`)
      console.log(`request is: ${JSON.stringify(request)}`)
    //   console.log(`request body is: ${JSON.stringify(request.json())}`)
      const start = DateTime.now()
      const response = await fetch(request)
      const roundTripInterval = Interval(start, DateTime.now())

      let status = ''
      if (response.status <= 299) {
        status = 'OK'
      } else {
        status = 'ERROR'
      }

      console.log(`status for ${request.url}: ${status}`)

      const data = {
        status: status,
        time: start.toUTC().toISO(),
        roundTripMs: roundTripInterval.length,
      }

      console.log(`data for ${request.url}: ${data}`)

      const responseBody = {
        monitorStatus: 'OK',
        data: data,
      }

      return new Response(JSON.stringify(responseBody))
    } catch (error) {
      console.error(`Error handling request in UptimeActor: ${error.message}`)
      return new Response(JSON.stringify({ monitorStatus: 'ERROR' }))
    }
  }
}
