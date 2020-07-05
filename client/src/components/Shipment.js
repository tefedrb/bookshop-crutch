import React from 'react';
import Book from './Book';
import Order from './Order'

// [{}, {}]
function Shipment(props) {
    const { data } = props;
    console.log(data, "data")
    
    const individualOrders = data?.map((order, index) => 
        <Order key={index} order={order} />
    )
    
    return (
        <div className="individual-shipment">
            <h2>Invoice #: 
                <a href={data?.[0]["Invoice Number"][1]}>
                    {data?.[0]["Invoice Number"][0]}
                </a>
            </h2>
            <div className="shipment-column-labels">
                <div>Status</div>
                <div>Title</div>
                <div>Ean</div>
                <div>Format</div>
                <div>Pub Date</div>
                <div>Qty</div>
                <div>Price</div>
                <div>DC</div>
            </div>
            <div className="individual-orders-container">
                {individualOrders}
            </div>
        </div>
    )
}

export default Shipment;