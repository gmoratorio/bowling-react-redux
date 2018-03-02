import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

import store from './store';

import PlayerSetup from './components/PlayerSetupComponent';
import Game from './components/GameComponent';

class App extends Component {
    render() {
        return (
            <Provider store={store} >
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={PlayerSetup}/>
                        <Route path="/game" component={Game}/>
                    </Switch>
                </BrowserRouter>
            </Provider>
        );
    }
}

export default App;
