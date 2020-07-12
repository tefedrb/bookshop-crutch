import React, { useContext } from 'react';
import { Provider, Context } from '../context';
import LoggedIn from './LoggedIn';
import LoginIngram from './LoginIngram';

const EnterApp = () => {
    const context = useContext(Context);
    const { loggedIn } = context.state;
    const display = loggedIn ? <LoggedIn /> : <LoginIngram />
    return (
        <>
            { display }
        </>
    )
}

export default EnterApp;