import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {Button} from 'react-bootstrap';

import './components.css';

import PlayerInput from './PlayerInputComponent';

import {updatePlayerCount, finalizePlayerCount, updatePlayerName, finalizePlayerNames} from '../actions';

class PlayerSetup extends Component {

    onClickConfirmPlayerCount = () => {
        this.props.confirmPlayerCount();
    };

    onClickPlayerRadio = (playerCount) => {
        this.props.updatePlayerCount({playerCount});
    };

    onClickConfirmPlayerCount = () => {
        this.props.finalizePlayerCount();
    };

    renderConfirmPlayerCountButton() {
        if (this.props.playerCount !== 0) {
            return (
                <div>
                    <button type="button" className="btn btn-primary confirm-button"
                            onClick={this.onClickConfirmPlayerCount}>Confirm
                    </button>
                </div>
            );
        }
    }

    renderPlayerNumberSelection() {
        const {playerCount} = this.props;

        return (
            <div className='game-container'>
                <h5>How many players will be playing today?</h5>

                <div className="custom-control custom-radio custom-control-inline">
                    <input
                        type="radio"
                        id="customRadioInline1"
                        name="customRadioInline1"
                        className="custom-control-input"
                        value={1}
                        checked={playerCount === 1}
                        onChange={() => this.onClickPlayerRadio(1)}
                    />
                    <label className="custom-control-label" htmlFor="customRadioInline1">
                        1 Player
                    </label>
                </div>

                <div className="custom-control custom-radio custom-control-inline">
                    <input
                        type="radio"
                        id="customRadioInline2"
                        name="customRadioInline1"
                        className="custom-control-input"
                        value={2}
                        checked={playerCount === 2}
                        onChange={() => this.onClickPlayerRadio(2)}
                    />
                    <label className="custom-control-label" htmlFor="customRadioInline2">
                        2 Players
                    </label>
                </div>

                {this.renderConfirmPlayerCountButton()}
            </div>
        );
    }

    onPlayerNameInputChange = ({value, index}) => {
        this.props.updatePlayerName({name: value, index});
    };

    onSubmitPlayerNames = (event) => {
        event.preventDefault();

        this.props.finalizePlayerNames();
    };

    renderPlayerNameSelection() {
        const {players, playerNamesHaveError} = this.props;

        return (
            <div className='game-container'>
                <h5>Please enter player names</h5>

                <PlayerInput
                    players={players}
                    onInputChange={this.onPlayerNameInputChange}
                    onSubmit={this.onSubmitPlayerNames}
                    playerNamesHaveError={playerNamesHaveError}
                />
            </div>
        );

    }

    renderScreen = () => {
        const {playerCountFinalized, playerNamesFinalized} = this.props;

        if (!playerCountFinalized) {
            return (
                <div>
                    {this.renderPlayerNumberSelection()}
                </div>
            );
        }

        if (!playerNamesFinalized) {
            return (
                <div>
                    {this.renderPlayerNameSelection()}
                </div>
            );
        }

        if (playerCountFinalized && playerNamesFinalized) {
            return (
                <div>
                    <Button bsStyle="primary">
                        <Link to="/game" className="disable-link-defaults">
                            Let's Get Bowling!
                        </Link>
                    </Button>
                </div>
            );
        }


    };


    render() {
        return (
            <div className='container game-container'>
                <h3>Welcome to Bowling - React & Redux Edition!</h3>

                {this.renderScreen()}
            </div>
        )
    }

}

function mapStateToProps(state) {
    const {playerCount, playerCountFinalized, players, playerNamesFinalized, playerNamesHaveError} = state.game;

    return {playerCount, playerCountFinalized, players, playerNamesFinalized, playerNamesHaveError};
}

export default connect(mapStateToProps, {
    updatePlayerCount,
    finalizePlayerCount,
    updatePlayerName,
    finalizePlayerNames
})(PlayerSetup);