// Log into ingram - lets create a way to hit search by PO number
// Then save information about each books status, quantity, cost etc.

const dotenv = require('dotenv');
dotenv.config();
const puppeteer = require('puppeteer');
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

        await page.evaluate(() => {
            const orders = [];
            const filterOrders = (orderRows) => {
                return orderRows.filter((row, idx) => {
                    if(row.children[2].firstChild.text && idx != 0){
                        return true;
                    }
                })
            }
            /**  Check to see if column 3 (2) has an EAN. If not, it's not an order, its probably 
             shipping etc. **/
             const orderTableContainer = document.querySelector("form[name=backorderedForm]");
             const orderTable = orderTableContainer.firstElementChild.children[3];
             const allRows = Array.from(orderTable.firstElementChild.children);

            //  Filter out rows with no EAN
            const orderRows = filterOrders(allRows);
           
            // Insert date ordered - EAN - Product Name - Format - PO Number - QTY - Invoice# (w link) - DC
            orderRows.forEach(row => {
                const saveOrder = {};
                // Manually creating labels... should change this by grabbing the top row
                const labels = [
                    "date ordered", "status", "ean", "product name",
                    "format", "pub date", "po number", "oe number", 
                    "qty", "price", "invoice number", "DC"
                ]
                // Target each column and save to orders
                for(let i = 0; i<row.children.length; i++){
                    saveOrder[labels[i]] = row.children[i].innerText;
                }
                orders.push(saveOrder);
            })
            return orders;
        })
        .then(newOrders => {
            orderData = newOrders;
        })

        console.log(orderData, "ORDERS")
    } catch(err){
        console.log("Error: ", err.message);
    }
    // await browser.close();
};



loginToIngram(holdData);
