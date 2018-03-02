import React from 'react';
import {Button} from 'react-bootstrap';

import PlayerResults from './PlayerResultsComponent';

const PlayerContainer = ({name, frameNumber, attemptNumber, results, isThisPlayersTurn, onInputChange, score, onSubmitScore, currentFrameIsValid, gameIsOver}) => {

    const renderResults = () => {
        return (
            <PlayerResults
                results={results}
            />
        );
    };

    const renderError = () => {
        if (!currentFrameIsValid) {
            return (
                <div className='error-text'>
                    Sorry, that was an invalid entry. Please try again.
                </div>
            )
        }
    };

    const renderInputSection = () => {
        if (isThisPlayersTurn && !gameIsOver) {
            return (
                <div>
                    <p className='prompt-text'>Frame {frameNumber} attempt {attemptNumber}, what do you bowl?</p>
                    <form onSubmit={onSubmitScore}>
                        <div className="form-group">
                            <input
                                type="number"
                                className="form-control score-input"
                                placeholder="Score"
                                value={score}
                                onChange={onInputChange}
                                autoFocus
                            />

                            <Button type="submit" bsStyle="primary">
                                Submit Score
                            </Button>

                            {renderError()}
                        </div>
                    </form>
                </div>
            );
        }

    };


    return (
        <div className=''>
            <h3>{name}</h3>
            {renderResults()}
            {renderInputSection()}
        </div>
    )

};

export default PlayerContainer;