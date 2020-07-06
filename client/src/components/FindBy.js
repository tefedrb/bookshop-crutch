import React, { useState, useContext } from 'react';
import { Context } from '../context';

import Order from './Order';

function FindBy() {
    const context = useContext(Context)
    let [value, setValue] = useState('')
    let [isLoading, setIsLoading] = useState(false)
    let { state, setCurrentOrderInfo } = context
    let { currentOrderInfo } = state

    const handleSubmit = e => {
        e.preventDefault()
        if (validPo()) {
            setCurrentOrderInfo(false)
            setIsLoading(true)
            let dots = 0
            let milli = 0
            let milliTen = 0
            let seconds = 0
            
            let dotsInterval = setInterval(() => {
                let loading = document.getElementById('loading')
                if (dots < 5) {
                    loading.innerText += '.'
                    dots++
                } else {
                    loading.innerText = 'Loading' 
                    dots = 0
                }
            }, 100)

            let milliInterval = setInterval(() => {
                let elapsed = document.getElementById('elapsed')
                if (milli > 9) {
                    milliTen++
                    milli = 0
                    if (milliTen > 9) {
                        seconds++
                        milliTen = 0
                    }
                }
                milli++
                elapsed.innerText = `[ ${seconds}.${milliTen} ]`
            }, 10)

            setTimeout(() => {
                setIsLoading(false)
                clearInterval(dotsInterval)
                clearInterval(milliInterval)
                setCurrentOrderInfo(true)
            }, 1500)
        }
        else alert('no')
    }

    const handleChange = e => setValue(e.target.value)

    const validPo = () => (value.length === 10 && value[0] === 'R' && !isNaN(value.split('R')[1])) || (value.includes('.') && value.split('.')[0].length === 10) ? true : false 

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input onChange={handleChange} value={value} id='input'/>
                {validPo() ? <button>FIND</button> : !value ? <div id='waiting'>Enter PO</div> : <div id='invalid'>INVALID</div>}
            </form>
            {isLoading ? <div className='loading' id='loading'>Loading</div> : ''}
            {isLoading ? <div className='loading' id='elapsed'></div> : ''}
            {Object.keys(currentOrderInfo).length ? <Order order={currentOrderInfo}/> : ''}
        </div>
    )
}

export default FindBy;