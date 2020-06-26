// Log into ingram - lets create a way to hit search by PO number
// Then save information about each books status, quantity, cost etc.
// Consider breaking these steps up into files and exporting / importing them as modules
// Consider having an open page running so you only need to loging to Ingram ONCE.
// Have to watch out for expired sessions.

// IMPORT PARSE.GETTRACKINGNUMBER(poNum) into scraper...

const dotenv = require('dotenv');
dotenv.config();
const puppeteer = require('puppeteer');
const tracking = require('./parse'); 

// const pdf = require('pdf-parse');
const crawler = require('crawler-request');
const fs = require('fs');

const ingramLogin = process.env.INGRAM_LOGIN_URL;
const ingramOrder = process.env.INGRAM_ORDER_PAGE;

// We'll use this object to hold information for now:
let holdData = {
    ingramU: process.env.INGRAM_U,
    ingramP: process.env.INGRAM_P,
    po: process.env.INGRAM_CUSTOMER_PO,
}

let orderData;

const loginToIngram = async (data, crawler) => {
    // Notes: I can pass parameters into the launch function - {headless: false} means show browser 
    const browser = await puppeteer.launch({headless: false});
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
        // Swtich to PO number field and enter PO
        await page.evaluate((data) => {
            const queryForm = document.querySelector("form[name='QueryForm']");
            const selectDropDown = queryForm.querySelector('#TCW1');
            const submitBtn = queryForm.querySelector("input[name='Submit']");
            const input = selectDropDown.nextElementSibling;

            // ENTERING PO NUMBER ACTIONS
            selectDropDown.value = "PO";
            input.value = data.po;
            submitBtn.click();
            // FROM HERE WE CAN GET INFORMATION AND ALWAYS GO BACK TO INGRAM ORDER
        }, data);

        // Need to wait for page to settle
        await page.waitForNavigation();

        /**** COLLECT ORDER INFO ****/
        await page.evaluate(() => {
            const orders = [];
            const filterOrders = (orderRows, hasBackOrders) => {
                console.log("did this")
                return orderRows.filter((row, idx) => {
                    console.log(row.children);
                    console.log(row.children[hasBackOrders ? 3 : 2].firstChild.text, "firstChild");
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
                    if(entryHasHref){
                        saveOrder[labels[i]] = [row.children[i].innerText, row.children[i].firstChild.href || entry.firstElementChild.href]
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

        console.log(orderData, "ORDERS")
    } catch(err){
        console.log("Error: ", err.message);
    }
    try{
        /****** Dealing with PDF invoice *******/ 

        // Consider creating multiple instances for different orders?
        // Consider that there may be different invoices on one order
        const pdfPage = await browser.newPage();

        console.log(orderData, "AGAIN NOW.")

        // const getAllInvoices = [];
        // orderData.reduce((acc, order) => {
        //     if(acc[order[]])
        //     acc[]
        // }, {})
        

        // Holding invoices and associated 'orders' - will begin the search for tracking numbers
        const holdInvoices = {};
        orderData.forEach((order, idx) => {
            const invoice = order["Invoice Number"];
            const invoiceLink = typeof invoice === "object" ? invoice[1] : false;
            
            if(invoiceLink){
                // ex: {'46322755': [https://ipage...]}
                if(!holdInvoices[invoice[0]]){
                    // if invoice hasn't been stored in holdInovices
                    holdInvoices[invoice[0]] = [invoice[1], idx];
                } else {
                    // add the idx numbers of each order that shares the same invoice
                    holdInvoices[invoice[0]].push(idx);
                }
            }
        })

        // The question is to download invoices or try to parse them as is - on the page
        await pdfPage.goto(orderData[0]["Invoice Number"][1]);

        // await pdfPage.addScriptTag({ path: '../node_modules/crawler-request/crawler-request.js' })
        

        /** instead of evaluating page using puppeteer, we will just use crawler-request within node
          and hopefully capture data in this namespace to do whatever with */

    }catch(err){
        console.log("Error after scraping order page: ",  err.message)
    }
    // await browser.close();
};



loginToIngram(holdData, crawler);
