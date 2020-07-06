import React, { useState, useEffect } from 'react';

import Modal from './Modal';

function Shipment(props) {
    let [copyTracking, setCopyTracking] = useState(false)
    let [trackingColor, setTrackingColor] = useState(null)
    let [moreInfo, setMoreInfo] = useState(false)

    const clipboard = () => {
        let id = `shipment-${props.num}`
        let spanEl = document.getElementById(id)
        let inputEl = document.getElementById('input')
        let inputElOrigVal = inputEl.value
        inputEl.value = spanEl.innerText
        inputEl.select()
        document.execCommand('Copy')
        inputEl.value = inputElOrigVal
        setCopyTracking(true)
        setTrackingColor(setTimeout(() => setCopyTracking(false), 5000))
    }

    const toggleInfo = () => setMoreInfo(!moreInfo)

    useEffect(() => {
        return () => clearTimeout(trackingColor)
    })

    return(
        <div className='shipment'>
            <h3>Shipment {props.num}: <a href='#'>Invoice</a></h3>
            <h4>Tracking: 
                <span 
                    className='tracking'
                    style={copyTracking ? {color: 'lime', fontWeight: 'bolder'} : {}} 
                    id={`shipment-${props.num}`} 
                    onClick={clipboard}>
                        3495828281891283
                </span>
            </h4>
            <ul>
                <li>
                    <span>Books (3)</span>
                    <span className='more-info' onClick={toggleInfo}>White Flight</span>
                    <span className='more-info' onClick={toggleInfo}>Invisible Man</span>
                    <span className='more-info' onClick={toggleInfo}>King Kong</span>    
                </li>
                <li>
                    <span>Status</span>
                    <span>Estimated Delivery 12/20 Accepted at facility</span>
                </li>
            </ul>
            {moreInfo ? <Modal data={props.num} toggleInfo={toggleInfo} /> : ''}
        </div>
    )
}

export default Shipment;