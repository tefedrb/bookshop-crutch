import React from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';

import FindBy from './FindBy'
import OrdersWatch from './OrdersWatch';
import Other from './Other';

const LoggedIn = () => {
    return (
        <Router className='small'>
            <nav>
                <Link to='/' className='link'>Find By PO</Link>
                <Link to='/orderswatch' className='link'>Orders Watch</Link>
                <Link to='/other' className='link'>Other</Link>
            </nav>
            <Switch>
                <Route exact path='/' component={FindBy} />
                <Route path='/orderswatch' component={OrdersWatch} />
                <Route path='/other' component={Other} />
            </Switch>
        </Router>
    )
}

export default LoggedIn;