const scrapeUSPSTracking = async (page) => {
    const uspsData = await page.evaluate(() => {
        const uspsData = { deliveryStatus: "", deliveryStatusInfo: [] };
        const deliveryStatusEl = document.querySelector(".delivery_status");
        const deliveryStatus = deliveryStatusEl.querySelector("h2 strong").innerText.trim();
        if(deliveryStatus.includes("Label Created, not yet in system")){
            uspsData.deliveryStatus = deliveryStatus;
            return uspsData;
        } else {
            uspsData.deliveryStatus = deliveryStatus;
            const deliveryStatusInfo = Array.from(deliveryStatusEl.querySelectorAll(".status_feed p"));
            for(let i = 0; i < deliveryStatusInfo.length; i++){
                uspsData.deliveryStatusInfo.push(deliveryStatusInfo[i].innerText); 
            }
            const statusFeedHeading = document.querySelectorAll(".panel-heading")[1];
            statusFeedHeading.click();
            const statusFeedContainer = document.querySelector("#trackingHistory_1");
            const statusFeed = statusFeedContainer.querySelector(".panel-actions-content").children;
            const saveFeed = () => {
                function TrackingEntry(){ this.date = "", this.status = "", this.location = "", this.other = "" };
                const entries = [];
                let buildEntry = new TrackingEntry;
                let attributeIterator = 0;
                for(let i = 0; i < statusFeed.length; i++){
                    if(statusFeed[i].nodeName === "HR"){
                        entries.push(buildEntry);
                        buildEntry = new TrackingEntry;
                        attributeIterator = 0;
                    }
                    if(statusFeed[i].nodeName === "SPAN"){
                        attributeIterator === 0 ? buildEntry.date = statusFeed[i].innerText.trim() :
                        attributeIterator === 1 ? buildEntry.status = statusFeed[i].innerText.trim() :
                        attributeIterator === 2 ? buildEntry.location = statusFeed[i].innerText.trim() :
                        attributeIterator === 3 ? buildEntry.other = statusFeed[i].innerText.trim() :
                        null;
                        attributeIterator++;
                    }
                }
                return entries;
            }
            uspsData.feed = saveFeed();
            return uspsData;
        }
    });
    return uspsData;
}

exports.scrapeUSPSTracking = scrapeUSPSTracking;