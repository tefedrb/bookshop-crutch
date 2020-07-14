import React, { useState, useEffect } from 'react';

import Modal from './Modal';

function Shipment(props) {
    let [copyTracking, setCopyTracking] = useState(false)
    let [trackingColor, setTrackingColor] = useState(null)
    let [moreInfo, setMoreInfo] = useState(false)

    const clipboard = () => {
        let id = `shipment-${props.num}`
        let spanEl = document.getElementById(id)
        let inputEl = document.getElementById('input')
        let inputElOrigVal = inputEl.value
        inputEl.value = spanEl.innerText
        inputEl.select()
        document.execCommand('Copy')
        inputEl.value = inputElOrigVal
        setCopyTracking(true)
        setTrackingColor(setTimeout(() => setCopyTracking(false), 5000))
    }

    const toggleInfo = () => setMoreInfo(!moreInfo)

    useEffect(() => {
        return () => clearTimeout(trackingColor)
    })

    return(
        <div className='shipment'>
            <h3>Shipment {props.num}: <a href='#'>Invoice</a></h3>
            <h4>Tracking: 
                <span 
                    className='tracking'
                    style={copyTracking ? {color: 'lime', fontWeight: 'bolder'} : {}} 
                    id={`shipment-${props.num}`} 
                    onClick={clipboard}>
                        3495828281891283
                </span>
            </h4>
            <ul>
                <li>
                    <span>Books (3)</span>
                    <span className='more-info' onClick={toggleInfo}>White Flight</span>
                    <span className='more-info' onClick={toggleInfo}>Invisible Man</span>
                    <span className='more-info' onClick={toggleInfo}>King Kong</span>    
                </li>
                <li>
                    <span>Status</span>
                    <span>Estimated Delivery 12/20 Accepted at facility</span>
                </li>
            </ul>
            {moreInfo ? <Modal data={props.num} toggleInfo={toggleInfo} /> : ''}
        </div>
    )
}

/* import React from 'react';
import Book from './Book';
import Order from './Order' */

//[{}, {}]
// function Shipment(props) {
//     const { data } = props;
//     console.log(data, "data")
    
//     const individualOrders = data?.map((order, index) => 
//         <Order key={index} order={order} />
//     )
    
//     return (
//         <div className="individual-shipment">
//             <h2>Invoice #:
//                 <a className="invoice-link" href={data?.[0]["Invoice Number"][1]}>
//                     {data?.[0]["Invoice Number"][0]}
//                 </a>
//             </h2>
//             <h3>
//                 Tracking #: <span>{data?.[0].tracking || <button>Get Tracking</button>}</span>
//             </h3>
//             <div className="shipment-column-labels">
//                 <div>Status</div>
//                 <div>Title</div>
//                 <div>Ean</div>
//                 <div>Format</div>
//                 <div>Pub Date</div>
//                 <div>Qty</div>
//                 <div>Price</div>
//                 <div>DC</div>
//             </div>
//             <div className="individual-orders-container">
//                 {individualOrders}
//             </div>
//         </div>
//     )
// }

export default Shipment;