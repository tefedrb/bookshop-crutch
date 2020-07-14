const parseOutShipments = (orderData) => {
    // An array with objects - each object is a book
    // Need to see if they have an invoice number, use cache to record it
    const cache = {};
    const output = {
        "shipments": [],
        "unshipped": []
    };
    // Create an object with shipments - an array - and unshipped
    orderData.forEach(order => {
        const invoice = order['Invoice Number'];
        const invoiceNumber = invoice[0];
        if(invoice){
            if(!cache[invoiceNumber]){
                cache[invoiceNumber] = [];
            }
            cache[invoiceNumber].push(order);
        } else {
            output.unshipped.push(order);
        }
    });
    for(let shipment in cache){
        output.shipments.push(cache[shipment]);
    }
    return output;
}

// This mutates objects
const addTrackingAndAddress = async (trackingAndAddresses, orderData) => {
    // Add tracking to orderData (mutating orderData)
    const address = trackingAndAddresses[0][2];
    trackingAndAddresses.forEach(num => {
        const orderByIndex = orderData[num[0]];
        orderByIndex.tracking = num[1];
        orderByIndex.address = address;
    });
    console.log(orderData, "orderData");
    return orderData;
}

exports.addTrackingAndAddress = addTrackingAndAddress;
exports.parseOutShipments = parseOutShipments;