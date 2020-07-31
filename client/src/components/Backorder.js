import React, { useState, useEffect } from 'react';

import Modal from './Modal';

function Backorder(props) {
    const [moreInfo, setMoreInfo] = useState(false);
    const [selectedModal, setSelectedModalInfo] = useState("");
    const { unshipped } = props;

    const toggleInfo = (event) => {
        // Find book in unshipped that event relates to 
        let target = event.target.innerText;
        const selectedBook = unshipped.filter( book => book["Product Name"] === target)[0];
        setSelectedModalInfo(selectedBook);
        setMoreInfo(!moreInfo);
    }

    // This will be taking in books not on any shipment
    // [{}, {}]
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

    // const cancelBackorder = status === "Backordered" ? <button className="btn">Cancel Backorder</button> : "";

    const rows = unshipped?.map((book, idx) => {
        const { 'Product Name': productName, 'Pub Date': pubDate, "Status": status} = book;
        const { onHand, onOrder } = book.modalInfo || {};
        return (
            <tr key={idx}>
                <td className='more-info' onClick={toggleInfo}>{productName}</td>
                <td>{status}</td>
                <td>{pubDate}</td>
                <td>{onHand != undefined ? onHand : "Loading..."}</td>
                <td>{onOrder != undefined ? onOrder : "Loading..."}</td>
                <td>Loading...</td>
            </tr>
        )
    })
    const unshippedHeader = <h3>{unshipped?.length > 0 ? `Unshipped (${unshipped.length})` : ''}</h3>
    
    return (
        <div className='backorders'>
            {unshippedHeader}
            <table>
                <tbody>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Published</th>
                        <th>On Hand</th>
                        <th>On Order</th>
                        <th>Arrival Date</th>
                    </tr>
                    {rows}
                </tbody>
            </table>
            {moreInfo ? <Modal data={selectedModal} toggleInfo={toggleInfo} /> : ''}
        </div>
    )
}

export default Backorder;