import _ from 'lodash';

import {
    PLAYER_COUNT_FINALIZED,
    PLAYER_COUNT_UPDATED,
    PLAYER_NAME_UPDATED,
    PLAYER_NAMES_FINALIZED,
    ENTERED_SCORE_UPDATED,
    SCORE_SUBMITTED
} from '../actions/types';

import {ROUND_BONUS, BONUS_DISPLAY} from '../constants';

const INITIAL_STATE = {
    frameNumber: 1,
    attemptNumber: 1,
    playerTurn: 1,
    totalFrames: 10,
    playerCount: 0,
    players: [],
    playerCountFinalized: false,
    playerNamesFinalized: false,
    playerNamesHaveError: false,
    currentFrameIsValid: true,
    gameIsOver: false,
    enteredScore: ''

};

const createPlaceholderPlayerObjects = (playerCount) => {
    return _.times(playerCount, () => {
        return {
            name: '',
            results: [
                {firstAttempt: {score: 0, display: 0}, secondAttempt: {score: 0, display: 0}},
                {firstAttempt: {score: 0, display: 0}, secondAttempt: {score: 0, display: 0}},
                {firstAttempt: {score: 0, display: 0}, secondAttempt: {score: 0, display: 0}},
                {firstAttempt: {score: 0, display: 0}, secondAttempt: {score: 0, display: 0}},
                {firstAttempt: {score: 0, display: 0}, secondAttempt: {score: 0, display: 0}},
                {firstAttempt: {score: 0, display: 0}, secondAttempt: {score: 0, display: 0}},
                {firstAttempt: {score: 0, display: 0}, secondAttempt: {score: 0, display: 0}},
                {firstAttempt: {score: 0, display: 0}, secondAttempt: {score: 0, display: 0}},
                {firstAttempt: {score: 0, display: 0}, secondAttempt: {score: 0, display: 0}},
                {
                    firstAttempt: {score: 0, display: 0},
                    secondAttempt: {score: 0, display: 0},
                    thirdAttempt: {score: 0, display: 0}
                }
            ],
            finalScore: 0
        };
    });
};

const updatePlayerNameInArray = ({newPlayerName, passedIndex, players}) => {
    return _.map(players, (player, index) => {
        if (index === passedIndex) {
            player.name = newPlayerName;
        }

        return player;
    });

};

const updatePlayerFrameInArray = ({newPlayerFrame, playerIndex, frameIndex, players}) => {
    let playersArrayClone = _.cloneDeep(players);

    playersArrayClone[playerIndex]['results'][frameIndex] = newPlayerFrame;

    return playersArrayClone;
};

const validatePlayerNames = (players) => {
    return _.every(players, ({name}) => {
        return name !== '' && _.isString(name);
    });

};

const getNextFrameAttemptAndPlayerTurn = ({frameNumber, attemptNumber, playerTurn, playerCount}, currentFrame) => {
    let nextPlayerTurn = 0;
    let nextFrameNumber = 0;
    let nextAttemptNumber = 0;
    let gameIsOver = true;

    if (!currentFrame.frameStillInPlay) {
        nextAttemptNumber = 1;

        if (playerCount === 2) {
            nextPlayerTurn = playerTurn === 1 ? 2 : 1;
            nextFrameNumber = playerTurn === 1 ? frameNumber : frameNumber + 1;
        } else {
            nextPlayerTurn = playerTurn;
            nextFrameNumber = frameNumber + 1;
        }

        gameIsOver = nextFrameNumber > 10 ? true : false;
    } else {
        nextPlayerTurn = playerTurn;
        nextFrameNumber = frameNumber;
        nextAttemptNumber = attemptNumber + 1;
        gameIsOver = false;
    }

    return {
        nextPlayerTurn,
        nextFrameNumber,
        nextAttemptNumber,
        gameIsOver
    }
};


