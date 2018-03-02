import React from 'react';
import {Grid} from 'react-bootstrap';

import _ from 'lodash';

import BowlingFrame from './BowlingFrameComponent';

const PlayerResults = ({results}) => {

    const renderBowlingFrames = () => {
        return _.map(results, (frame, index) => {
            const {firstAttempt, secondAttempt, thirdAttempt} = frame;

            return (
                <BowlingFrame
                    key={index}
                    number={index + 1}
                    firstAttempt={firstAttempt}
                    secondAttempt={secondAttempt}
                    thirdAttempt={thirdAttempt}
                />
            );
        });
    };


    return (
        <Grid className='container results-container'>
            {renderBowlingFrames()}
        </Grid>
    )

};

export default PlayerResults;