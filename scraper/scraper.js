// Assuming we are logged into ingram - lets create a way to hit search by PO number
// Then save information about each books status, quantity, cost etc.

const puppeteer = require('puppeteer');
const ingramLogin = `https://ipage.ingramcontent.com/ipage/li001.jsp`;
const dotenv = require('dotenv');

dotenv.config();

// We'll use this object to hold information for now:
let holdData = {
    ingramU: process.env.INGRAM_U,
    ingramP: process.env.INGRAM_P
}

const loginToIngram = async (data) => {
    // Notes: I can pass parameters into the launch function - {headless: false} means show browser 
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(ingramLogin);
    // console.log(data, "HOLD THAT")
    // Login to ingram
    await page.evaluate((data) => {
        const loginForm = document.querySelector('#loginIdForm');
        const formElements = Array.from(loginForm.querySelectorAll('.form-group'));
        const userInput = formElements[0].firstChild.nextSibling;
        const passwordInput = formElements[1].firstChild.nextSibling;
        const loginBtn = formElements[2].firstChild.nextSibling;
        
        //Enter login info
        userInput.value = data.ingramU;
        passwordInput.value = data.ingramP;
        loginBtn.click();
    }, data);

    await page.screenshot({path: 'testing.png'});

    // await browser.close();
};

loginToIngram(holdData);