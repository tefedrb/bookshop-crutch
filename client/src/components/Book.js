import React from 'react';

const Book = (props) => {
    const { order } = props;
    return (
        <div>
            <p>
                <h3>{order['Product Name']}</h3>
                <span>Ean: <a href={order.Ean[1]}>{order.Ean[0]}</a></span>
                <span>Format: {order.Format}</span>
                <span>Pub Date: {order['Pub Date']}</span>
                
                <span>Qty: {order.Qty}</span>
                <span>Price: {order.price}</span>
                <span>DC: {order.DC}</span>
            </p>         
        </div>
    )
}

export default Book;