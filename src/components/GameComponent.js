import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

import _ from 'lodash';

import {updateEnteredScore, submitScore} from '../actions';

import PlayerContainer from './PlayerContainerComponent';

class Game extends Component {

    onPlayerScoreChange = (event) => {
        const enteredScore = event.target.value;

        this.props.updateEnteredScore({enteredScore});
    };

    onSubmitScore = (event) => {
        event.preventDefault();
        this.props.submitScore();
    };

    renderPlayers = () => {
        const {players, playerTurn, frameNumber, attemptNumber, enteredScore, currentFrameIsValid, gameIsOver} = this.props;

        return _.map(players, (player, index) => {
            const {name, results} = player;
            const thisPlayersTurnOrder = index + 1;
            const isThisPlayersTurn = playerTurn === thisPlayersTurnOrder;

            return (
                <PlayerContainer
                    key={index}
                    name={name}
                    results={results}
                    isThisPlayersTurn={isThisPlayersTurn}
                    frameNumber={frameNumber}
                    attemptNumber={attemptNumber}
                    onInputChange={this.onPlayerScoreChange}
                    score={enteredScore}
                    onSubmitScore={this.onSubmitScore}
                    currentFrameIsValid={currentFrameIsValid}
                    gameIsOver={gameIsOver}
                />
            );
        })
    };

    renderMultipleResults = (players) => {
        return _.map(players, (player, index) => {
            return (
                <div key={index} className='results-text'>{player.name}'s final score is {player.finalScore}.</div>
            );
        });
    };

    renderWinnerText = (players) => {
        const playerOne = players[0];
        const playerTwo = players[1];

        if (playerOne.finalScore > playerTwo.finalScore) {
            return (
                <div className='results-text'>{playerOne.name} wins! Well done!</div>
            );
        } else if (playerOne.finalScore < playerTwo.finalScore) {
            return (
                <div className='results-text'>{playerTwo.name} wins! Well done!</div>
            );
        } else {
            return (
                <div className='results-text'>A tie! Everybody wins!</div>
            );
        }
    };

    renderResults = () => {
        const {gameIsOver, players, playerCount} = this.props;

        if (gameIsOver) {
            if (playerCount === 1) {
                const thisPlayer = players[0];
                return (
                    <div className='results-text'>Your final score is: {thisPlayer.finalScore}, well done!</div>
                );
            } else {
                return (
                    <div>
                        {this.renderMultipleResults(players)}
                        {this.renderWinnerText(players)}
                    </div>
                );
            }

        }

    };


    renderGame = () => {
        return (
            <div className='container game-container'>
                {this.renderPlayers()}
                {this.renderResults()}
            </div>
        );
    };


    render() {
        const {playerCountFinalized, playerNamesFinalized} = this.props;

        if (!playerCountFinalized || !playerNamesFinalized) {
            return (
                <Redirect to="/"/>
            );
        }

        return (
            <div>
                {this.renderGame()}
            </div>
        )
    }

}

function mapStateToProps(state) {
    const {playerCount, playerCountFinalized, players, playerNamesFinalized, playerNamesHaveError, playerTurn, frameNumber, attemptNumber, enteredScore, currentFrameIsValid, gameIsOver} = state.game;

    return {
        playerCount,
        playerCountFinalized,
        players,
        playerNamesFinalized,
        playerNamesHaveError,
        playerTurn,
        frameNumber,
        attemptNumber,
        enteredScore,
        currentFrameIsValid,
        gameIsOver
    };
}

export default connect(mapStateToProps, {updateEnteredScore, submitScore})(Game);