import React, { useState, useContext } from 'react';
import { Context } from '../context';
import GetOrdersByPo from '../components/ApiCalls/GetOrdersByPo';
import { StartLoadingBar, StopLoadingBar } from '../components/LoadingBar';
import { parsedShipments } from '../components/ApiCalls/TestData';
import OrderDisplay from './OrderDisplay';
import Spinner from './Spinner';

import SearchByPo from './ApiCalls/SearchByPo';
import ScrapePoPage from './ApiCalls/ScrapePoPage';
import GetAllInvoiceInfo from './ApiCalls/GetAllInvoiceInfo';
import AddAllBookInfo from './ApiCalls/AddAllBookInfo';

function FindBy() {
    const context = useContext(Context);
    const { state, setCurrentOrderInfo } = context;
    const { browserEndpoint } = state;

    const [poInput, setPoInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { currentOrderInfo } = state;

    const findOrderByPo = async (po) => {
        const orderData = await GetOrdersByPo(po);
        return orderData;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validPo(poInput)) {
            setCurrentOrderInfo(false);
            setIsLoading(true);
            // const loadingBar = StartLoadingBar();
            await findOrderByPo(poInput).then(data => {
                setIsLoading(false); 
                setCurrentOrderInfo(data);
                // StopLoadingBar(loadingBar)
                console.log(data, "DATA IN FINDORDERBYPO")   
            }).catch(err => {
                console.log("Error finding order by po: " + err.message);
            }).finally();
            // const loadingBar = StartLoadingBar();
            // Might need to look into repaint hook  
        } else alert('no');
    }

    const handleSubmitSteps = async (e) => {
        e.preventDefault();
        if(validPo(poInput)){
            setCurrentOrderInfo(false);
            setIsLoading(true);
            const loadingBar = StartLoadingBar();
            await SearchByPo(poInput, browserEndpoint);
            const orderData = await ScrapePoPage(browserEndpoint);
            console.log(orderData, "ORDER DATA?!");
            StopLoadingBar(loadingBar);
            setIsLoading(false);
            setCurrentOrderInfo(orderData);
            const invoiceInfo = await GetAllInvoiceInfo(orderData, browserEndpoint);
            orderData.invoiceInfo = invoiceInfo;
            setCurrentOrderInfo(orderData);
            await AddAllBookInfo(orderData, browserEndpoint);
            setCurrentOrderInfo(orderData);
        } else alert('no');
    }

    const handleSubmitTestData = async (e) => {
        e.preventDefault();
        if(validPo(poInput)){
            // setCurrentOrderInfo(false);
            // setIsLoading(true);
            // const loadingBar = StartLoadingBar();

            setCurrentOrderInfo(parsedShipments);

            // setTimeout(() => {
            //     setIsLoading(false);
            //     StopLoadingBar(loadingBar);
            //     console.log("made it");
            // }, 1000);
        } 
        else alert('no');
    }

    const handleChange = e => setPoInput(e.target.value);

    const validPo = (input) => (input?.length === 10 && input[0] === 'R' && !isNaN(input.split('R')[1])) || input?.includes('.') && input.split('.')[0].length === 10 ? true : false 

    return (
        <div>
            <form onSubmit={handleSubmitSteps}>
                <input onChange={handleChange} value={poInput}/>
                {validPo(poInput) ? <button>FIND</button> : !poInput ? <div id='waiting'>Enter PO</div> : <div id='invalid'>INVALID</div>}
            </form>
            {isLoading ? <div className='loading' id='loading'>Loading</div> : ''}
            {isLoading ? <div className='loading' id='elapsed'></div> : ''}          
            {Object.keys(currentOrderInfo).length ? <OrderDisplay order={currentOrderInfo}/> : ''}
        </div>
    )
}

export default FindBy;