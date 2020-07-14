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
    const { shipments, unshipped } = props.order;
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

    // HEADER
//    <div className='order'>

//    <div className='general-info'>
//        <h1>R135252679</h1>
//        <ul>
//            <li>Name: George Jefferson</li>
//            <li>Address: 910 Riverside Dr Apt 6E NY NY 10032</li>
//            <li>Date Ordered: 2/9/20</li>
//        </ul>
//    </div>
//    {testBackorders.length ? backorders : ''}
//    <div className='shipments'>
//        {testShipments.length ? testShipments.map((s,i) => <Shipment key={i} data={s} />) : ''}
//    </div>
   
//  </div>
    return (
        <div>
            <section id="shipments">
                {shipmentsArr}
            </section>
            <section id="not-shipped">

            </section>
        </div>
    )
}

export default OrderDisplay;