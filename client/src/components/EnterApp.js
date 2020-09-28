import React, { useContext, useEffect } from 'react';
import { Context } from '../context';
import LoggedIn from './LoggedIn';
import LoginIngram from './LoginIngram';
import CheckBrowserConnection from './ApiCalls/CheckBrowserConnection';

const EnterApp = () => {
    const context = useContext(Context);
    const { loggedIn, browserEndpoint } = context.state;
    const display = loggedIn ? <LoggedIn /> : <LoginIngram />
    // EnterApp - need to be connected - ALSO check to see if you are logged in to ingram
    
    useEffect(() => {
        const checkBrowser = async () => {
            const browserConnection = await CheckBrowserConnection(browserEndpoint);
            console.log(browserConnection, "browser")
            if(browserConnection?.browserStatus === "disconnected"){
                context.setLoggedIn(false);
            }
            return browserConnection;
        };
        checkBrowser();
    }, [browserEndpoint])

    return (
        <>
            { display }
        </>
    )
}

export default EnterApp;