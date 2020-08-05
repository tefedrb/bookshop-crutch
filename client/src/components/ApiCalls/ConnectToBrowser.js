const ConnectToBrowser = async (wsEndpoint, terminate = false) => {
    try {
        console.log("Connect to browser...");
        const res = 
            await fetch('http://localhost:9000/browser/connect', {
                method: 'post',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    wsUrl: wsEndpoint,
                    terminate: terminate
                })
            })
        const browser = await res.json();
        return browser;
    } catch (err){
        console.log("Error in ConnectToBrowser: ", err.message);
    }
}

export default ConnectToBrowser;