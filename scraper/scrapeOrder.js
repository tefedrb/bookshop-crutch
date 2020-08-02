const dotenv = require('dotenv');
dotenv.config();
const connect = require('./connect-to-browser');

const goToOrder = async (wsUrl, po) => {
    const page = await connect.connectToBrowser(wsUrl)
        .then(async browser => (await browser.pages())[0]);
    const produceUrl = (po) => {
        return `https://ipage.ingramcontent.com/ipage/servlet/ibg.customer.orderstatus.OrderStatusSearchCICSServlet?pageDestination=or102&EB027__SRT__CD=1&EB027__START__ORD__DT__IN=01%2F01%2F0001&EB027__END__ORD__DT__IN=12%2F31%2F9999&EB027__OE__NBR__IN=+&EB027__PO__NBR__IN=${po}&EB027__PROD__ID__IN=+&EB027__EAN__ID__IN=+&EB027__TITLE__IN=+&EB027__WHSE__IN=+&EB027__INV__NBR__IN=+&EB027__TOC__NBR__IN=+&EB027__LE__ORD__DT=+&EB027__LE__OE__NBR=+&EB027__LE__CUST__PO=+&EB027__LE__ISBN=+&EB027__LE__TITLE=+&EB027__LE__DC=+&EB027__LE__EAN=+&ipsInd=N&fromPOSumm=N&EB027__PURCHASER__NAME__IN=+&kioskInd=N&searchAllShipToAccts=N&EB027__STATUS__CRITERIA=A&EB027__SEARCH__CRITERIA=PO&CriteriaValue=${po}&StartDate=&EndDate=&Submit.x=0&Submit.y=0`
    }
    try {
        await page.goto(produceUrl(po), { waitUntil: 'networkidle0' });
        
    } catch(err){
        console.log("Error in goToOrder " + err.message)
    }
}

// RETURNS ARRAY
const scrapeOrder = async (page) => {
    /**** COLLECT ORDER INFO ****/
    console.log("IN SCRAPE ORDER")
    return await page.evaluate(() => {
        console.log("in here")
        if(document.querySelector(".errorMessage")){
            const queryError = document.querySelector(".errorMessage").innerText.trim();
            return { error: queryError }
        } else {
            const orders = [];
            const filterOrders = (orderRows, hasBackOrders) => {
                return orderRows.filter((row, idx) => {
                    if(row.children[hasBackOrders ? 3 : 2].firstChild.text && idx != 0){
                        return true;
                    }
                });
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
            if(hasBackOrders) labels.unshift("Select");
            let allRows = Array.from(orderTable[hasBackOrders ? 4 : 3].firstElementChild.children);
        
            // Filter out rows with no EAN
            const orderRows = filterOrders(allRows, hasBackOrders);
            
            // Insert date ordered - EAN - Product Name - Format - PO Number - QTY - Invoice# (w link) - DC
            orderRows.forEach(row => {
                const saveOrder = {};
                // Target each COLUMN and save to orders -
                for(let i = 0; i < row.children.length; i++){
                    const entry = row.children[i];
                    console.log(entry, "ENTRY LOOKING FOR SELECT")
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
        }
    }).catch(err => {
        console.log("Error in scrapeOrder!: "  + err.message);
    })
}

exports.scrapeOrder = scrapeOrder;
exports.goToOrder = goToOrder;