import pool from '../dbconfig/dbconnector'
import axios, { AxiosResponse } from 'axios';

export interface Rate {
    ask: number;
    bid: number;
    currency: string;
}

export class Oscillator {
    private rates: Rate[] = []

    private price_change: number = parseFloat(process.env.PRICE_CHANGE_PERCENTAGE || '0.1')
    private pairs = (process.env.CURRENCY_PAIRS || "").split(',')
    private interval = parseInt(process.env.FETCH_INTERVAL || '5000')

    public checkSpike = (prevRate: Rate, currentRate: Rate) => {
        if (prevRate.ask * (1 - this.price_change) >= currentRate.ask) return [true, (currentRate.ask - prevRate.ask) / prevRate.ask];
        if (prevRate.bid * (1 + this.price_change) <= currentRate.bid) return [true, (currentRate.bid - prevRate.bid) / prevRate.bid];
        return [false, 0];
    }

    public getRates = async () => {
        try {
            const results: AxiosResponse[] = await Promise.all(this.pairs.map(pair => axios.get(`https://api.uphold.com/v0/ticker/${pair}`)))
            return results.map(res => res.data as Rate)
        }
        catch (error) {
            console.log(error)
            return []
        }
    }

    private oscillate = async () => {

        const currentRates = await this.getRates()
        if (this.rates.length == 0) {
            this.rates = currentRates
            return
        }
        else {
            const client = await pool.connect()
            for (let i = 0; i < this.pairs.length; i++) {
                const res = this.checkSpike(this.rates[i], currentRates[i])
                if (res[0]) {
                    try {
                        console.log(currentRates[i], res)
                        const insertAlertQuery = `INSERT INTO 
                            alerts (ask, bid, interval, change_ratio, percentage, pair, currency, spike_time) 
                            VALUES
                            (${currentRates[i].ask}, ${currentRates[i].bid}, ${this.interval}, ${res[1]}, ${this.price_change}, '${this.pairs[i]}', 
                                '${currentRates[i].currency}', to_timestamp(${Date.now()} / 1000.0))
                        ;`
                        await client.query(insertAlertQuery)
                    } catch (error) {
                        console.log(error)
                    }
                }
            }

            this.rates = currentRates
            client.release()
        }
    }

    public runBot = () => {
        setInterval(this.oscillate, this.interval)
    }
}