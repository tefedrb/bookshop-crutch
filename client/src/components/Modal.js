import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

function Modal(props) {

    let el = document.createElement('div')
    let modal = document.getElementById('modal-root')

    useEffect(() => {
        modal.appendChild(el)
        return () => modal.removeChild(el)
    }, [])

    return ReactDOM.createPortal(
        <div id='modal-body'>
            <div id='modal-div'>
                Modal Body for Shipment {props.data}
                <ul>
                    <li>Author: Billy Bob</li>
                    <li>Versions: Paperback, Hardback</li>
                    <li>ISBN-13: 9190390490149</li>
                    <li>On Order: 200</li>
                    <li>On Hand: 300</li>
                    <li>etc.</li>
                </ul>
                <div id='exit' onClick={props.toggleInfo}>X</div>
            </div>
        </div>
    , el)
}

export default Modal;