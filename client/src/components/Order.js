import React from 'react';

import Shipment from './Shipment';
import Backorder from './Backorder';

// This should be able to correspond to data from getOrdersByPo
function Order(props) {
    const { order } = props;
    // order.length
    /* 
        const shipments = orders.shipments.map((shipment, index) => 
            <Shipment key={index} data={shipment} />
        ) 
    */
    /* 
        const unshipped = orders.unshipped.map((order, index) => 
            <Order key={index} data={order} />
        ) 
    */
    return (
        <>
            <div>{order.Status}</div>
            <div>{order['Product Name']}</div>
            <div><a href={order.Ean[1]}>{order.Ean[0]}</a></div>
            <div>{order.Format}</div>
            <div>{order['Pub Date']}</div> 
            <div>{order.Qty}</div>
            <div>{order.price}</div>
            <div>{order.DC}</div>
        </>
    )
}

export default Order;