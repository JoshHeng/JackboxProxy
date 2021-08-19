# Jackbox Proxy

> Proxies jackbox.tv to a custom domain using Cloudflare Workers and Vercel Serverless Functions

Currently available at: https://jackbox.joshheng.co.uk

## Deployment
1. Deploy the `ecast` directory to [Vercel](https://vercel.com) - this handles requests to the Jackbox Ecast API, as ones originating from Cloudflare fail
2. Deploy `cloudflareworker.js` to a [Cloudflare worker](https://workers.cloudflare.com) - this will be the main domain that clients connect to

## Issues & Contributions
Although this project shouldn't need any further changes, Pull Requests and Issues are welcomed
