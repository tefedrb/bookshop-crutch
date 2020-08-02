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

const checkBrowserConnection = async (wsEndpoint) => {
    try {
        const didConnect = await puppeteer.connect({ browserWSEndpoint: wsEndpoint })
            .then(() => "connected", () => "disconnected");
        return didConnect;
    } catch(err) {
        console.log("Error in checkBrowserConnection: " + err.message);
        return false;
    }
}

exports.connectToBrowser = connectToBrowser;
exports.checkBrowserConnection = checkBrowserConnection;