import React, { Component } from 'react';

export const Context = React.createContext();

export class Provider extends Component {
    state = { 
        string: 'wow',
        loggedIn: false,
        currentOrderInfo: {},
        currentBrowserInstance: null
    }

    setBrowserInstance = (wsEndpoint) => {
        this.setState({currentBrowserInstance: wsEndpoint})
    }

    setCurrentOrderInfo = data => {
        if (!data) {
            this.setState({currentOrderInfo: {}})
        } else {
            this.setState({currentOrderInfo: data});
        }
    }

    setLoggedIn = () => {
        this.setState({loggedIn: !this.state.loggedIn});
    }

    // {
    //     currentOrderInfo: {
    //         po: 'R314123123',
    //         dateOrdered: '1/3/20',
    //         address: '910 Riverside Drive Apt 6E NY NY 10032',
    //         invoices: ['34124', '123213', '123415'],
    //         books: [
    //             {
    //                 title: 'George of the Jungle',
    //                 invoice: '34124',
    //                 status: 'shipped',
    //                 tracking: '93414123123941',
    //                 published: '3/4/15',
    //                 onOrder: '100',
    //                 onHand: '0',
    //                 stockArrival: '5/20',
    //                 isbn: '01034141941'
    //             }
    //         ]
    //     }
    // }

    render() {
        const { state, setCurrentOrderInfo, setLoggedIn, setBrowserInstance} = this;

        return(
            <Context.Provider value={{state, setCurrentOrderInfo, setLoggedIn, setBrowserInstance}}>
                {this.props.children}
            </Context.Provider>
        )
    }
}

export const Consumer = Context.Consumer;