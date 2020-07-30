import React, { useState, useContext } from 'react';
import { Context } from '../context';
import GetOrdersByPo from '../components/ApiCalls/GetOrdersByPo';
import { StartLoadingBar, StopLoadingBar } from '../components/LoadingBar';
// import { parsedShipments } from '../components/ApiCalls/TestData';
import RegexPatterns from '../RegexPatterns';
import OrderDisplay from './OrderDisplay';
import Spinner from './Spinner';

import SearchByPo from './ApiCalls/SearchByPo';
import ScrapePoPage from './ApiCalls/ScrapePoPage';
import GetAllInvoiceInfo from './ApiCalls/GetAllInvoiceInfo';
import AddAllBookInfo from './ApiCalls/AddAllBookInfo';
import ScrapeUSPSTracking from './ApiCalls/ScrapeUSPSTracking';
import ScrapeUPSTracking from './ApiCalls/ScrapeUPSTracking'

function FindBy() {
    const context = useContext(Context);
    const { state, setCurrentOrderInfo, setLoggedIn } = context;
    const { browserEndpoint, currentOrderInfo } = state;

    const [poInput, setPoInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    

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
            // Removing data from current order (which is displayed)
            setCurrentOrderInfo(false);
            // Turning on loading toggle, consequently rendering divs
            setIsLoading(true);
            // Creating and saving an interval, while starting loading bar animation.
            const loadingBar = StartLoadingBar();
            // Manipulating the browser associated with the browserEndpoint - searching po
            await SearchByPo(poInput, browserEndpoint);
            // Manipulating same browser with endpoint - scraping order data
            const orderData = await ScrapePoPage(browserEndpoint);
            // Stopping interval - subsequently stopping loading animation
            StopLoadingBar(loadingBar);
            // Turning off loading toggle, consequently removing divs
            setIsLoading(false);
            console.log(orderData,)
            // Saving / setting current order data in context
            setCurrentOrderInfo(orderData);
            // Evaluate error
            if(!orderData.error){
                const invoiceInfo = await GetAllInvoiceInfo(orderData, browserEndpoint);
                // Saving raw invoiceData before scraping / adding tracking numbers
                orderData.invoiceInfo = invoiceInfo;
                setCurrentOrderInfo(orderData);
                // ITERATE OVER INVOICE INFO GRABBING EACH TRACKING NUMBER
                // HERE WE HAVE TO DETERMINE WHETHER TRACKING IS UPS OR NOT
                for(let i = 0; i < invoiceInfo.length; i++){
                    const isUps = invoiceInfo[i][0].match(RegexPatterns.ups);
                    let trackingFeed;
                    if(isUps){
                        trackingFeed = await ScrapeUPSTracking(invoiceInfo[i][0], browserEndpoint);
                    } else {
                        trackingFeed = await ScrapeUSPSTracking(invoiceInfo[i][0], browserEndpoint);
                    }
                    invoiceInfo[i].push(trackingFeed);
                }
                // Adding invoice info with tracking Data
                orderData.invoiceInfo = invoiceInfo;
                setCurrentOrderInfo(orderData);
                const bookDataAdded = await AddAllBookInfo(orderData, browserEndpoint);
                setCurrentOrderInfo(bookDataAdded);
            }
            
        } else alert('no');
    }

    const handleSubmitTestData = async (e) => {
        e.preventDefault();
        if(validPo(poInput)){
            // setCurrentOrderInfo(false);
            // setIsLoading(true);
            // const loadingBar = StartLoadingBar();

            // setCurrentOrderInfo(parsedShipments);

            // setTimeout(() => {
            //     setIsLoading(false);
            //     StopLoadingBar(loadingBar);
            //     console.log("made it");
            // }, 1000);
        } 
        else alert('no');
    }

    const handleChange = e => setPoInput(e.target.value);
    const errorMessage = currentOrderInfo?.error ? <div id='errorMessage'>{currentOrderInfo.error}</div> : "";
    const validPo = (input) => (input?.length === 10 && input[0] === 'R' && !isNaN(input.split('R')[1])) || input?.includes('.') && input.split('.')[0].length === 10 ? true : false 
    
    return (
        <div className="section-wrapper">
            <form onSubmit={handleSubmitSteps}>
                <input onChange={handleChange} value={poInput}/>
                {validPo(poInput) ? <button>FIND</button> : !poInput ? <div id='waiting'>Enter PO</div> : <div id='invalid'>INVALID</div>}
            </form>
            {errorMessage}
            {isLoading ? <div className='loading' id='loading'>Loading</div> : ''}
            {isLoading ? <div className='loading' id='elapsed'></div> : ''}          
            {currentOrderInfo?.shipments ? <OrderDisplay order={currentOrderInfo}/> : ''}
        </div>
    )
}

export default FindBy;