const puppeteer = require('puppeteer');

const connectToBrowser = async (wsEndpoint, cb) => {
    console.log("in connect-to-browser");
    try {
        const browser = await puppeteer.connect({ browserWSEndpoint: wsEndpoint });
        
        console.log(browser, "BROWSER");
        return browser;
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