const puppeteer = require('puppeteer');

const connectToBrowser = async (wsEndpoint, terminate, cb) => {
    console.log("in connect-to-browser");
    try {
        const browser = await puppeteer.connect({ browserWSEndpoint: wsEndpoint });
        if(terminate === "terminate"){
            await browser.close();
        } else {
            return browser;
        }
    } catch(err) {
        if(cb & err.type){
            console.log("using cb...")
            await cb();
        } else {
            console.log("Error in connect-to-browser: ", err.message);
        }
    }
}

exports.connectToBrowser = connectToBrowser;