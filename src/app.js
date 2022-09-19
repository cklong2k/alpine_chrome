const express = require('express')
const mustacheExpress = require('mustache-express')
const puppeteer = require('puppeteer')
const bodyParser = require("body-parser");
const QRCode = require("qrcode");
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

app.get('/export/qrcode', (req, res) => {
    QRCode.toDataURL('I am a pony!', function (err, url) {
        res.send(url)
        console.log(url)
    })
})

app.get('/export/pdf', (req, res) => {
    // BODY json
    res.send(req.body.url)
})

app.post('/export/pdf', (req, res) => {
    (async () => {
        var url = req.body.url
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        result = await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 60000
        })

        if (result.status() === 404) {
            console.error('404 status code found in result', url)
            res.sendStatus(404);
        } else {
            // await page.waitForSelector('#example', {
            //     visible: true,
            // });
            await page.waitForTimeout(1500);

            const buffer = await page.pdf({
                printBackground: true,
                format: "A4"
            })
            res.type('application/pdf')
            res.send(buffer)
        }
        browser.close()
    })()
})

app.post('/export/png', (req, res) => {
    (async () => {
        var url = req.body.url
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 60000
        })
        if (result.status() === 404) {
            console.error('404 status code found in result', url)
            res.sendStatus(404);
            browser.close()
        } else {
            // https://stackoverflow.com/questions/52497252/puppeteer-wait-until-page-is-completely-loaded
            // await page.waitForSelector('#example', {
            //     visible: true,
            // });
            await page.waitForTimeout(1500);

            // Get scroll height of the rendered page and set viewport
            const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
            // const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
            await page.setViewport({ width: 1280, height: bodyHeight });

            const b64string = await page.screenshot({
                encoding: "base64",
                fullPage: true,
            });
            const buffer = Buffer.from(b64string, "base64");
            await browser.close()
            res.type('image/png')
            res.send(buffer);
        }
    })()
})

app.listen(3000)
