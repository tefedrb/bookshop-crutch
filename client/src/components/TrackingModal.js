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
            modal.removeChild(el);
            window.removeEventListener('keydown', testKeyPress);
        };
    }, [])

    const listTrackingHistory = props?.data?.map(( status, idx ) => 
        <div className="tracking-entry" key={idx}>
            {
                Object.entries(status).map((entry, idx) => {
                    let styled;
                    idx === 0 ? styled = { fontWeight: 'bold' } :
                    idx === 1 ? styled = { color: 'red' } :
                    idx === 3 ? styled = { color:  'rgb(166, 166, 226)'} :
                    styled = { color: 'black'}
                    return  <p key={idx} style={styled}>{entry[1]}</p> 
                })
            }
        </div>
    );

    return ReactDOM.createPortal(
        <div id='modal-body'>
            <div className='clickable-background' onClick={props.toggleInfo}></div>
            <div id='tracking-modal-div'>
                {listTrackingHistory}
            </div>
        </div>
    , el);

}

export default TrackingModal;