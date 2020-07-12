import React from 'react';
import { Provider, Context } from './context';

const EnterApp = () => {
    const context = useContext(Context);
    const { loggedIn } = context;
    return (
        <Provider className="big">
            {loggedIn ? <LoggedIn /> : <LoginIngram />}
        </Provider>
    )
}

export default EnterApp;