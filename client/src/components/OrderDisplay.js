import React from 'react';
import Shipment from './Shipment';
import Backorder from './Backorder';

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
    
    const nameAndAddyStr = invoiceInfo?.[0]?.[1] || null;
    const nameRegEx = /^[^\d]+/;
    
    const orderDate = shipments?.length > 0 ? shipments[0][0]["Date Ordered"] : unshipped ? unshipped[0]["Date Ordered"] : "Loading...";
    const name = nameAndAddyStr ? nameRegEx.exec(invoiceInfo[0][1])[0].trim() : "Invoice Info Pending";
    const address = nameAndAddyStr?.substring(name.length, nameAndAddyStr.length) || "Invoice Info Pending";
    const poNumber = shipments?.length > 0 ? shipments[0][0]["Po Number"][0] : unshipped[0]["Po Number"][0];
    const shipmentHeader = shipments?.length ? <h3 id='ship-head'>Shipments{` (${shipments?.length})`}</h3> : '';

    return (  
        <div className='order'>
            <div className='general-info'>
                <h1>{poNumber}</h1>
                <ul>
                    <li>Name: {name}</li>
                    <li>Address: {address}</li>
                    <li>Date Ordered: {orderDate}</li>
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