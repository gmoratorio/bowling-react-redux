import {
    PLAYER_COUNT_UPDATED,
    PLAYER_COUNT_FINALIZED,
    PLAYER_NAME_UPDATED,
    PLAYER_NAMES_FINALIZED,
    ENTERED_SCORE_UPDATED,
    SCORE_SUBMITTED
} from './types';

export const updatePlayerCount = ({playerCount}) => {
    return {
        type: PLAYER_COUNT_UPDATED,
        payload: {playerCount}
    };
};

export const finalizePlayerCount = () => {
    return {
        type: PLAYER_COUNT_FINALIZED
    };
};

export const updatePlayerName = ({name, index}) => {
    return {
        type: PLAYER_NAME_UPDATED,
        payload: {
            index,
            name
        }
    }
};

export const finalizePlayerNames = () => {
    return {
        type: PLAYER_NAMES_FINALIZED
    }
};

export const updateEnteredScore = ({enteredScore}) => {
    return {
        type: ENTERED_SCORE_UPDATED,
        payload: {enteredScore}
    };
};

export const submitScore = () => {
    return {
        type: SCORE_SUBMITTED
    }
};


