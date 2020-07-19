import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Book from './Book';

function Shipment(props) {
    const [copyTracking, setCopyTracking] = useState(false)
    const [trackingColor, setTrackingColor] = useState(null)
    const [moreInfo, setMoreInfo] = useState(false)
    const [modalInfo, setModalInfo] = useState(null);
    // [{},{}]
    // EACH ORDER DESTRUCTURED BELOW
    // const { 
    //     DC, 'Date Ordered': dateOrdered, 
    //     Ean: ean, 
    //     Format: format, 
    //     'Invoice Number': invoiceNumber,
    //     'OE Number': oeNumber,
    //     'Po Number': poNumber,
    //     'Product Name': productName,
    //     'Pub Date': pubDate,
    //     Qty: qty,
    //     Select: select,
    //     Status: status,
    //     price
    // } = props.data
    // Iterate over books -> 
    const toggleInfo = () => setMoreInfo(!moreInfo)

    const books = props.data?.map((book, idx) => 
        <Book key={idx} toggleInfo={toggleInfo} setModalInfo={setModalInfo} bookData={book}></Book>
    );

    // const [ tracking ] = props.invoiceInfo;

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

    useEffect(() => {
        return () => clearTimeout(trackingColor)
    })

    return (
        <div className='shipment'>
            <h3>Shipment {props.num}: <a href='#'>Invoice</a></h3>
            <h4>Tracking: 
                <span 
                    className='tracking'
                    style={copyTracking ? {color: 'lime', fontWeight: 'bolder'} : {}} 
                    id={`shipment-${props.num}`} 
                    onClick={clipboard}
                >
                    {" " + props.invoiceInfo ? props.invoiceInfo[0] : "Loading..."}
                </span>
            </h4>
            <h5>Ship Date:
                <span>
                    {" " + props.invoiceInfo ? props.invoiceInfo[2] : "Loading..."}
                </span>
            </h5>
            <ul>
                <li>
                    <span>Books</span>
                    {books}    
                </li>
                <li>
                    <span>Status</span>
                    <span>Estimated Delivery 12/20 Accepted at facility</span>
                </li>
            </ul>
            {moreInfo ? <Modal data={modalInfo} toggleInfo={toggleInfo} /> : ''}
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