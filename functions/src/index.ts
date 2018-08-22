import * as express from 'express';
import * as functions from 'firebase-functions';
import * as puppeteer from 'puppeteer';
import upload from './modules/upload';

const app = express();

// Add Files
upload(app);

app.post('/api/start', (req: any, res) => {
  console.log('Files', req.files);
  console.log('Body', req.fields);
  res.sendStatus(200);
});

app.post('/api/bingo', (req, res, next) => {

  const body = req.body;
  console.log('Body', req.body);

  (async () => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('https://secure.entertimeonline.com/ta/KPAY1001850.login?NoRedirect=1');
      await page.keyboard.type('jonlamb');
      await page.keyboard.press('Tab');
      await page.keyboard.type('yOB6$7NXdS');
      await page.screenshot({ path: 'images/1-loginscreen.png' });
      await page.keyboard.press('Enter');

      await page.waitForNavigation();
      await page.screenshot({ path: 'images/2-homepage.png' });

      const smsRadio = await page.$('input[value="SMS"]');
      smsRadio.click();
      await page.screenshot({ path: 'images/3-sms.png' });

      const sendTxtMsgBtn = await page.$('name="SendSMSButton"');
      sendTxtMsgBtn.click();

      await page.waitForNavigation();
      page.focus('name="TokenValueSMS"');
      await page.keyboard.type('yOB6$7NXdS'); // TODO: insert sms code here


      await browser.close();
    } catch (err) {
      // console.error(err);
    }
  })();

  res.send('Form Submitted Successfully');
});



export const startAutomation = functions.https.onRequest(app);
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