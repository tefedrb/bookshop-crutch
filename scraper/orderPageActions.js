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

const navigateToBookInfo = async (page, link) => {
    const bookInfo = {};
    await page.goto(link, {waitUntil: 'networkidle0'});

    await page.evaluate(bookInfo => {
        const productDetails = Array.from(document.querySelectorAll(".productDetailElements"));
        bookInfo.author = document.querySelector(".doContributorSearch span").innerText;
        bookInfo.pubDate = productDetails.filter( detail => {
            return detail.innerText.includes("Pub Date") && !detail.innerText.includes("Copyright Date");
        })[0].innerText.substring(10);
        const getStockTable = document.querySelector(".newStockCheckTable");
        const stockTableCells = Array.from(getStockTable.querySelectorAll("tr"));
        bookInfo.onOrder = stockTableCells[1].innerText;
        return bookInfo;
    }, bookInfo);
}

exports.searchPo = searchPo;
exports.navigateToOrderSearch = navigateToOrderSearch;
exports.navigateToBookInfo = navigateToBookInfo;
