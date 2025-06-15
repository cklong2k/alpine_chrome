const express = require('express')
const mustacheExpress = require('mustache-express')
const puppeteer = require('puppeteer');
const { URL } = require('url');
const bodyParser = require("body-parser");
const QRCode = require("qrcode");
const app = express()
const { Readable } = require('stream');

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
        var url = req.body.url;

        console.log(url);

        // Launch the browser and open a new blank page
        const browser = await puppeteer.launch({
            headless: 'new', // 使用新 headless 模式
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        // 設定頁面超時
        page.setDefaultNavigationTimeout(45000);
        page.setDefaultTimeout(45000);

        try {
            await page.goto(url, {
                waitUntil: ['networkidle0', 'domcontentloaded'],
                timeout: 60000
            });
        } catch (e) {
            console.log('等待網頁載入超時，繼續執行...');
        }

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                bottom: '20mm',
                left: '15mm',
                right: '15mm',
            },
        });

        // 建立 ReadableStream
        const pdfStream = new Readable({
            read() { }
        });

        // 設定回應標頭
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Length', pdfBuffer.length);

        // 推送資料到 stream
        pdfStream.push(pdfBuffer);
        pdfStream.push(null); // 結束 stream

        // 管道連接到回應
        pdfStream.pipe(res);

        // 監聽結束事件
        pdfStream.on('end', async () => {
            if (browser) {
                await browser.close();
            }
        });
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
