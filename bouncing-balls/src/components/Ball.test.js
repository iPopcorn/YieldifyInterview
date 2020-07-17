/**
 * This suite tests functionality of the Ball component. For now it tests that the ball has the correct position
 * when it is instantiated, and that it updates the position over time.
 * 
 * In order to test more specific situations, I would have to modify the Ball component to allow direction and
 * speed to be set manually instead of randomly.
 */
import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import Ball from './Ball';

jest.useFakeTimers();

describe('Ball', () => {
    const getBall = () => {
        const testProps = initProps();
        const { container } = render(<Ball {...testProps}/>);

        return container.querySelector('span');
    }

    const initProps = () => {
        const myKey = 'ball_0';
        const removeBall = () => true;
        const boundaries = {
            left: 0,
            right: 200,
            top: 0,
            bottom: 200
        }

        return {
            key: myKey,
            ballKey: myKey,
            positionX: 100,
            positionY: 100,
            boundaries: boundaries,
            removeBall: removeBall
        }
    }
    
    describe('When ball is rendered', () => {
        it('should have the given position', () => {
            const expectedTop = '100px';
            const expectedLeft = '100px';

            const ball = getBall();

            const actualTop = ball.style._values.top;
            const actualLeft = ball.style._values.left;

            expect(expectedTop).toEqual(actualTop);
            expect(expectedLeft).toEqual(actualLeft);
        });

        it('should update the position', () => {
            const startTop = '100px';
            const startLeft = '100px';
            const ball = getBall();

            jest.advanceTimersByTime(1000);

            const actualTop = ball.style._values.top;
            const actualLeft = ball.style._values.left;

            expect(actualTop).not.toEqual(startTop);
            expect(actualLeft).not.toEqual(startLeft);
        });
    });
});