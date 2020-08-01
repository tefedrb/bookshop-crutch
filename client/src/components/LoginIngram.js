import React from 'react';
import { useState, useContext } from 'react';
import PostIngramLogin from './ApiCalls/PostIngramLogin';
import ConnectToBrowser from './ApiCalls/ConnectToBrowser';
import { Context } from '../context';

// Create api call here
const LoginIngram = (props) => {
    const [user, updateUser] = useState("");
    const [password, updatePassword] = useState("");
    const context = useContext(Context);
    const { saveBrowserEndpoint, setLoggedIn, state } = context;

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
        const saveBrowser = await PostIngramLogin({ingramU: user, ingramP: password});
        if(saveBrowser){
            const [wsEndpoint] = saveBrowser;
            saveBrowserEndpoint(wsEndpoint);
            setLoggedIn();
            // ConnectToBrowser(wsEndpoint);
        } else {
            alert("Bad User/Pass");
        }
    }

    return (
        <div className="login-form">
            <form onSubmit={executeLogin}>
                <input name="user" type="text" value={user} onChange={handleChange}></input>
                <input name="password" type="password" value={password} onChange={handleChange}></input>
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default LoginIngram;