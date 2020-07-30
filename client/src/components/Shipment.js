import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import TrackingModal from './TrackingModal';
import Book from './Book';

function Shipment(props) {
    const [trackingColor, setTrackingColor] = useState(null);
    const [moreBookInfo, setMoreBookInfo] = useState(false);
    const [modalBookInfo, setModalBookInfo] = useState(null);

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
            const styled = { color: "rgb(255, 68, 0)" };
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
                    <span style={{ color: "red" }}>{deliveryStatusInfo?.status}</span>
                    <span>{deliveryStatusInfo?.location}</span>
                </>
            )
        } else {
            return false;
        }
    }

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
            {
                props.invoiceInfo?.[4]?.link 
                ?
                <a href={`${props.invoiceInfo?.[4]?.link}`} target="_blank" rel="noopener noreferrer">
                    {props.invoiceInfo[0]}
                </a> 
                :
                <span>{props.invoiceInfo[0]}</span>
            }
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

export default Shipment;