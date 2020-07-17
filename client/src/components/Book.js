import React from 'react';

const Book = (props) => {
    const { toggleInfo, setModalInfo, bookData } = props;

    const { 
        DC, 'Date Ordered': dateOrdered, 
        Ean: ean, 
        Format: format, 
        'Invoice Number': invoiceNumber,
        'OE Number': oeNumber,
        'Po Number': poNumber,
        'Product Name': productName,
        'Pub Date': pubDate,
        Qty: qty,
        Select: select,
        Status: status,
        price,
        modalInfo
    } = bookData;

    const handleClick = () => {
        toggleInfo();
        setModalInfo({format, ean, productName, pubDate, price, modalInfo, qty});
    }

    return (
        <span onClick={handleClick}>{productName}</span>
    )
}

export default Book;