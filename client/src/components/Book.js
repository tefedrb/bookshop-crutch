import React from 'react';

const Book = (props) => {
    const { toggleInfo, setModalInfo, bookData } = props;
    const { 'Product Name': productName } = props.bookData;
    const handleClick = () => {
        toggleInfo();
        setModalInfo(bookData);
    }

    return (
        <span onClick={handleClick}>- {productName}</span>
    )
}

export default Book;