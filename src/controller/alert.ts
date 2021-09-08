import pool from '../dbconfig/dbconnector'
import { Request, Response } from 'express'
import { QueryResult } from 'pg'

export class AlertController {
    public getAlerts = async (request: Request, response: Response) => {
        const client = await pool.connect()
        try {
            const pair = request.params.pair
            
            const getAlertsQuery = `SELECT currency, ask, bid, change_ratio, spike_time
                FROM alerts
                WHERE pair='${pair}'
                ORDER BY spike_time
            ;`

            const results: QueryResult = await client.query(getAlertsQuery)

            response.send(results.rows)
            
        } catch (error) {
            console.log('alert', error)
        }
        client.release()
    }
}