const pdf = require('pdf-parse');
const fs = require('fs');

// Try: instead of parsing the pdf as a string, turn into .JSON and grab properties
// Spinning wheel indicating how may pages are being parsed...

function writeToTxtFile(data, fileName){
    pdf(data).then(res => {
        fs.writeFile(`${fileName}.txt`, res.text, (err) => {
            if(err) throw err;
            console.log("saved");
        })
    });
}

const getTracking = async (poInput, buffer) => {
    return await pdf(buffer).then(res => {
        // Find the PO - capture index number
        const testText = res.text;
        const capturedMatch = testText.match(poInput);
        
        // lets also develop a regex for po numbers
        const poRegex = /R\d{9}/;
        if(capturedMatch){
            const poIndex = capturedMatch["index"];

            // Slice this to a smaller size...
            const firstSlice = testText.slice((poIndex + 10));

             // We want to Slice again to find the next order (Allows us to search only between our order 
            // and the next, narrowing down on potential edge cases)
            const secondSlice = firstSlice.match(poRegex);

            const sliced = firstSlice.slice(0, secondSlice["index"]);

            /** 
                regex formats
            **/
            const trackingFormat = {
                ups: /\b(1Z ?[0-9A-Z]{3} ?[0-9A-Z]{3} ?[0-9A-Z]{2} ?[0-9A-Z]{4} ?[0-9A-Z]{3} ?[0-9A-Z]|[\dT]\d\d\d ?\d\d\d\d ?\d\d\d)\b/,
                usps: /\d{22}/
            };

            // Return usps or ups tracking
            return sliced.match(trackingFormat.usps)[0] || sliced.match(trackingFormat.ups)[0];
        } else {
            return false;
        }
    })
    .catch(err => {
        console.log("PDF-Parse err: ", err);
    })
};

/****** Dealing with PDF invoice *******/ 

    // Consider creating multiple instances for different orders?
    // Consider that there may be different invoices on one order
    
    // Here we are able to read the invoices just using their links
async function readPdf(order, page) {
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

const getAllTracking = async (orderData, page) => {
    const trackingNumbers = [];
    for(let i = 0; i < orderData.length; i++){
        const order = orderData[i];
        const invoice = order["Invoice Number"];
        const invoiceLink = typeof invoice === "object" ? invoice[1] : false;
        if(invoiceLink){
            const pdfString = await readPdf(order, page);
            const pdfBuffer = Buffer.from(pdfString, 'binary');
            // Push here or push in getTrackingNum...
           const tracking =  await getTracking(order["Po Number"][0], pdfBuffer);
           console.log(tracking, "Tracking for order " + i);
           trackingNumbers.push([tracking, i]);
        }
    }
    return trackingNumbers;
}

const getTrackingByOrder = async (order) => {
    const invoice = order["Invoice Number"];
    const invoiceLink = typeof invoice === "object" ? invoice[1] : false;
    if(invoiceLink){
        const pdfString = await readPdf(order);
        const pdfBuffer = Buffer.from(pdfString, 'binary');
        const trackingOutput = await getTracking(order["Po Number"][0], pdfBuffer);
        return trackingOutput;
    }
}

exports.getAllTracking = getAllTracking;
exports.getTracking = getTracking;
exports.getTrackingByOrder = getTrackingByOrder;



