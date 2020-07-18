import React, { useState } from 'react';

import Modal from './Modal';

function Backorder(props) {
    let [moreInfo, setMoreInfo] = useState(false)

    const toggleInfo = () => setMoreInfo(!moreInfo)

    const { unshipped } = props;
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


    // modalInfo: {
        // author: "Kendi, Ibram X"
        // onHand: 0
        // onOrder: 8499
        // pubDate: "June 16, 2020"
        // NEED TO GET ARRIVAL DATE
    // }

    const rows = unshipped?.map((book, idx) => {
        const { 'Product Name': productName, 'Pub Date': pubDate} = book;
        const { onHand, onOrder } = book.modalInfo || {};
        return (
            <tr key={idx}>
                <td className='more-info' onClick={toggleInfo}>{productName}</td>
                <td>{pubDate}</td>
                <td>{onHand ? onHand : "Loading..."}</td>
                <td>{onOrder ? onOrder : "Loading..."}</td>
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
            {moreInfo ? <Modal data={'ye'} toggleInfo={toggleInfo} /> : ''}
        </div>
    )
}

export default Backorder;