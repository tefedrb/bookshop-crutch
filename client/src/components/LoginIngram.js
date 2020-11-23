import React from 'react';
import { useState, useContext } from 'react';
import PostIngramLogin from './ApiCalls/PostIngramLogin';
import CheckBrowserConnection from './ApiCalls/CheckBrowserConnection'
import { StartLoadingBar, StopLoadingBar } from '../components/LoadingBar';

import { Context } from '../context';

// Create api call here
const LoginIngram = () => {
    const [user, updateUser] = useState("");
    const [password, updatePassword] = useState("");
    const { saveBrowserEndpoint, setLoggedIn, state } = useContext(Context);

    const handleChange = (event) => {
        event.persist();
        if(event.target.name === "user"){
            updateUser(event.target.value);
        } else if(event.target.name === "password"){
            updatePassword(event.target.value);
        }
        // console.log(event.target.value, "EVENT")
    }
    
    const executeLogin = async (event) => {
        event.preventDefault();
        console.log("here we are... loginingram")
        // Check browser connection
        const browserStatus = state?.browserEndpoint ? await CheckBrowserConnection(state?.browserEndpoint) : null;
        let saveBrowser;
        const loadingBar = StartLoadingBar();
        if(browserStatus?.browserStatus === "connected"){
            console.log("browser status = connected")
            saveBrowser = 
                await PostIngramLogin({ ingramU: user, ingramP: password }, { browserStatus: "connected", wsEndpoint: state?.browserEndpoint});
        } else {
            saveBrowser = await PostIngramLogin({ ingramU: user, ingramP: password });
        }
        if(saveBrowser){
            const [wsEndpoint] = saveBrowser;
            saveBrowserEndpoint(wsEndpoint);
            setLoggedIn();
            StopLoadingBar(loadingBar);
        } else {
            StopLoadingBar(loadingBar);
            alert("Bad User/Pass");
        }
    }

    return (
        <div className="login-form">
            <div className="login-form-wrap">
                <p className="logo">BOOKSHOP-CRUTCH</p>
                <form onSubmit={executeLogin}>
                    <input 
                        placeholder="Ingram User" 
                        name="user" type="text" 
                        value={user} onChange={handleChange}
                    />
                    <input 
                        placeholder="Ingram Password" 
                        name="password" 
                        type="password" 
                        value={password} 
                        onChange={handleChange}
                    />
                    <input type="submit" value="Submit" />  
                </form>
                <div id="loading"></div>
                <div className='loading' id='elapsed'></div>
            </div>
        </div>
    )
}

export default LoginIngram;