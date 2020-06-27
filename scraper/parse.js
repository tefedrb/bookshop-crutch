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

const getTrackingNumber = async (poInput, buffer, callBack) => {
        await pdf(buffer).then(res => {
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
    
                const uspsTracking = sliced.match(trackingFormat.usps);
    
                if(uspsTracking){
                    output = uspsTracking[0];
                    callBack(output);
                } else {
                    output = sliced.match(trackingFormat.ups)[0];
                    callBack(output);
                }
            } else {
                output = false;
                callBack(output);
            }
        })
        .catch(err => {
            console.log("PDF-Parse err: ", err);
        })
    console.log('resolved?')
    // return output;
};

// getTrackingNumber("R571378589", content => {
//     return content;
// });

exports.getTrackingNumber = getTrackingNumber;

// fs.readFile('ibg.customer.creditstatus.pdf', (err, data) => {
//     if(err) throw err;
//     pdf(data).then(res => {
//         // Find the PO - capture index number
//         console.log(data, "DATA BUFFER?")
//         const testText = res.text;

//         const capturedMatch = testText.match(poInput);
        
//         // lets also develop a regex for po numbers
//         const poRegex = /R\d{9}/;
//         if(capturedMatch){
//             const poIndex = capturedMatch["index"];

//             // Slice this to a smaller size...
//             const firstSlice = testText.slice((poIndex + 10));

//              // We want to Slice again to find the next order (Allows us to search only between our order 
//             // and the next, narrowing down on potential edge cases)
//             const secondSlice = firstSlice.match(poRegex);

//             const sliced = firstSlice.slice(0, secondSlice["index"]);

//             /** 
//                 regex formats
//             **/
//             const trackingFormat = {
//                 ups: /\b(1Z ?[0-9A-Z]{3} ?[0-9A-Z]{3} ?[0-9A-Z]{2} ?[0-9A-Z]{4} ?[0-9A-Z]{3} ?[0-9A-Z]|[\dT]\d\d\d ?\d\d\d\d ?\d\d\d)\b/,
//                 usps: /\d{22}/
//             };

//             const uspsTracking = sliced.match(trackingFormat.usps);

//             if(uspsTracking){
//                 output = uspsTracking[0];
//                 callBack(output);
//             } else {
//                 output = sliced.match(trackingFormat.ups)[0];
//                 callBack(output);
//             }
//         } else {
//             output = false;
//             callBack(output);
//         }
//     })
//     .catch(err => {
//         console.log("PDF-Parse err: ", err);
//     })
// });
// console.log(output, 'output')
// return output;