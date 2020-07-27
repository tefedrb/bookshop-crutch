const ingramOrder = process.env.INGRAM_ORDER_PAGE;

const navigateToOrderSearch = async (page) => {
    await page.goto('about:blank');
    // Go to order page
    await page.goto(ingramOrder);
    // Switch over to....
    await searchPo(page, userData.po);
}

// Swtich to PO number field and enter PO
const searchPo = async (orderPage, po) => {
    const poNum = [po];
    await orderPage.evaluate(poNum => {
        window.setTimeout(async () => {
            const queryForm = document.querySelector("form[name='QueryForm']");
            const selectDropDown = queryForm.querySelector('#TCW1');
            const submitBtn = queryForm.querySelector("input[name='Submit']");
            const input = selectDropDown.nextElementSibling;

            // ENTERING PO NUMBER ACTIONS
            selectDropDown.value = "PO";
            console.log(poNum[0], "PO NUM");
            input.value = poNum[0];
            debugger;
            submitBtn.click();
        }, 500)
        // FROM HERE WE CAN GET INFORMATION AND ALWAYS GO BACK TO INGRAM ORDER
    }, poNum);

    await orderPage.waitForNavigation();
    return orderPage;
}

const navigateToAndScrapeBookInfo = async (page, link) => {
    const bookInfo = {};
    await page.goto(link, {waitUntil: 'networkidle0'});
    console.log("WITHIN NAVIGATE TO BOOK INFO");
    const data = await page.evaluate(bookInfo => {
        const productDetails = Array.from(document.querySelectorAll(".productDetailElements"));
        bookInfo.author = document.querySelector(".doContributorSearch span").innerText;
        
        const parsePubDate = productDetails.filter( detail => {
            const text = detail.innerText;
            return text.includes("Pub Date") && !text.includes("Copyright Date") || text.includes("Release Date");
        })
        const afterColonReg = /(?<=(: )).*$/g;
        bookInfo.pubDate = parsePubDate[0].innerText.match(afterColonReg)[0];


        const getStockTable = document.querySelector(".newStockCheckTable");
        const stockTableCells = Array.from(getStockTable.querySelectorAll("tr"));
        const getStockNumbers = (innerTextStr) => {
            const firstNumber = /([^\s]+)/;
            const onHand = parseInt(innerTextStr.match(firstNumber)[0].replace(/,/g,''));
            const onOrder = parseInt(innerTextStr.substring(innerTextStr.match(firstNumber).length).replace(/,/g,''));
            return [onHand, onOrder];
        }
        const primaryDCStr = stockTableCells[1].innerText.substring(2).trim();
        const primaryDC = getStockNumbers(primaryDCStr);
        const secondaryDCStr = stockTableCells[2].innerText.substring(2).trim();
        const secondaryDC = getStockNumbers(secondaryDCStr);
        
        // Check if item has an arrival date - 
        
        bookInfo.onHand = (primaryDC[0] + secondaryDC[0]);
        bookInfo.onOrder = (primaryDC[1] + secondaryDC[1]);
        return bookInfo;
    }, bookInfo);
    console.log(data, "Data IN BOOKINFO");
    return data;
}

exports.searchPo = searchPo;
exports.navigateToOrderSearch = navigateToOrderSearch;
exports.navigateToAndScrapeBookInfo = navigateToAndScrapeBookInfo;
