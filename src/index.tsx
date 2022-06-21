import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import MapMainScreen from './components/MapMainScreen';
import 'bootstrap/dist/css/bootstrap.min.css';

import Storages from './storage/Storages';
import { Provider } from 'mobx-react';

ReactDOM.render(
  <Provider {...Storages}>
    <MapMainScreen/>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
