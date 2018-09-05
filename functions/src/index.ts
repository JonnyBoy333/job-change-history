import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as puppeteer from 'puppeteer';
import upload from './modules/upload';

admin.initializeApp(functions.config().firebase);

const app = express();

// app.all('*', async (req, res, next) => {
//   res.locals.browser = await puppeteer.launch({ args: ['--no-sandbox'] });
//   next(); // pass control on to router.
// });

app.get('/version', async function versionHandler(req, res) {
  const browser = res.locals.browser;
  const version = await browser.version()
  console.log(version);
  res.status(200).send(version);
  await browser.close();
});

app.get('/screenshot', async function screenshotHandler(req, res) {
  // const url = req.query.url;
  // const url = 'https://example.com';
  const url = 'https://google.com';
  if (!url) {
    return res.status(400).send(
      'Please provide a URL. Example: ?url=https://example.com');
  }

  const viewport = {
    deviceScaleFactor: 1,
    height: 1024,
    width: 1280,
  };

  let fullPage = false;
  const size = req.query.size;
  if (size) {
    const [width, height] = size.split(',').map(item => Number(item));
    if (!(isFinite(width) && isFinite(height))) {
      return res.status(400).send('Malformed size parameter. Example: ?size=800,600');
    }
    viewport.width = width;
    viewport.height = height;
  } else {
    fullPage = true;
  }

  // res.writeHead(200, {
  //   // 'Content-Type': 'text/event-stream',
  //   'Cache-Control': 'no-cache',
  //   'Connection': 'keep-alive',
  //   'Access-Control-Allow-Origin': '*',
  //   'X-Accel-Buffering': 'no' // Forces Flex App Engine to keep connection open for SSE.
  // });
  // res.write('Test');
  // res.status(200).end();

  const browser = res.locals.browser;

  try {
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });

    const opts = {
      clip: {
        height: viewport.height,
        width: viewport.width,
        x: 0,
        y: 0,
      },
      fullPage,
    };
    if (fullPage) {
      delete opts.clip;
    }

    const buffer = await page.screenshot(opts);

    res.type('image/png').send(buffer);
    await browser.close();
    return null;
  } catch (e) {
    res.status(500).send(e.toString());
    await browser.close();
    return null;
  }

});

// Add Files
upload(app);

// app.post('/api/start', (req: any, res) => {
//   console.log('Files', req.files);
//   console.log('Body', req.fields);
//   res.sendStatus(200);
// });
// interface IRequest extends Request {
//   fields: { [key: string]: string }
//   files: File[]
// }
const initialJobState = {
  job: {
    '2FA': {
      authMethod: '',
      code: '',
      defeated: false,
      has2FA: false,
      messageSent: false,
    },
    canceled: false,
    progress: {
      percent: 0,
      processed: 0,
      total: 0
    },
    screenshot: '',
    started: true
  }
}

// const finalJobState = {
//   job: {
//     '2FA': {
//       authMethod: '',
//       code: '',
//       defeated: false,
//       has2FA: false,
//       messageSent: false
//     },
//     canceled: false,
//     progress: {
//       percent: 0,
//       processed: 0,
//       total: 0
//     },
//     screenshot: '',
//     started: false
//   }
// }

const canceledJobState = {
  job: {
    '2FA': {
      authMethod: '',
      code: '',
      defeated: false,
      has2FA: false,
      messageSent: false
    },
    canceled: true,
    progress: {
      percent: 0,
      processed: 0,
      total: 0
    },
    screenshot: '',
    started: false
  }
}

const sleep = ms => new Promise(res => setTimeout(res, ms));

const db = admin.database();

