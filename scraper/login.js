const puppeteer = require('puppeteer');
const { connectToBrowser } = require('./connect-to-browser');

const ingramLogin = process.env.INGRAM_LOGIN_URL;

const loginToIngram = async (login) => {
    // Notes: I can pass parameters into the launch function - {headless: false} means browser gui will open 
    // login.browser
    let browser;
    let page;
    if(login?.browserStatus === "connected"){
        browser = await connectToBrowser(login.wsEndpoint);
        // MIGHT NEED THIS TO BE PAGES()[1]
        page = (await browser.pages())[0];
    } else {
        browser = await puppeteer.launch({headless: false});
        page = await browser.newPage();
    }

    try {
        await page.goto(ingramLogin);

        // Login to ingram
        await page.evaluate((login) => {
            const loginForm = document.querySelector('#loginIdForm');
            const formElements = Array.from(loginForm.querySelectorAll('.form-group'));
            const userInput = formElements[0].firstChild.nextSibling;
            const passwordInput = formElements[1].firstChild.nextSibling;
            const loginBtn = formElements[2].firstChild.nextSibling;
            //Enter login info
            userInput.value = login.ingramU;
            passwordInput.value = login.ingramP;
            loginBtn.click();
            return login;
        }, login);
        // Let page settle
        await page.waitForNavigation();
    } catch(err){
        console.log("Error loging into Ingram: " + err);
    }

    return browser;
}

exports.loginToIngram = loginToIngram;


