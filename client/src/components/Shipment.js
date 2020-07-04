import React from 'react';
import Book from './Book';

function Shipment(order) {
    return(
        <div className='shipment'>
            <h3>Shipment 1: <a href={order?.['Invoice Number'][0]}>Invoice</a></h3>
            <h4>Tracking: {order.tracking ? order.tracking : "Get Tracking Btn"}</h4>
            <ul>
                <li>
                    <span>Books (3)</span>
                    <p>
                        <span>White Flight</span>
                        <span>Ean: <a href={order.Ean[1]}>{order.Ean[0]}</a></span>
                    </p>
                    
                    <span>Invisible Man</span>
                    <span>King Kong</span>    
                </li>
                <li>
                    <span>Status</span>
                    <span>Estimated Delivery 12/20 Accepted at facility</span>
                </li>
            </ul>
        </div>
    )
}

export default Shipment;