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
        <Shipment key={index} data={shipment} />
   )
    /* 
        const shipments = <Shipment data={orderArray} />
    */
    /* 
        const unshipped = unshipped.map((order, index) => 
            <Order key={index} data={order} />
        ) 
    */
    const getName = /^[^\d]+/;
    const poNumber = shipments ? shipments[0][0]["Po Number"][0] : "Loading...";
    
    return (  
        <div className='order'>
            <div className='general-info'>
                <h1>{poNumber}</h1>
                <ul>
                    <li>Name: {invoiceInfo ? invoiceInfo[0][1] : "Loading..."}</li>
                    <li>Address: 910 Riverside Dr Apt 6E NY NY 10032</li>
                    <li>Date Ordered: 2/9/20</li>
                </ul>
            </div>
            {shipments?.length ? <h3 id='ship-head'>Shipment{shipments?.length > 1 ? `s (${shipments?.length})` : ''}</h3> : ''}
            <div className='shipments'>
                {shipmentsArr}
            </div>
        </div>
    )
}

export default OrderDisplay;