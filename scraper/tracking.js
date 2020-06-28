/****** Dealing with PDF invoice *******/ 

    // Consider creating multiple instances for different orders?
    // Consider that there may be different invoices on one order
    
    // Here we are able to read the invoices just using their links
    async function readPdf(order) {
        return page.evaluate((order) => {
            /**** TEST DATA ****/
            const url = order["Invoice Number"][1];
            return new Promise(async resolve => {
                const reader = new FileReader();
                const res = await fetch(url);
                const data = await res.blob();
                reader.readAsBinaryString(data);
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject("Err: binary string reading failed");
            })
        }, order)
    }

try {
    /**  iterate over orderData, singling out orders that have invoices and
    providing them tracking numbers **/
   await orderData.reduce(async (cache, order, idx) => {
        const invoice = order["Invoice Number"];
        const invoiceLink = typeof invoice === "object" ? invoice[1] : false;
        if(invoiceLink){
            const pdfString = await readPdf(order);
            const pdfBuffer = Buffer.from(pdfString, 'binary');
            // Push here or push in getTrackingNum...
            await tracking.getTrackingNumber(order["Po Number"][0], pdfBuffer, tracking => {
                // ... like maybe here push into cache
                cache.push(
                console.log(content, "TRACKING");
                orderData[idx].tracking = tracking;
            })
        }
        return cache;
    }, []);

    console.log(orderData, "BINGO?");
} catch(err){
    console.log("Error getting tracking number: " + err.message);
}