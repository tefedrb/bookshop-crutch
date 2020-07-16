const AddAllBookInfo = async (orderData, wsEndpoint) => {
    try {
        // Mutates orderData
        console.log("Get AddAllBookInfo...");
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
        console.log("Error in AddAllBookInfo: ", err.message);
    }
}

export default AddAllBookInfo;