const puppeteer = require('puppeteer');

const connectToBrowser = async (wsEndpoint, cb) => {
    console.log("in connect-to-browser");
    const browser = await puppeteer.connect({ browserWSEndpoint: wsEndpoint });
    if(cb){
        console.log("using cb...")
        await cb(browser);
    }
    return browser;
}

exports.connectToBrowser = connectToBrowser;