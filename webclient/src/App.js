import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import store from './store/Store';

const fetchHealthcheck = () => {
    axios
        .get("http://localhost:8080/status/health")
        .then(resp => {
            if (resp && resp.status === 200 && resp.data && resp.data.status === "UP" ) {
                store.canBeLoaded = true;
            }
        });
}

function App() {
    useEffect(() => {
        fetchHealthcheck();
    }, []);


    return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
    );
}

export default App;
