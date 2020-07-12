const ConnectToBrowser = async (wsEndpoint) => {
    try {
        console.log("Connect to browser...")
        const res = 
            await fetch('http://localhost:9000/browser/connect', {
                method: 'post',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    wsUrl: wsEndpoint
                })
            })
        const browser = await res.json();
        console.log(browser, "BROWSER RES??")
        return browser;
    } catch (err){
        console.log("Error in ConnectToBrowser: ", err.message);
    }
}

export default ConnectToBrowser;