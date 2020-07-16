import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

function Modal(props) {

    const { ean, format, qty, price, modalInfo} = props.data;

    const el = document.createElement('div')
    const modal = document.getElementById('modal-root')
    console.log(modalInfo, "MODAL INFO!")
    useEffect(() => {
        modal.appendChild(el)
        return () => modal.removeChild(el)
    }, [])

    const adjustedEan = <a href={ean[1]}>{ean[0].substring(0, 13)}</a>;
    const author = modalInfo ? modalInfo.author : "Loading...";

    return ReactDOM.createPortal(
        <div id='modal-body'>
            <div id='modal-div'>
                Modal Body for Shipment
                <ul>
                    <li>Author: {author}</li>
                    <li>Versions: {format}</li>
                    <li>ISBN-13: {adjustedEan}</li>
                    <li>Price: {price}</li>
                    <li>On Order: </li>
                    <li>On Hand: </li>
                    <li>Qty on order: {qty}</li>
                </ul>
                <div id='exit' onClick={props.toggleInfo}>X</div>
            </div>
        </div>
    , el)
}

export default Modal;