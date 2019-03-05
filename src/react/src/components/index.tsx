import {sys} from "cessnalib";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';

interface IProps {
  clock: sys.type.Clock
}

export function render({clock}: IProps) {
  ReactDOM.render(
    <App clock={clock} />,
    document.getElementById('root') as HTMLElement
  );
}
