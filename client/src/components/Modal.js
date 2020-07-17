import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

function Modal(props) {

    const { ean, format, qty, price, modalInfo, pubDate } = props.data;

    const el = document.createElement('div')
    const modal = document.getElementById('modal-root')
    console.log(modalInfo, "MODAL INFO!")
    useEffect(() => {
        modal.appendChild(el)
        return () => modal.removeChild(el)
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
            <div id='modal-div'>
                Modal Body for Shipment
                <ul>
                    <li>Author: {author}</li>
                    <li>Pub date: {pubDate}</li>
                    <li>Versions: {format}</li>
                    <li>ISBN-13: {adjustedEan}</li>
                    <li>Price: {price}</li>
                    <li>On Order: {onOrder}</li>
                    <li>On Hand: {onHand}</li>
                    <li>Qty on order: {qty}</li>
                </ul>
                <div id='exit' onClick={props.toggleInfo}>X</div>
            </div>
        </div>
    , el)
}

export default Modal;