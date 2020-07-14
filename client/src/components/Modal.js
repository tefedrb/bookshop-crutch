import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

function Modal(props) {

    const { ean, format, qty} = props.modalInfo;

    const el = document.createElement('div')
    const modal = document.getElementById('modal-root')

    useEffect(() => {
        modal.appendChild(el)
        return () => modal.removeChild(el)
    }, [])

    return ReactDOM.createPortal(
        <div id='modal-body'>
            <div id='modal-div'>
                Modal Body for Shipment
                <ul>
                    <li>Author: </li>
                    <li>Versions: {format}</li>
                    <li>ISBN-13: {ean}</li>
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