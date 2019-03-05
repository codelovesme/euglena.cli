import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import {sys} from 'cessnalib';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const now = sys.type.StaticTools.Time.now();
  expect(now).not.toBeUndefined();
  expect(now.clock).not.toBeUndefined();
  expect(now.clock.hour).not.toBeUndefined();
  
  ReactDOM.render(<App clock={now.clock}  />, div);
  ReactDOM.unmountComponentAtNode(div);
});
