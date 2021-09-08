import express, { request, response } from 'express'
import { Oscillator } from './controller/bot'
import {AlertController} from './controller/alert'

// @ts-ignore
import * as dotenv from 'dotenv'

dotenv.config({ path: __dirname + '/../.env' })

const app = express()

const alertsController = new AlertController()

app.get('/api/alerts/:pair', alertsController.getAlerts)

const oscillator = new Oscillator()

app.get('/rates', async (request, response) => {
    const rates = await oscillator.getRates()
    const pairs = (process.env.CURRENCY_PAIRS || "").split(',')
    const res = []
    for (let i = 0; i < pairs.length; i++) res.push({...rates[i], 'pair': pairs[i]})
    response.send(res)
})

oscillator.runBot()

app.listen(3000)