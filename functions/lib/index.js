"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const functions = require("firebase-functions");
const puppeteer = require("puppeteer");
const upload_1 = require("./modules/upload");
const app = express();
// Add Files
upload_1.default(app);
app.post('/api/start', (req, res) => {
    console.log('Files', req.files);
    console.log('Body', req.fields);
    res.sendStatus(200);
});
app.post('/api/bingo', (req, res, next) => {
    const body = req.body;
    console.log('Body', req.body);
    (() => __awaiter(this, void 0, void 0, function* () {
        try {
            const browser = yield puppeteer.launch();
            const page = yield browser.newPage();
            yield page.goto('https://secure.entertimeonline.com/ta/KPAY1001850.login?NoRedirect=1');
            yield page.keyboard.type('jonlamb');
            yield page.keyboard.press('Tab');
            yield page.keyboard.type('yOB6$7NXdS');
            yield page.screenshot({ path: 'images/1-loginscreen.png' });
            yield page.keyboard.press('Enter');
            yield page.waitForNavigation();
            yield page.screenshot({ path: 'images/2-homepage.png' });
            const smsRadio = yield page.$('input[value="SMS"]');
            smsRadio.click();
            yield page.screenshot({ path: 'images/3-sms.png' });
            const sendTxtMsgBtn = yield page.$('name="SendSMSButton"');
            sendTxtMsgBtn.click();
            yield page.waitForNavigation();
            page.focus('name="TokenValueSMS"');
            yield page.keyboard.type('yOB6$7NXdS'); // TODO: insert sms code here
            yield browser.close();
        }
        catch (err) {
            // console.error(err);
        }
    }))();
    res.send('Form Submitted Successfully');
});
exports.startAutomation = functions.https.onRequest(app);
// app.listen(3000, () => console.log('Example app listening on port 3000!'))
// async function doTheThing() {
//   var sleep = ms => new Promise(res => setTimeout(res, ms));
//   try {
//       var adminWindow = document.getElementsByName('ADMIN_CENTER')[0].contentWindow;
//       adminWindow.document.getElementsByName('zN56Q')[0].value = '49807538';
//       await sleep(2000);
//       adminWindow.document.getElementsByClassName('reloadButton addedTitle')[0].click();
//       await sleep(2000);
//       adminWindow.document.getElementsByClassName('resultRow1')[0].cells[1].children[0].click();
//       await sleep(2000);
//       adminWindow.document.getElementsByClassName('resultRow1')[0].cells[1].children[0].click();
//       await sleep(2000);
//       var popupWindow = adminWindow.document.getElementById('PopupBodyFrame').contentWindow;
//       popupWindow.document.getElementById('z15AMMA_LKP').click();
//       await sleep(2000);
//       var managerPopupWindow = popupWindow.document.getElementById('PopupBodyFrame').contentWindow;
//       managerPopupWindow.selectValue('48637087', 'Jerick Valenzuela Aapuhin');
//       await sleep(2000);
//       // adminWindow.doAction("SAVE");
//       popupWindow.document.getElementsByClassName('primaryButton')[0].click();
//       await sleep(200);
//       adminWindow.document.getElementById('PAGE_BACK_BTN').click();
//   } catch (err) {
//       console.error(err);
//   }
// }
// doTheThing();
//# sourceMappingURL=index.js.map