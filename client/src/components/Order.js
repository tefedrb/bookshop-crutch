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
            <div><span>{order.Status}</span></div>
            <div><span>{order['Product Name']}</span></div>
            <div><span><a href={order.Ean[1]}>{order.Ean[0].substring(0, 13)}</a></span></div>
            <div><span>{order.Format}</span></div>
            <div><span>{order['Pub Date']}</span></div> 
            <div><span>{order.Qty}</span></div>
            <div><span>{order.price}</span></div>
            <div><span>{order.DC}</span></div>
        </>
    )
}

export default Order;