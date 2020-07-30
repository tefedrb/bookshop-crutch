import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import TrackingModal from './TrackingModal';
import Book from './Book';

function Shipment(props) {
    const [copyTracking, setCopyTracking] = useState(false)
    const [trackingColor, setTrackingColor] = useState(null)
    const [moreBookInfo, setMoreBookInfo] = useState(false)
    const [modalBookInfo, setModalBookInfo] = useState(null);

    const [modalTracking, setModalTracking] = useState(null);
    const [moreTrackingInfo, setMoreTrackingInfo] = useState(false);
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
    const toggleInfo = () => setMoreBookInfo(!moreBookInfo);
    const toggleTrackingInfo = () => setMoreTrackingInfo(!moreTrackingInfo);

    const books = props.data?.map((book, idx) => 
        <Book key={idx} toggleInfo={toggleInfo} setModalInfo={setModalBookInfo} bookData={book}></Book>
    );

    const formatDeliveryInfo = () => {
        if(props.invoiceInfo?.[4]?.deliveryStatus){
            const deliveryStatusInfo = props.invoiceInfo?.[4].deliveryStatusInfo;
            const styled = { color: "teal" };
            return deliveryStatusInfo.length > 0 ? deliveryStatusInfo.map((line, idx) => {
                return <span style={idx === 1 ? styled : { fontWeight: "bold" }} key={idx}>{line}</span> 
            }) : <span style={styled}>{props.invoiceInfo[4].deliveryStatus}</span>
        } else {
            return false;
        }
    }

    const formatUPSInfo = () => {
        const deliveryStatusInfo = props?.invoiceInfo?.[4]?.feed?.[0];
        if(props?.invoiceInfo?.[0]?.substring(0, 2) === "1Z" && deliveryStatusInfo){
            return (
                <>
                    <span style={{ fontWeight: "bold" }}>{deliveryStatusInfo?.date}</span>
                    <span style={{ color: "teal" }}>{deliveryStatusInfo?.status}</span>
                    <span>{deliveryStatusInfo?.location}</span>
                </>
            )
        } else {
            return false;
        }
    }
    // const [ tracking ] = props.invoiceInfo;

    // const clipboard = () => {
    //     let id = `shipment-${props.num}`;
    //     let spanEl = document.getElementById(id);
    //     let inputEl = document.getElementById('input');
    //     let inputElOrigVal = inputEl.value;
    //     inputEl.value = spanEl.innerText;
    //     inputEl.select();
    //     document.execCommand('Copy');
    //     inputEl.value = inputElOrigVal;
    //     setCopyTracking(true);
    //     setTrackingColor(setTimeout(() => setCopyTracking(false), 5000));
    // }

    useEffect(() => {
        return () => clearTimeout(trackingColor)
    })

    const copyToClipboard = (event) => {
        const tracking = event.target.parentNode.children[1].innerText;
        navigator.clipboard.writeText(tracking);
    }
    
    const trackingNum = props?.invoiceInfo?.[0] ? (
        <div className="trackingNum">
            <h4>Tracking:</h4>
            <span>{props.invoiceInfo[0]}</span>
            <img onClick={copyToClipboard} src="https://img.icons8.com/windows/32/000000/clipboard--v1.png"/>
        </div>
    ) : "Loading... "

    return (
        <div className='shipment'>
            <h3>Shipment {props.num + 1}: <a href='#'>Invoice</a></h3>
                {trackingNum}
            <h5>Ship Date:
                <span>
                    {` ${props.invoiceInfo ? props.invoiceInfo[2] : "Loading..."}`}
                </span>
            </h5>
            <ul>
                <li>
                    <span>Books ({props.data?.length})</span>
                    {books}    
                </li>
                <li>
                    <span onClick={toggleTrackingInfo}>Status</span>
                    {formatDeliveryInfo() || formatUPSInfo() || "Loading..."}
                </li>
            </ul>
            {moreTrackingInfo ? <TrackingModal data={props?.invoiceInfo?.[4].feed} toggleInfo={toggleTrackingInfo} /> : ''}
            {moreBookInfo ? <Modal data={modalBookInfo} toggleInfo={toggleInfo} /> : ''}
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

{/* <span 
                    className='tracking'
                    style={copyTracking ? {color: 'lime', fontWeight: 'bolder'} : {}} 
                    id={`shipment-${props.num}`} 
                    onClick={clipboard}
                ></span> */}

export default Shipment;