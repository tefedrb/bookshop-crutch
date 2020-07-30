const ScrapeUPSTracking = async (upsTracking, wsEndpoint) => {
    try {
        console.log("ScrapeUPSTracking...");
        const upsTrackingData = 
            await fetch('http://localhost:9000/browser/get-data-from-ups-tracking', {
                method: 'post',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    wsUrl: wsEndpoint,
                    upsTracking: upsTracking
                })
            })
        return upsTrackingData.json();
    } catch (err){
        console.log("Error in ScrapeUPSTracking: ", err.message);
    }
}

export default ScrapeUPSTracking;