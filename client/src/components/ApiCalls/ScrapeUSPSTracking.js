const ScrapeUSPSTracking = async (uspsTracking, wsEndpoint) => {
    try {
        console.log("ScrapeUSPSTracking...");
        const uspsTrackingData = 
            await fetch('http://localhost:9000/browser/get-data-from-usps-tracking', {
                method: 'post',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    wsUrl: wsEndpoint,
                    uspsTracking: uspsTracking
                })
            })
        return uspsTrackingData.json();
    } catch (err){
        console.log("Error in ScrapeUSPSTracking: ", err.message);
    }
}

export default ScrapeUSPSTracking;