import React from 'react';

function Shipment() {
    return(
        <div className='shipment'>
            <h3>Shipment 1: <a href='#'>Invoice</a></h3>
            <h4>Tracking: 3495828281891283</h4>
            <ul>
                <li>
                    <span>Books (3)</span>
                    <span>White Flight</span>
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