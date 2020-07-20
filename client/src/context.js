import React, { useEffect, useState } from 'react';

export const Context = React.createContext();

export const usePersistedState = (key, defaultValue) => {
    const [state, setState] = useState(
        () => JSON.parse(localStorage.getItem(key)) || defaultValue
    );
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);
    return [state, setState];
}

export const Provider = (props) => {
    
    const contextState = usePersistedState("context", { 
        loggedIn: false,
        currentOrderInfo: {},
        browserEndpoint: null
    })

    const [state, setState] = contextState;

    console.log(state, "STATE");

    const saveBrowserEndpoint = (wsEndpoint) => {
        setState(prevState => {
                return {...prevState, browserEndpoint: wsEndpoint}
            }
        );
    }

    const setCurrentOrderInfo = data => {
        if (!data) {
            setState(prevState => {
                    return {...prevState, currentOrderInfo: {}}
                }
            );
        } else {
            setState(prevState => {
                    return {...prevState, currentOrderInfo: data}
                }
            );
        }
    }

    const setLoggedIn = () => {
        setState(prevState => {
                return {...prevState, loggedIn: !state.loggedIn}
            }
        );
    }

    return (
        <Context.Provider value={{state, setCurrentOrderInfo, setLoggedIn, saveBrowserEndpoint}}>
            {props.children}
        </Context.Provider>
    )
    
}

export const Consumer = Context.Consumer;