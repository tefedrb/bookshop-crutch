import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import FindBy from './FindBy';
import OrdersWatch from './OrdersWatch';
import Other from './Other';

{/* 
    <Link to='/orderswatch' className='link'>Orders Watch</Link>
    <Link to='/other' className='link'>Other</Link> 
*/}
 {/* 
    <nav>
        <Link to='/' className='link'>Find By PO</Link>
    </nav> 
*/}

const LoggedIn = () => {
    return (
        <Router className='small'>
            <p className="logo">BOOKSHOP-CRUTCH</p>
           
            <Switch>
                <Route exact path='/' component={FindBy} />
                <Route path='/orderswatch' component={OrdersWatch} />
                <Route path='/other' component={Other} />
            </Switch>
        </Router>
    )
}

export default LoggedIn;