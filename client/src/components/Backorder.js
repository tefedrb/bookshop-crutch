import React, { useState, useEffect } from 'react';

import Modal from './Modal';

function Backorder(props) {
    const [moreInfo, setMoreInfo] = useState(false);
    const [selectedModal, setSelectedModalInfo] = useState("");
    
    const toggleInfo = (event) => {
        console.log(event, "event with a click")
        setMoreInfo(!moreInfo);
        if(moreInfo){
            setSelectedModalInfo()
        }
    }

    const { unshipped } = props;
    // This will be taking in books not on any shipment
    // [{}, {}]
    console.log(unshipped[0], "UNSHIPPED")
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


    // modalInfo: {
        // author: "Kendi, Ibram X"
        // onHand: 0
        // onOrder: 8499
        // pubDate: "June 16, 2020"
        // NEED TO GET ARRIVAL DATE
    // }
    // useEffect(() => {
    //     console.log(unshipped[0].modalInfo, "MODAL INFO");
    //     if(unshipped[0].modalInfo){
    //         setModalInfo(true);
    //     }
    // }, [unshipped])

    const rows = unshipped?.map((book, idx) => {
        const { 'Product Name': productName, 'Pub Date': pubDate} = book;
        console.log(book.modalInfo, "MODAL INFO SHOWING UP?!")
        const { onHand, onOrder } = book.modalInfo || {};
        console.log(onHand, "ON HAND?!")
        console.log(onHand != undefined ? "yes" : "no", "WITHIN THIS THANG");
        console.log(typeof onHand, "WHAT IS IT?!");
        return (
            <tr key={idx}>
                <td className='more-info' onClick={toggleInfo}>{productName}</td>
                <td>{pubDate}</td>
                <td>{onHand != undefined ? onHand : "Loading..."}</td>
                <td>{onOrder != undefined ? onOrder : "Loading..."}</td>
                <td>Loading...</td>
            </tr>
        )
    })
    // <h3>{props.title}{props.data.length > 1 ? `s (${props.data.length})` : ''}</h3>
    return (
        <div className='backorders'>
            <h3>{unshipped.length > 1 ? `Unshipped (${unshipped.length})` : ''}</h3>
            <table>
                <tbody>
                    <tr>
                        <th>Title</th>
                        <th>Published</th>
                        <th>On Hand</th>
                        <th>On Order</th>
                        <th>Arrival Date</th>
                    </tr>
                    {rows}
                </tbody>
            </table>
            {moreInfo ? <Modal data={unshipped[0]} toggleInfo={toggleInfo} /> : ''}
        </div>
    )
}

export default Backorder;