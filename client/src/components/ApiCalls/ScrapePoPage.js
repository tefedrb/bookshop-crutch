const ScrapePoPage = async (wsUrl) => {
    try {
        console.log("Scraping po page...")
        const res = 
            await fetch('http://localhost:9000/browser/scrape-po-info/',{
                method: 'post',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    wsUrl: wsUrl
                })
            })
        return res.json();
    } catch (err){
        console.log("Error in ScrapePoPage ", err.message);
    }
}

export default ScrapePoPage;