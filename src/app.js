const express = require('express')
const mustacheExpress = require('mustache-express')
const puppeteer = require('puppeteer')
const bodyParser = require("body-parser");
const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.engine('html', mustacheExpress())
// app.set('view engine', 'html')

app.get('/export/html', (req, res) => {
    res.send(req.query.url)
})

app.post('/export/html', (req, res) => {
    // POST json
    res.send(req.body.url)
})

app.get('/export/pdf', (req, res) => {
    // POST json
    res.send(req.body.url)
})

app.post('/export/pdf', (req, res) => {
    (async () => {
        var url = req.body.url
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(url)

        const buffer = await page.pdf({
            printBackground: true,
            format: "A4"})
        res.type('application/pdf')
        res.send(buffer)
        browser.close()
    })()
})

app.listen(3000)