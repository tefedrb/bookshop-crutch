const GetAllInvoiceInfo = async (orderData, wsEndpoint) => {
    try {
        console.log("Get AllInvoiceInfo...");
        const invoiceInfo = 
            await fetch('http://localhost:9000/browser/get-all-invoice-info', {
                method: 'post',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    wsUrl: wsEndpoint,
                    orderData: orderData
                })
            })
        return invoiceInfo.json();
    } catch (err){
        console.log("Error in GetAllInvoiceInfo: ", err.message);
    }
}

export default GetAllInvoiceInfo;