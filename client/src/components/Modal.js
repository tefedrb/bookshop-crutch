import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const Modal = (props) => {

    // const { ean, format, qty, price, modalInfo, pubDate } = props.data;

    const el = document.createElement('div')
    const modal = document.getElementById('modal-root')

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
    } = props.data;

    const copyToClipboard = () => {
        const el = this.innerText
    }

    const testKeyPress = (event) => event.key === "Escape" ? props.toggleInfo() : null;

    useEffect(() => {
        modal.appendChild(el);
        window.addEventListener('keydown', testKeyPress);
        return () => {
            modal.removeChild(el)
            window.removeEventListener('keydown', testKeyPress);
        };
    }, [])

    const formatNum = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

    const adjustedEan = <a href={ean[1]} target="_blank" rel="noopener noreferrer">{ean[0].substring(0, 13)}</a>;
    const author = modalInfo ? modalInfo.author : "Loading...";
    const onOrder = modalInfo ? formatNum(modalInfo.onOrder) : "Loading...";
    const onHand = modalInfo ? formatNum(modalInfo.onHand) : "Loading...";

    return ReactDOM.createPortal(
        <div id='modal-body'>
            <div className='clickable-background' onClick={props.toggleInfo}></div>
            <div id='modal-div'>
                Modal Body for Shipment
                <ul>
                    <li>Author: {author}</li>
                    <li>Pub date: {pubDate}</li>
                    <li>Versions: {format}</li>
                    <li className={"clipBoard"}><span>ISBN-13: {adjustedEan}</span><img src="https://img.icons8.com/windows/32/000000/clipboard--v1.png"/></li>
                    <li>Price: {price}</li>
                    <li>On Order: {onOrder}</li>
                    <li>On Hand: {onHand}</li>
                    <li>Qty on order: {qty}</li>
                </ul>
                <div id='exit' onClick={props.toggleInfo}>X</div>
            </div>
        </div>
    , el);
}

export default Modal;