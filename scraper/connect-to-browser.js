const puppeteer = require('puppeteer');

const connectToBrowser = async (wsEndpoint) => {
    console.log("in connect-to-browser");
    const browser = await puppeteer.connect({ browserWSEndpoint: wsEndpoint });
    return browser;
}

exports.connectToBrowser = connectToBrowser;