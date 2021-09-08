import pool from './dbconnector'

export const createTable = async () => {
    try {
        const client = await pool.connect()

        const dropQuery = `DROP TABLE IF EXISTS alerts;`

        const createAlertsQuery = `CREATE TABLE alerts (
            ask NUMERIC ( 20, 10 ),
            bid NUMERIC ( 20, 10 ),
            interval INT,
            change_ratio NUMERIC ( 12, 8),
            percentage NUMERIC ( 12, 8),
            pair VARCHAR ( 64 ) NOT NULL,
            currency VARCHAR ( 64 ) NOT NULL,
            spike_time TIMESTAMP
        );`

        await client.query(dropQuery)
        await client.query(createAlertsQuery)
       
        client.release()
    } catch (error) {
        console.log(error)
    }
}
