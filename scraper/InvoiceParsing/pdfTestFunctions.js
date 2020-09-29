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

exports.writeToTxtFromPdf = writeToTxtFromPdf;
