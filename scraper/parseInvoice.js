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

const writeFileFromString = (yourString, fileName) => {
    fs.writeFile(`${fileName}.txt`, yourString, (err) => {
        if(err) throw err;
        console.log("saved");
    })
}

function writeToTxtFromPdf(path, newFileName){
    const dataBuffer = fs.readFileSync(path);
    pdf(dataBuffer).then(data => {
        fs.writeFile(`${fileName}.txt`, data.text, (err) => {
            if(err) throw err;
            console.log("saved");
        });
    });
}

const getAddress = async (poInput, buffer) => {
    return await pdf(buffer).then(res => {
        // Find the PO - capture index number
        const testText = res.text;
        const capturedMatch = testText.match(poInput);
        // Develop regex for address
        // const
    })
}

// RETURNS ARRAY
const getTracking = async (poInput, buffer, getAddress) => {
    return await pdf(buffer).then(res => {
        // Find the PO - capture index number
        const testText = res.text;
        const capturedMatch = testText.match(poInput);
        
        // lets also develop a regex for po numbers
        const poRegex = /R\d{9}/;

        // Regex for ship date (meter date)
        const meterDateReg = /\d{2}\/\d{2}\/\d{4}/;
        const meterDate = res.text.match(meterDateReg)[0];

        if(capturedMatch){
            const poIndex = capturedMatch["index"];
            // Maybe cut from FOR DELIVERY TO instead from P.O. INDEX
            // addressRegex was the best I could do.
            // const addressRegex = /(FOR DELIVERY TO:)[\w\W]*(?=ITEMS BELOW FROM P\.O\.)/;

            // From poIndex, iterate backwards till you hit : - check logic gate. 
            // THIS NEEDS TO BE REPLACED WITH REGEX
            let addressIndex;
            let address = null;
            if(getAddress){
                let counter = poIndex;
                while(counter !== 0){        
                    let colon = testText[counter] === ":" ? true : false;
                    if(colon){
                        // Check series
                        if(
                            testText[counter-1] === "O" && 
                            testText[counter-2] === "T" &&
                            testText[counter-4] === "Y" &&
                            testText[counter-5] === "R" &&
                            testText[counter-6] === "E" &&
                            testText[counter-7] === "V" &&
                            testText[counter-13] === "R"
                        ){
                            // Gets the index right after :
                            addressIndex = counter + 1;
                            counter = 0;
                        }
                    } else {
                        counter--;
                    }
                }
                // Cut string down to get address
                address = testText.slice(addressIndex, poIndex - 22)
                            .replace(/\s+/g,' ')
                            .trim();
            }

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
            }
            // Return usps or ups tracking
            const uspsTracking = sliced.match(trackingFormat.usps);
            let tracking = uspsTracking ? uspsTracking[0] : sliced.match(trackingFormat.ups)[0];
            return [tracking || "No Tracking Found", address, meterDate];
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
    
    // Here we are able to read the invoices just by using their links
async function readPdf(order, page) {
    return page.evaluate((order) => {
        /**** TEST DATA ****/
        const url = order["Invoice Number"][1];
        console.log(url, "URL?")
        return new Promise(async resolve => {
            const reader = new FileReader();
            const res = await fetch(url);
            const data = await res.blob();
            reader.readAsBinaryString(data);
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject("Err: binary string reading failed");
        });
    }, order);
}

// RETURNS ARRAY - ORDER INDEX AND TRACKING
const getAllTracking = async (orderData, page, getAddress) => {
    const trackingNumbers = [];
    // Only check for address once
    let address = getAddress;
    console.log(orderData, "ORDER DATA IN get all tracking")
    for(let i=0 ,j=0; i < orderData.length; i++){
        // Ensures we only find address once
        const order = orderData[i];
        const invoice = order["Invoice Number"];
        const invoiceLink = typeof invoice === "object" ? invoice[1] : false;
        if(invoiceLink){
            // j variable tracks how many times we look for address
            if(j === 1) address = !getAddress;
            j++
            const pdfString = await readPdf(order, page);
            const pdfBuffer = Buffer.from(pdfString, 'binary');
            // Push here or push in getTrackingNum...
           const tracking =  await getTracking(order["Po Number"][0], pdfBuffer, address);

           console.log(address, "after await getTracking");
           console.log(tracking, "Tracking for order " + i);
           trackingNumbers.push([i, ...tracking]);
        }
    }
    return trackingNumbers;
}

// See if I can customize this to get address
const getTrackingByOrder = async (page, order, getAddress) => {
    const invoice = order["Invoice Number"];
    const invoiceLink = typeof invoice === "object" ? invoice[1] : false;
    if(invoiceLink){
        const pdfString = await readPdf(order, page);
        const pdfBuffer = Buffer.from(pdfString, 'binary');
        const trackingOutput = await getTracking(order["Po Number"][0], pdfBuffer, getAddress);
        return trackingOutput;
    }
}

// returns [[tracking, address, shipment_idx], [tracking, address, shipment_idx] ...]
const getAllShipmentInvoiceInfo = async (page, orderData, getAddress) => {
    const trackingAndShipmentIdx = [];
    let address = getAddress;
    for(let i = 0; i < orderData.shipments.length; i++){
        const shipment = orderData.shipments[i];
        console.log(shipment, "SHIPMENT!!!!!!!!!!!!!")
        const trackingOutput = await getTrackingByOrder(page, shipment[0], address);
        /* 
           Here I am adding the idx of the shipment within orderData.shipments to our
           output 
        */
        trackingOutput.push(i);
        trackingAndShipmentIdx.push(trackingOutput);
        // setting address to false in order to only parse it once
        address = false;
    }
    return trackingAndShipmentIdx;
}

exports.getAllTracking = getAllTracking;
exports.getTracking = getTracking;
exports.getTrackingByOrder = getTrackingByOrder;
exports.writeToTxtFromPdf = writeToTxtFromPdf;
exports.getAllShipmentInvoiceInfo = getAllShipmentInvoiceInfo;