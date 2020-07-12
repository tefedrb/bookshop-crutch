import React from 'react';
import './App.css';
import LoginIngram from './components/LoginIngram';
import {Provider} from './context'

function App() {
  return (
    <Provider>
        <LoginIngram />
    </Provider>
  );
}

export default App;
