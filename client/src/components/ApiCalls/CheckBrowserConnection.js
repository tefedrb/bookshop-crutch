const CheckBrowserConnection = async (wsEndpoint) => {
    try {
        console.log("Check Browser Connection...");
        const url = 'http://localhost:9000/browser/check-browser-connection/';
        const res = 
            await fetch(url,  {
                method: 'post',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    wsUrl: wsEndpoint
                })
            })
        const booleanCheck = await res.json();
        return booleanCheck; 
    } catch (err){
        console.log("Error in CheckBrowserConnection: ", err.message);
    }
}

export default CheckBrowserConnection;