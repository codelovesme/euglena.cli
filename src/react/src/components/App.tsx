import * as React from 'react';
import './App.css';
import logo from './logo.svg';
import {sys} from 'cessnalib';

export default function App({clock}: {clock:sys.type.Clock}) {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Time :{`${clock.hour}:${clock.minute}:${clock.second}`} </h1>
      </header>
      <p className="App-intro">
        To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
    </div>
  );
}