const scoreIsValidAndWasUpdated = ({state, providedFrame}) => {
    const providedFrameClone = _.cloneDeep(providedFrame);
    providedFrameClone.frameStillInPlay = true;

    const {frameNumber, attemptNumber, enteredScore} = state;
    const hasExtraAttempt = frameNumber === 10;

    const score = Number.parseInt(enteredScore, 10);

    if (score > 10) {
        return false;
    }

    if (attemptNumber === 1) {
        if (score < 10) {
            providedFrameClone.firstAttempt.score = score;
            providedFrameClone.firstAttempt.display = score;

            return providedFrameClone;
        } else if (score === 10) {
            providedFrameClone.firstAttempt.score = score;
            providedFrameClone.firstAttempt.display = BONUS_DISPLAY.STRIKE;
            if (!hasExtraAttempt) {
                providedFrameClone.frameStillInPlay = false;
                providedFrameClone.frameBonus = ROUND_BONUS.STRIKE;
            } else {
                providedFrameClone.frameStillInPlay = true;
            }

            return providedFrameClone;
        } else {
            return false;
        }
    } else if (attemptNumber === 2) {
        const totalScore = providedFrameClone.firstAttempt.score + score;

        if (totalScore < 10) {
            providedFrameClone.secondAttempt.score = score;
            providedFrameClone.secondAttempt.display = score;
            providedFrameClone.frameStillInPlay = false;

            return providedFrameClone;
        } else if (totalScore === 10) {
            if (providedFrameClone.firstAttempt.score === 10) {
                // it's the last frame, you got a strike on the first attempt
                // and you got a gutter on this attempt
                providedFrameClone.secondAttempt.score = score;
                providedFrameClone.secondAttempt.display = score;
                providedFrameClone.frameStillInPlay = false;
                return providedFrameClone;
            } else {
                // you got a spare
                providedFrameClone.secondAttempt.score = score;
                providedFrameClone.secondAttempt.display = BONUS_DISPLAY.SPARE;

                if (!hasExtraAttempt) {
                    providedFrameClone.frameStillInPlay = false;
                    providedFrameClone.frameBonus = ROUND_BONUS.SPARE;
                } else {
                    providedFrameClone.frameStillInPlay = true;
                }

                return providedFrameClone;
            }
        } else if (totalScore < 20) {
            if (providedFrameClone.firstAttempt.score === 10) {
                // it's the last frame, you got a strike on the first attempt
                // and you got some points on this attempt
                // attempt stays open since it's the last frame
                providedFrameClone.secondAttempt.score = score;
                providedFrameClone.secondAttempt.display = score;

                return providedFrameClone;
            } else {
                // no mathematical way to get 10 < score < 20 without a strike on the first attempt
                return false;
            }
        } else if (totalScore === 20) {
            // it's the last frame, you got a strike on the first attempt
            // and you got another strike on this attempt
            providedFrameClone.secondAttempt.score = score;
            providedFrameClone.secondAttempt.display = BONUS_DISPLAY.STRIKE;
            return providedFrameClone;
        } else {
            return false;
        }

    } else if (attemptNumber === 3) {
        providedFrameClone.thirdAttempt.score = score;
        const totalScore = providedFrameClone.secondAttempt.score + score;

        if (score === 10) {
            if (providedFrameClone.secondAttempt.display === BONUS_DISPLAY.STRIKE || providedFrameClone.secondAttempt.display === BONUS_DISPLAY.SPARE) {
                // you closed out the last attempt, so this time you got a strike
                providedFrameClone.thirdAttempt.display = BONUS_DISPLAY.STRIKE;
            } else {
                // you got a gutter last time and closed it out this time with a spare
                providedFrameClone.thirdAttempt.display = BONUS_DISPLAY.SPARE;
            }
        } else if (totalScore === 10) {
            if (score === 0) {
                // you got a strike last time and a gutter this time
                providedFrameClone.thirdAttempt.display = score;
            } else {
                // you got a spare
                providedFrameClone.thirdAttempt.display = BONUS_DISPLAY.SPARE;
            }
        }

        providedFrameClone.frameStillInPlay = false;
        return providedFrameClone;
    }
};

const totalFrameScore = (frame) => {
    if (frame.thirdAttempt) {
        return frame.firstAttempt.score + frame.secondAttempt.score + frame.thirdAttempt.score;
    } else {
        return frame.firstAttempt.score + frame.secondAttempt.score;
    }
};

