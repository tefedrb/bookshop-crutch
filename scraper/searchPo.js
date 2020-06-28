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
            input.value = poNum[0];
            submitBtn.click();
        }, 500)
        // FROM HERE WE CAN GET INFORMATION AND ALWAYS GO BACK TO INGRAM ORDER
    }, poNum);
    await orderPage.waitForNavigation();
    return orderPage;
}

exports.searchPo = searchPo;