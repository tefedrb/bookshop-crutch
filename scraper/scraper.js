// Log into ingram - lets create a way to hit search by PO number
// Then save information about each books status, quantity, cost etc.
// Consider breaking these steps up into files and exporting / importing them as modules
// Consider having an open page running so you only need to loging to Ingram ONCE.
// Have to watch out for expired sessions.

// SOMETIMES ORDERS DON'T EXIST ON INVOICES EVEN WHEN THERE IS AN INVOICE NEXT TO THEM?!

// IMPORT PARSE.GETTRACKINGNUMBER(poNum) into scraper...

const dotenv = require('dotenv');
dotenv.config();
const puppeteer = require('puppeteer');
const tracking = require('./parse'); 

const ingramLogin = process.env.INGRAM_LOGIN_URL;
const ingramOrder = process.env.INGRAM_ORDER_PAGE;

// We'll use this object to hold information for now:
let holdData = {
    ingramU: process.env.INGRAM_U,
    ingramP: process.env.INGRAM_P,
    po: process.env.INGRAM_CUSTOMER_PO,
}

let orderData;

const loginToIngram = async (data) => {
    // Notes: I can pass parameters into the launch function - {headless: false} means show browser 
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try{
        await page.goto(ingramLogin);

        // Login to ingram
        await page.evaluate((data) => {
            const loginForm = document.querySelector('#loginIdForm');
            const formElements = Array.from(loginForm.querySelectorAll('.form-group'));
            const userInput = formElements[0].firstChild.nextSibling;
            const passwordInput = formElements[1].firstChild.nextSibling;
            const loginBtn = formElements[2].firstChild.nextSibling;
            
            //Enter login info
            userInput.value = data.ingramU;
            passwordInput.value = data.ingramP;
            loginBtn.click();
            return data;
        }, data);
        
        // Navigation work-around
        await page.goto('about:blank');
        // Go to order page
        await page.goto(ingramOrder);
        // Slight Pause
        
        // Swtich to PO number field and enter PO
        await page.evaluate((data) => {
            window.setTimeout(()=> {
                const queryForm = document.querySelector("form[name='QueryForm']");
                const selectDropDown = queryForm.querySelector('#TCW1');
                const submitBtn = queryForm.querySelector("input[name='Submit']");
                const input = selectDropDown.nextElementSibling;

                // ENTERING PO NUMBER ACTIONS
                selectDropDown.value = "PO";
                input.value = data.po;
                submitBtn.click();
            }, 500)
            // FROM HERE WE CAN GET INFORMATION AND ALWAYS GO BACK TO INGRAM ORDER
        }, data);

        // Need to wait for page to settle
        await page.waitForNavigation();

        /**** COLLECT ORDER INFO ****/
        await page.evaluate(() => {
            const orders = [];
            const filterOrders = (orderRows, hasBackOrders) => {
                return orderRows.filter((row, idx) => {
                    if(row.children[hasBackOrders ? 3 : 2].firstChild.text && idx != 0){
                        return true;
                    }
                })
            }
            /**  Check to see if column 3 (2) has an EAN. If not, it's not an order, its probably 
             shipping etc. **/

            /*** UPDATE 6/25/20 need to account for backorder/preorder column ***/
            // Manually creating labels...for orderRows.forEach loop
            const labels = [
                "Date Ordered", "Status", "Ean", "Product Name",
                "Format", "Pub Date", "Po Number", "OE Number", 
                "Qty", "price", "Invoice Number", "DC"
            ]

             const orderTableContainer = document.querySelector("form[name=backorderedForm]");
             const orderTable = orderTableContainer.firstElementChild.children;

            // If .innerBoundryBox contains 6 children elements - it has backorders (checkboxes)
             const hasBackOrders = orderTable.length === 6 ? true : false;
             let allRows = Array.from(orderTable[hasBackOrders ? 4 : 3].firstElementChild.children);
        
            if(hasBackOrders) {
                allRows = Array.from(orderTable[4].firstElementChild.children)
                labels.unshift("Select");
            }

            //  Filter out rows with no EAN
            const orderRows = filterOrders(allRows, hasBackOrders);
           
            // Insert date ordered - EAN - Product Name - Format - PO Number - QTY - Invoice# (w link) - DC
            orderRows.forEach(row => {
                const saveOrder = {};
                // Target each COLUMN and save to orders -
                for(let i = 0; i < row.children.length; i++){
                    const entry = row.children[i];
                    const entryHasHref = entry.firstChild.href || (entry.firstElementChild && entry.firstElementChild.href);
                    if(entryHasHref && labels[i]){
                        saveOrder[labels[i]] = [row.children[i].innerText.trim(), row.children[i].firstChild.href || entry.firstElementChild.href]
                    } else {
                        saveOrder[labels[i]] = row.children[i].innerText;
                    }
                }
                orders.push(saveOrder);
            })
            return orders;
        })
        .then(customerOrders => {
            orderData = customerOrders;
        })

        console.log(orderData, "orderData")
    } catch(err){
        console.log("Error after scraping order page: ",  err.message)    
    }
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
                await tracking.getTrackingNumber(order["Po Number"][0], pdfBuffer, content => {
                    // ... like maybe here push into cache
                    console.log(content, "TRACKING");
                    orderData[idx].tracking = content;
                })
            }
            return cache;
        }, []);

        console.log(orderData, "BINGO?")
    } catch(err){
        console.log("Error getting tracking number: " + err.message);
    }
    
    // await browser.close();
};

loginToIngram(holdData);