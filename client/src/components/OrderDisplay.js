import React from 'react';
import Shipment from './Shipment';

/*
    const orderArray = (orders) => {
        return orders.map((order, index) => (
            <Order key={index} data={order} />
        )
    }
*/

// shipments: [[{},{}], [{},{}]]
const OrderDisplay = (props) => {
    const { shipments, unshipped, invoiceInfo } = props.order;
    // Function that iterates and sets orders up
    
    /*
        { shipments: [{},{}], unshipped: [{}] }
    */
   console.log(shipments, "shipments")
   const shipmentsArr = shipments?.map((shipment, index) => 
        <Shipment key={index} invoiceInfo={invoiceInfo?.[index]} data={shipment} />
   )
    /* 
        const shipments = <Shipment data={orderArray} />
    */
    /* 
        const unshipped = unshipped.map((order, index) => 
            <Order key={index} data={order} />
        ) 
    */
    console.log(invoiceInfo, "INVOICE INFO");
    const nameAndAddyStr = invoiceInfo ? invoiceInfo[0][1] : null;
    const nameRegEx = /^[^\d]+/;
    
    const name = nameAndAddyStr ? nameRegEx.exec(invoiceInfo[0][1])[0].trim() : "Loading...";
    const address = nameAndAddyStr ? nameAndAddyStr.substring(name.length, nameAndAddyStr.length) : "Loading";
    const poNumber = shipments ? shipments[0][0]["Po Number"][0] : "Loading...";
    const shipmentHeader = shipments?.length ? <h3 id='ship-head'>Shipment{shipments?.length > 1 ? `s (${shipments?.length})` : ''}</h3> : '';
    
    return (  
        <div className='order'>
            <div className='general-info'>
                <h1>{poNumber}</h1>
                <ul>
                    <li>Name: {name}</li>
                    <li>Address: {address}</li>
                    <li>Date Ordered: </li>
                </ul>
            </div>
            {shipmentHeader}
            <div className='shipments'>
                {shipmentsArr}
            </div>
        </div>
    )
}

export default OrderDisplay;