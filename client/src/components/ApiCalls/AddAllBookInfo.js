const AddAllBookInfo = async (orderData, wsEndpoint) => {
    try {
        // Mutates orderData
        console.log("Get AllInvoiceInfo...");
        const newOrderData = 
            await fetch('http://localhost:9000/browser/get-all-book-info', {
                method: 'post',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    wsUrl: wsEndpoint,
                    orderData: orderData,
                })
            })
        return newOrderData.json();
    } catch (err){
        console.log("Error in GetAllInvoiceInfo: ", err.message);
    }
}

export default AddAllBookInfo;