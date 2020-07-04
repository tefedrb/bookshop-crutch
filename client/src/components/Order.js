import React from 'react';

import Shipment from './Shipment';
import Backorder from './Backorder';

// This should be able to correspond to data from getOrdersByPo
function Order(order) {
    console.log(order, "ORDER DATA")
    let testShipments = [1,2,3,4,5,6]
    let testBackorders = [1,2,1,3]
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
    let backorders = (
        <div className='backorders'>
            <h3>Backorders</h3>
            <table>
                <tbody>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Published</th>
                        <th>ISBN</th>
                        <th>On Hand</th>
                        <th>On Order</th>
                        <th>Arrival Date</th>
                    </tr>
                    {testBackorders.length ? testBackorders.map((b,i) => <Backorder key={i} data={b} />) : ''}
                </tbody>
            </table>
        </div>
    )

    return (
        <div className='order'>

            <div className='general-info'>
                <h1>R135252679</h1>
                <ul>
                    <li>Name: George Jefferson</li>
                    <li>Address: 910 Riverside Dr Apt 6E NY NY 10032</li>
                    <li>Date Ordered: 2/9/20</li>
                </ul>
            </div>
            {testBackorders.length ? backorders : ''}
            <div className='shipments'>
                {testShipments.length ? testShipments.map((s,i) => <Shipment key={i} data={s} />) : ''}
            </div>
            
        </div>
    )
}

export default Order;