import React from 'react';
import { useState, useContext } from 'react';
import PostIngramLogin from './ApiCalls/PostIngramLogin';
import { Context } from '../context';

// Create api call here

const LoginIngram = (props) => {
    const [user, updateUser] = useState("");
    const [password, updatePassword] = useState("");
    const context = useContext(Context);
    const { setBrowserInstance, setLoggedIn } = context;

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
        // Here we will check to see if things went accordingly.
        console.log("update")
        event.preventDefault();
        const savePage = await PostIngramLogin({ingramU: user, ingramP: password});
        const [wsEndpoint, currentUrl] = savePage;
        if(currentUrl.includes("administration")){
            setBrowserInstance(wsEndpoint);
            setLoggedIn();
        } else alert("Bad User/Pass");
        
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