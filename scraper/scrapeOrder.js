const dotenv = require('dotenv');
dotenv.config();

// RETURNS ARRAY
const scrapeOrder = async (page) => {
    /**** COLLECT ORDER INFO ****/
    return await page.evaluate(() => {
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
    }).catch(err => {
        console.log("Error in scrapeOrder!: "  + err.message);
    })
}

exports.scrapeOrder = scrapeOrder;