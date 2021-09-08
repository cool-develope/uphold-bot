import { Oscillator, Rate } from './bot'

// @ts-ignore
import * as dotenv from 'dotenv'
import exp from 'constants';

dotenv.config({ path: __dirname + '/../../.env' })

jest.setTimeout(50000)

describe("ConsumerController", () => {
    test("Pair count should be equal", async () => {
        const oscillator = new Oscillator()
        
        const rates = await oscillator.getRates()

        expect(rates.length).toEqual((process.env.CURRENCY_PAIRS || "").split(',').length)
    });

    test("Check spike", async () => {
        const oscillator = new Oscillator()
        
        const price_change: number = parseFloat(process.env.PRICE_CHANGE_PERCENTAGE || '0.1')
        const res1 = oscillator.checkSpike({'ask':100, 'bid':100, 'currency':'usd'}, {'ask':100 * (1 - price_change) , 'bid':100, 'currency':'usd'})
        const res2 = oscillator.checkSpike({'ask':100, 'bid':100, 'currency':'usd'}, {'ask':100, 'bid':100 * (1 + price_change), 'currency':'usd'})
        const res3 = oscillator.checkSpike({'ask':100, 'bid':100, 'currency':'usd'}, {'ask':100 * (1 + price_change), 'bid':100 * (1 - price_change), 'currency':'usd'})
        
        expect(res1[0]).toEqual(true)
        expect(res2[0]).toEqual(true)
        expect(res3[0]).toEqual(false)
    });
});