const getFrameScoreWithBonus = (frame, index, playerResults) => {
    const frameNumber = index + 1;
    let bonusScores = 0;

    if (frameNumber === 10 || !frame.frameBonus) {
        return totalFrameScore(frame);
    } else if (frame.frameBonus === ROUND_BONUS.SPARE) {
        const nextFrameFirstAttempt = playerResults[index + 1].firstAttempt.score;
        return totalFrameScore(frame) + nextFrameFirstAttempt;
    } else if (frame.frameBonus === ROUND_BONUS.STRIKE) {
        const firstBonusIndex = index + 1;
        const firstBonusFrame = playerResults[firstBonusIndex];

        if (frameNumber === 9) {
            bonusScores = firstBonusFrame.firstAttempt.score + firstBonusFrame.secondAttempt.score;
        } else {

            if (firstBonusFrame.frameBonus === ROUND_BONUS.STRIKE) {
                const secondBonusIndex = firstBonusIndex + 1;
                let secondBonusFrame = playerResults[secondBonusIndex];

                bonusScores = totalFrameScore(firstBonusFrame) + secondBonusFrame.firstAttempt.score;
            } else {
                bonusScores = totalFrameScore(firstBonusFrame);
            }
        }

        return totalFrameScore(frame) + bonusScores;
    }
};

const getFinalScore = (player) => {
    const playerResults = player.results;

    return playerResults.reduce((acc, frame, index) => {
        return acc + getFrameScoreWithBonus(frame, index, playerResults);
    }, 0);
};

const returnPlayersWithFinalScores = (players) => {
    return _.map(players, player => {
        player.finalScore = getFinalScore(player);

        return player;
    });
};

export default (state = INITIAL_STATE, action) => {
    const {type, payload} = action;

    switch (type) {
        case PLAYER_COUNT_UPDATED:
            const {playerCount} = payload;
            return {...state, playerCount};

        case PLAYER_COUNT_FINALIZED:
            const placeholderPlayers = createPlaceholderPlayerObjects(state.playerCount);
            return {...state, playerCountFinalized: true, players: placeholderPlayers}


        case PLAYER_NAME_UPDATED:
            const {name, index} = payload;
            const players = updatePlayerNameInArray({newPlayerName: name, passedIndex: index, players: state.players})

            return {...state, players};

        case PLAYER_NAMES_FINALIZED:
            const playerNamesFinalized = validatePlayerNames(state.players);

            return {...state, playerNamesFinalized, playerNamesHaveError: !playerNamesFinalized};

        case ENTERED_SCORE_UPDATED:
            const {enteredScore} = payload;
            return {...state, enteredScore};

        case SCORE_SUBMITTED:
            const playerArrayIndex = state.playerTurn - 1;
            const currentPlayer = state.players[playerArrayIndex];
            const currentFrameArrayIndex = state.frameNumber - 1;
            const providedFrame = currentPlayer.results[currentFrameArrayIndex];


            const updatedFrame = scoreIsValidAndWasUpdated({state, providedFrame});
            if (updatedFrame === false) {
                return {...state, currentFrameIsValid: false, enteredScore: ''};
            } else {
                const updatedPlayersArray = updatePlayerFrameInArray({
                    newPlayerFrame: updatedFrame,
                    playerIndex: playerArrayIndex,
                    frameIndex: currentFrameArrayIndex,
                    players: state.players
                });

                const {nextPlayerTurn, nextFrameNumber, nextAttemptNumber, gameIsOver} = getNextFrameAttemptAndPlayerTurn(state, updatedFrame);

                const finalPlayers = gameIsOver ? returnPlayersWithFinalScores(updatedPlayersArray) : updatedPlayersArray;

                return {
                    ...state,
                    players: finalPlayers,
                    frameNumber: nextFrameNumber,
                    attemptNumber: nextAttemptNumber,
                    playerTurn: nextPlayerTurn,
                    currentFrameIsValid: true,
                    enteredScore: '',
                    gameIsOver
                };
            }

        default:
            return state;
    }


};