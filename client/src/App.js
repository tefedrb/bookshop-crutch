import React from 'react';
import './App.css';
import LoginIngram from './components/LoginIngram';
import EnterApp from './components/EnterApp'
import { Provider } from './context'

function App() {
  return (
    <Provider className="big">
      <EnterApp />
    </Provider>
  );
}

export default App;