app.post('/api/start', async (req: any, res, next) => {

  const d = (new Date()).getTime();

  // const body = req.body;
  console.log('Body', req.fields);
  console.log('Files', req.files);
  const { username, password, shortname, loginredirect, uid } = req.fields;

  // Create the job object in the database
  console.log('Update job');
  db.ref(`users/${uid}`).update(initialJobState);


  // console.log('Listen for job cancel');
  // // Listen for job cancel
  // functions.database.ref(`users/${uid}/job/canceled`)
  //   .onUpdate((snap) => {
  //     const val = snap.after.val();
  //     console.log('Job Canceled', val)
  //     if (val === true) {
  //       db.ref(`users/${uid}`).update(canceledJobState)
  //         .then(() => {
  //           throw new Error('Job Canceled');
  //         })
  //     }
  //   })

  console.log('Start the main process');

  // const browser = await puppeteer.launch({
  //   args: ['--no-sandbox']
  // });

  // const browser = res.locals.browser;
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    duration(d, 'after browser load');

    // Open login page
    // await page.goto('https://secure.entertimeonline.com/ta/KPAY1001850.login?NoRedirect=1');
    await page.goto(`https://secure.entertimeonline.com/ta/${shortname}.login?NoRedirect=${loginredirect === 'on' ? '1' : '0'}`, { waitUntil: 'networkidle2' });
    duration(d, 'after login page load');
    await takeScreenshot(uid, page);
    // await page.goto('https://secure.entertimeonline.com/ta/KPAY1001850.login?NoRedirect=1', { waitUntil: 'networkidle2' });
    // const opts = {
    //   clip: {
    //     height: viewport.height,
    //     width: viewport.width,
    //     x: 0,
    //     y: 0,
    //   },
    //   fullPage,
    // };
    // if (fullPage) {
    //   delete opts.clip;
    // }

    // const buffer = await page.screenshot();
    // res.type('image/png').send(buffer);


    // await page.keyboard.type('jonlamb');
    // await page.keyboard.type(username);
    // await page.keyboard.press('Tab');

    // Fill in login window
    await page.evaluate((user, pass) => {
      (<HTMLInputElement>document.querySelector('[name="Username"]')).value = user;
      (<HTMLInputElement>document.querySelector('[name="PasswordView"]')).value = pass;
      (<HTMLInputElement>document.querySelector('[name="LoginButton"')).click();
    }, username, password);
    await page.waitForNavigation();
    duration(d, 'after 2FA load');
    await takeScreenshot(uid, page);

    // console.log('Took a seconds screenshot');
    // await page.keyboard.type('yOB6$7NXdS');
    // await page.keyboard.type(password);

    // await takeScreenshot(uid, page);
    // console.log('Took a third screenshot');
    // console.log('Image', base64Image);
    // await page.keyboard.press('Enter');

    // console.log('Took a fourth screenshot');
    // const twoFAHeaderElem = await page.$('.inputFormWr>h2');

    // Does it have 2FA?
    const has2FA = await page.evaluate(() => {
      const twoFAHeaderElem = document.querySelector('div.inputFormWr>h2');
      if (twoFAHeaderElem && twoFAHeaderElem.textContent) {
        return twoFAHeaderElem.textContent === 'Configure Virtual Code Settings'
      }
      return false;
    });
    console.log('Has 2FA', has2FA);
    duration(d, 'after 2FA lookup');

    // Wait for 2FA auth method selection
    if (has2FA) {
      db.ref(`users/${uid}/job/2FA`).update({ has2FA: true });
      const endpoint = browser.wsEndpoint();
      db.ref(`users/${uid}/job`).update({ endpoint });
    }
    // await page.screenshot({ path: 'images/2-homepage.png' });

  } catch (err) {
    console.error(err);
  }
  await browser.close();
  res.json({ result: 'success' });
});

