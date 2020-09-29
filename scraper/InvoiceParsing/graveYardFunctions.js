/// NOT USING THESE METHODS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// RETURNS ARRAY - ORDER INDEX AND TRACKING -- NOT USING THIS METHOD...
// const getAllTracking = async (orderData, page, getAddress) => {
//     const trackingNumbers = [];
//     // Only check for address once
//     let address = getAddress;
//     console.log(orderData, "ORDER DATA IN get all tracking")
//     for(let i=0 ,j=0; i < orderData.length; i++){
//         // Ensures we only find address once
//         const order = orderData[i];
//         const invoice = order["Invoice Number"];
//         const invoiceLink = typeof invoice === "object" ? invoice[1] : false;
//         if(invoiceLink){
//             // j variable tracks how many times we look for address
//             if(j === 1) address = !getAddress;
//             j++;
//             const pdfString = await readPdf(order, page);
//             const pdfBuffer = Buffer.from(pdfString, 'binary');
//             // Push here or push in getTrackingNum...
//             const tracking =  await getTracking(order["Po Number"][0], pdfBuffer, address);

//             console.log(address, "after await getTracking");
//             console.log(tracking, "Tracking for order " + i);
//             trackingNumbers.push([i, ...tracking]);
//         }
//     }
//     return trackingNumbers;
// }
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX