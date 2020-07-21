import React from 'react';
import Shipment from './Shipment';
import Backorder from './Backorder';

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

   const shipmentsArr = shipments?.map((shipment, index) => 
        <Shipment 
            key={index} 
            invoiceInfo={invoiceInfo?.[index]} 
            data={shipment}
            num={index}
        />
   )

   const notOnShipment = unshipped?.length > 0 ? <Backorder unshipped={unshipped} /> : <div style={{color: "red"}}>All Items Shipped</div>;
    /* 
        const shipments = <Shipment data={orderArray} />
    */
    /* 
        const unshipped = unshipped.map((order, index) => 
            <Order key={index} data={order} />
        ) 
    */
    const nameAndAddyStr = invoiceInfo?[0][1] : null;
    const nameRegEx = /^[^\d]+/;
    
    const dateOrdered = shipments?.length > 0 ? shipments[0][0]["Date Ordered"] : unshipped ? unshipped[0]["Date Ordered"] : "Loading...";
    const name = nameAndAddyStr ? nameRegEx.exec(invoiceInfo[0][1])[0].trim() : "Loading...";
    const address = nameAndAddyStr?.substring(name.length, nameAndAddyStr.length) || "Loading...";
    const poNumber = shipments?.length > 0 ? shipments[0][0]["Po Number"][0] : "Loading...";
    const shipmentHeader = shipments?.length ? <h3 id='ship-head'>Shipment{shipments?.length > 1 ? `s (${shipments?.length})` : ''}</h3> : '';

    return (  
        <div className='order'>
            <div className='general-info'>
                <h1>{poNumber}</h1>
                <ul>
                    <li>Name: {name}</li>
                    <li>Address: {address}</li>
                    <li>Date Ordered: {dateOrdered}</li>
                </ul>
            </div>
            <div>
                {notOnShipment}
            </div>
                {shipmentHeader}
            <div className='shipments'>
                {shipmentsArr}
            </div>
        </div>
    )
}

export default OrderDisplay;