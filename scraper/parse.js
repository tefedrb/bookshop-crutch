const pdf = require('pdf-parse');
const fs = require('fs');


function writeToTxtFile(data, fileName){
    pdf(data).then(res => {
        fs.writeFile(`${fileName}.txt`, res.text, (err) => {
            if(err) throw err;
            console.log("saved");
        })
    });
}

const testing = (poNumber) => {
    let dataBuffer = fs.readFileSync('ibg.customer.creditstatus.pdf');

    pdf(dataBuffer).then(function(res){
        // Find the PO - capture index number
        const testText = res.text;
        // poNumber will go here instead - lets also develop a regex for po numbers
        const poNum = /R\d{9}/;

        const regex = /R659880032/;
        const capturedMatch = testText.match(regex);
        const poIndex = capturedMatch["index"];

        // Slice this to a smaller size...
        const firstSlice = testText.slice((poIndex + 10));

        // We want to Slice again to find the next order (Allows us to search only between our order 
        // and the next, narrowing down on potential edge cases)
        const nextOrderInSequence = firstSlice.match(poNum);

        const sliced = firstSlice.slice(0, nextOrderInSequence["index"]);
        console.log(sliced, "NEW TEXT");

        // Develop regex to search for USPS tracking -
        const trackingRegex = /\d{22}/;

        // Develop regex to search for UPS tracking -
        const upsTrackingReg = /\b(1Z ?[0-9A-Z]{3} ?[0-9A-Z]{3} ?[0-9A-Z]{2} ?[0-9A-Z]{4} ?[0-9A-Z]{3} ?[0-9A-Z]|[\dT]\d\d\d ?\d\d\d\d ?\d\d\d)\b/;

        // Search sliced text to find first instance of tracking regex
        const searchSliced = sliced.match(trackingRegex);
        const trackingIndex = searchSliced["index"];

        // return a substring! from beginning to 23 places in of tracking
        console.log(sliced.substring(trackingIndex, trackingIndex + 23), "SHOULD BE tracking");
    })
    .catch(err => {
        console.log("PDF-Parse err: ", err);
    })
    
};

testing();