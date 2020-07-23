import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const TrackingModal = (props) => {

    const el = document.createElement('div');
    const modal = document.getElementById('modal-root');

    const testKeyPress = (event) => event.key === "Escape" ? props.toggleInfo() : null;

    useEffect(() => {
        modal.appendChild(el);
        window.addEventListener('keydown', testKeyPress);
        return () => {
            modal.removeChild(el)
            window.removeEventListener('keydown', testKeyPress);
        };
    }, [])

    return ReactDOM.createPortal(
        <div id='modal-body'>
            <div className='clickable-background' onClick={props.toggleInfo}></div>
            <div id='tracking-modal-div'>
            
            </div>
        </div>
    )

}

export default TrackingModal;