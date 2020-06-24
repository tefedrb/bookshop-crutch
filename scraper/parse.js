const pdf = require('pdf-parse');
const fs = require('fs');

const testing = () => {
        let dataBuffer = fs.readFileSync('ibg.customer.creditstatus.pdf');
    
        pdf(dataBuffer).then(function(res){
            console.log(res.numpages);
        // Find the PO - capture index number
            const testText = res.text;
            const regex = /R659880032/;
            const capturedMatch = testText.match(regex);
            const poIndex = capturedMatch["index"];
            console.log(typeof poIndex, "captured")
        /* Use indexOf() w/ captured index, to search for the first instance of tracking number -
            use regex expression to find tracking number (isolate certain # of digits)
            be sure to also account for ups tracking number */
            const sliced = testText.slice(poIndex);

            // Develop regex to search for tracking -
            const trackingRegex = /\d{22}/;
            // Search sliced text to find first instance of tracking regex
            const searchSliced = sliced.match(trackingRegex);
            const trackingIndex = searchSliced["index"];

            // return a substring! from beginning to 23 places in of tracking
            console.log(sliced.substring(trackingIndex, trackingIndex + 23), "SHOULD BE tracking");
            // Find address using this technique
  
            // const testString = "we knowe aksdfkal;ajdf R659880032 9205590100039407334518 what else?"

            // .text - Checks to see if the string exists within a string - returns boolean
            // const stringExists = regex.test(testText);

            // .match - Pulls out the matched text within a string 
            // within an array, with an index num [1]
            // and a copy of the entire string [2]
            // const matchedText = testText.match(regex);

            // g - a flag that means matched all instances of pattern (i flag = ignore case)
            // const regex1 = /TRACKING/g;
            // const allInstances = testText.match(regex1);

        })
        .catch(err => {
            console.log("PDF-Parse err: ", err);
        })
    
};

testing();