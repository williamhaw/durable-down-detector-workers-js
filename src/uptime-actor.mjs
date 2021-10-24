import { DateTime, Interval } from 'luxon'

export class UptimeActor {
  constructor(state, env) {}

  async fetch(request) {
    try {
      const start = DateTime.now()
      const response = await fetch(state.id, { method: 'GET' })
      const roundTripInterval = Interval(start, DateTime.now())

      let status = ''
      if (response.status <= 299) {
        status = 'OK'
      } else {
        status = 'ERROR'
      }

      const data = {
        status: status,
        time: start.toUTC().toISO(),
        roundTripMs: roundTripInterval.length,
      }

      const responseBody = {
        monitorStatus: 'OK',
        data: data,
      }

      return new Response(JSON.stringify(responseBody))
    } catch (error) {
      console.error(error)
      return new Response(JSON.stringify({ monitorStatus: 'ERROR' }))
    }
  }
}
