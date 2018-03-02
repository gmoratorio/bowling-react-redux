import React from 'react';
import {Row, Col} from 'react-bootstrap';


const BowlingFrame = ({number, frameBonus, attempt, hasExtraAttempt, firstAttempt, secondAttempt, thirdAttempt}) => {

    const renderFrame = () => {
        if(number === 10){
            return (

                <div className='main-frame-box text-center container'>
                    <Row>
                        <Col className='col-12 number-divider'>{number}</Col>
                    </Row>
                    <Row>
                        <Col className='col-4 top-row'>{firstAttempt.display}</Col>
                        <Col className='col-4 top-row second-box'>{secondAttempt.display}</Col>
                        <Col className='col-4 top-row second-box'>{thirdAttempt.display}</Col>
                    </Row>
                </div>
            );
        }

        return (
            <div className='main-frame-box text-center container'>
                <Row>
                    <Col className='col-12 number-divider'>{number}</Col>
                </Row>
                <Row>
                    <Col className='col-6 top-row'>{firstAttempt.display}</Col>
                    <Col className='col-6 top-row second-box'>{secondAttempt.display}</Col>
                </Row>
            </div>
        );
    };


    return (
        <div>
            {renderFrame()}
        </div>
    )

};

export default BowlingFrame;