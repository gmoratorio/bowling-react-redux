import React from 'react';
import {Button} from 'react-bootstrap';

import _ from 'lodash';

const PlayerInput = ({players, onInputChange, onSubmit, playerNamesHaveError}) => {

    const renderPlayerInputs = () => {

        return _.map(players, (player, index) => {
            const playerNumberText = index === 0 ? 'One' : 'Two';

            return (
                <div className="form-group" key={index}>
                    <label>Player {playerNumberText}</label>
                    <input type="text" className="form-control" placeholder="Player Name" value={player.name}
                           onChange={(e) => {
                               onInputChange({value: e.target.value, index})
                           }}/>
                </div>
            );
        });

    };

    const renderError = () => {
        if (playerNamesHaveError) {
            return (
                <div className='error-text'>
                    Please enter valid user names.
                </div>
            )
        }
    };


    return (
        <div>
            <form onSubmit={onSubmit}>
                {renderPlayerInputs()}

                <Button type="submit" bsStyle="primary">
                    Submit Player Names
                </Button>
            </form>

            {renderError()}
        </div>
    )

};

export default PlayerInput;