app.get('/api/authmethod', async (req, res, next) => {
  const d = (new Date()).getTime();

  const { authmethod, uid } = req.query;
  // db.ref(`users/${uid}/job/2FA/authMethod`).on('value', (snap) => {
  //   authMethod = snap.val();
  // });
  // for (let i = 0; i < 300 && !authMethod; i++) {
  //   await sleep(1000);
  // }
  console.log('Auth Method', authmethod);

  if (!authmethod) {
    res.json({ result: 'error', error: { message: 'No Auth Method Specified' } });
  }

  const endpoint = await db.ref(`users/${uid}/job/endpoint`).once('value').then(snap => snap.val());
  console.log('Endpoint', endpoint);
  try {
  const browser = await puppeteer.connect({ browserWSEndpoint: endpoint });
  duration(d, 'after browser open');

    const page = await browser.newPage();
    await page.evaluate((authMeth) => {
      const smsRadio: HTMLInputElement = document.querySelector(`input[value="${authMeth}"]`);
      smsRadio.click();
      const sendAuthMsgBtn: HTMLInputElement = document.querySelector(`[name="Send${authMeth}Button"]`);
      if (!sendAuthMsgBtn) {
        throw new Error('Auth Method Not Configured');
      } else {
        sendAuthMsgBtn.click();
      }
    }, authmethod);
    await takeScreenshot(uid, page);
    duration(d, 'after sent auth message');

    db.ref(`users/${uid}/job/2FA`).update({ messageSent: true });
    await page.waitForNavigation();


    // await page.focus(`[name="TokenValue${authMethod}"]`);
    await takeScreenshot(uid, page);
    res.json({ result: 'success' });

    let authCode = '';
    db.ref(`users/${uid}/job/2FA/code`).on('value', (snap) => {
      authCode = snap.val();
    });
    for (let i = 0; i < 300 && !authCode; i++) {
      await sleep(1000);
    }
    console.log('Auth Code', authCode);

    await page.evaluate((authMeth, authCo) => {
      (<HTMLInputElement>document.querySelector(`[name="TokenValue${authMeth}"]`)).value = authCo;
      const continueButton: HTMLInputElement = document.querySelector('[name="AuthenticateMFAButton"]');
      continueButton.click();
    }, authmethod, authCode);
    // await takeScreenshot(uid, page);


    await page.waitForNavigation();
    db.ref(`users/${uid}/job/2FA`).update({ defeated: true });
    await takeScreenshot(uid, page);

    const newEndpoint = browser.wsEndpoint();
    db.ref(`users/${uid}/job`).update({ endpoint: newEndpoint });
  } catch (err) {
    console.error(err);
    res.json({ result: 'error', error: { message: err } });
  }
});

app.get('/api/authcode', async (req, res, next) => {
  const { authCode, uid } = req.query.authMethod;
  console.log('Auth Code', authCode);

  if (!authCode) {
    res.json({ result: 'error', error: { message: 'No Auth Code Specified' } });
  }

  const job = await db.ref(`users/${uid}/job`).once('value').then(snap => snap.val());
  const endpoint = job.endpoint;
  const authMethod = job['2FA'].authMethod;
  const browser = await puppeteer.connect({ browserWSEndpoint: endpoint });

  try {

    const page = await browser.newPage();
    // const authCode = db.ref(`users/${uid}/job/2FA/code`).on('value', (snap) => snap.val());
    // for (let i = 0; i < 300 && !authCode; i++) {
    //   await sleep(1000);
    // }

    await page.evaluate((authMeth, authCo) => {
      (<HTMLInputElement>document.querySelector(`[name="TokenValue${authMeth}"]`)).value = authCo;
      const continueButton: HTMLInputElement = document.querySelector('[name="AuthenticateMFAButton"]');
      continueButton.click();
    }, authMethod, authCode);
    await takeScreenshot(uid, page);

    await page.waitForNavigation();
    db.ref(`users/${uid}/job/2FA`).update({ defeated: true });
    await takeScreenshot(uid, page);
  } catch (err) {
    console.error(err);
    res.json({ result: 'error', error: { message: err } });
  }
});

function duration(d, message) {
  // How long did this take?
  const runtimeDuration = ((new Date()).getTime() - d) / 1000;
  console.log(`Duration ${message}`, runtimeDuration);
}

async function takeScreenshot(uid, page) {
  const imageOpts: any = { encoding: 'base64' };
  const base64Image = await page.screenshot(imageOpts);
  await db.ref(`users/${uid}/job`).update({ screenshot: `data:image/png;base64,${base64Image}` });
  // await sleep(500);
}

export const api = functions.runWith({ timeoutSeconds: 120, memory: '2GB' }).https.onRequest(app);
export const test = functions.runWith({ timeoutSeconds: 120, memory: '2GB' }).https.onRequest(app);
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