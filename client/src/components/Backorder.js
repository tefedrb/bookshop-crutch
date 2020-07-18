import React, { useState } from 'react';

import Modal from './Modal';

function Backorder(props) {
    let [moreInfo, setMoreInfo] = useState(false)

    const toggleInfo = () => setMoreInfo(!moreInfo)

    // const props.data.map((b,i) => (
    //     <tr key={i}>
    //         <td className='more-info' onClick={toggleInfo}>Moby Dick: The Extraordinary Adventures of the White Whale</td>
    //         <td>1860</td>
    //         <td>0</td>
    //         <td>250</td>
    //         <td>4/20</td>
    //     </tr>
    // ))}

    return (
        <div className='backorders'>
            <h3>{props.title}{props.data.length > 1 ? `s (${props.data.length})` : ''}</h3>
            <table>
                <tbody>
                    <tr>
                        <th>Title</th>
                        <th>Published</th>
                        <th>On Hand</th>
                        <th>On Order</th>
                        <th>Arrival Date</th>
                    </tr>
                    {props.data.map((b,i) => (
                        <tr key={i}>
                            <td className='more-info' onClick={toggleInfo}>Moby Dick: The Extraordinary Adventures of the White Whale</td>
                            <td>1860</td>
                            <td>0</td>
                            <td>250</td>
                            <td>4/20</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {moreInfo ? <Modal data={'ye'} toggleInfo={toggleInfo} /> : ''}
        </div>
    )
}

export default Backorder;