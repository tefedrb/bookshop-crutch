const scrapeUSPSTracking = async (page) => {
    const uspsData = await page.evaluate(() => {
        class TrackingEntry {
            constructor(status = "", date = "", location = "", other = "") {
                this.date = date, this.status = status, this.location = location, this.other = other;
            }
        }
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

const scrapeUPSTracking = async (page) => {
    console.log("HERE WE ARE RIGHT BEFORE A FAILURE");
    const upsData = await page.evaluate(() => {
        class TrackingEntry {
            constructor(status = "", date = "", location = "", other = "") {
                this.date = date, this.status = status, this.location = location, this.other = other;
            }
        }
        const data = {};

        const shipmentProgressBtn = document.querySelector("button.ups-drawer-btn");
        shipmentProgressBtn.click();
        const detailedViewBtn = document.querySelector("#stApp_lblShipProgressTableViewDetailed");
        detailedViewBtn.click();
        const detailedViewBody = document.querySelector("tbody.ng-tns-c6-3");
        const listDetailedView = Array.from(detailedViewBody.children);
        const statusFeed = listDetailedView.map(view => {
            const filterDetails = Array.from(view.children).filter(detail => { 
                return detail.nodeName === "TD" && detail.innerText ? true : false
            });
            return filterDetails.map(detail => detail.innerText.trim());
        })

        const saveUPSFeed = () => {
            const entries = [];
            for(let i = 0; i < statusFeed.length; i++){
                if(statusFeed[i].length === 4){
                    const entry = statusFeed[i];
                    const buildEntry = new TrackingEntry(...entry);
                    if(buildEntry.other ? buildEntry.other.includes("Proof of Delivery") ? true : false : false){

                        buildEntry.other = ""
                    }
                    console.log(buildEntry, "build")
                    entries.push(buildEntry);
                }
                if(statusFeed[i].length === 3){
                    const [date, location, scan] = statusFeed[i];
                    console.log(date, "date");
                    console.log(location, "location");
                    console.log(scan, "Scan");
                    const lastEntry = entries[entries.length-1];
                    lastEntry.date = date.trim();
                    lastEntry.location = location.trim();
                    lastEntry.scan = scan.trim();
                }
            }
            return entries;
        }
        data.feed = saveUPSFeed()
        return data;
    });
    return upsData;
}

exports.scrapeUSPSTracking = scrapeUSPSTracking;
exports.scrapeUPSTracking = scrapeUPSTracking;