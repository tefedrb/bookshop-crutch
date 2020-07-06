import React from 'react';

import Shipment from './Shipment';
import Backorder from './Backorder';

function Order({ order }) {
    console.log(order)
    let testShipments = [1,2,1,1,1,1,1,2]
    let testBackorders = [1,1,1,1]
    let testPreorders = [1,2,2]

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
            <div style={!testPreorders.length || ! testBackorders.length ? {gridTemplate: '1fr / 1fr'} : {}} className='not-shipped'>
                {testBackorders.length ? <Backorder title={'Backorder'} data={testBackorders} />: ''}
                {testPreorders.length ? <Backorder title={'Preorder'} data={testPreorders} />: ''}
            </div>
            {testShipments.length ? <h3 id='ship-head'>Shipment{testShipments.length > 1 ? `s (${testShipments.length})` : ''}</h3> : ''}
            <div className='shipments'>
                {testShipments.length ? testShipments.map((s,i) => <Shipment key={i} num={i+1} data={s} />) : ''}
            </div>
            
        </div>
    )
}

export default Order;