# uphold-bot

## Introduction
First need to generate the test data and the environment variables are based on **.env** file.
The scripts to generate, test, and serve are as follow:

```bash
npm run generate
npm run test
npm run serve
```

Test using the following urls, can also test the performance.

- http://localhost:3000/api/alerts/BTC-USD
- http://localhost:3000/rates

## Docker Build

```bash
docker build --no-cache -t gcr.io/uphold/oscillator-bot:latest .
docker-compose -p uphold up
```
