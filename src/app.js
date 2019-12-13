const express = require('express')
const mustacheExpress = require('mustache-express')
const puppeteer = require('puppeteer')
const app = express()

app.engine('html', mustacheExpress())

app.set('view engine', 'html')

app.get('/export/html', (req, res) => {
    res.send(req.query.url)
})

app.get('/export/pdf', (req, res) => {
    (async () => {
        
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(req.query.url)

        const buffer = await page.pdf({
            printBackground: true,
            format: "A4"})
        res.type('application/pdf')
        res.send(buffer)
        browser.close()
    })()
})

app.listen(3000)