/**
 * This suite tests the main responsibility of the Container component. That is, to create balls when the
 * user clicks within the component. It tests that a single ball is created, and also that multiple balls are
 * created.
 */
import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Container from './Container';

describe('Container', () => {
    const getContainer = () => {
        render(<Container/>);
        
        return screen.getByTestId('myContainer');
    }
    
    describe('When container is clicked', () => {
        it('should render a ball', () => {
            const myContainer = getContainer();
            userEvent.click(myContainer);

            expect(myContainer.hasChildNodes()).toBe(true);
        });
    });

    describe('When container is clicked multiple times', () => {
        it('should render a ball for each click', () => {
            const numBalls = 5;
            const myContainer = getContainer();

            for(let i = 0; i < numBalls; i++) {
                userEvent.click(myContainer);
            }

            expect(myContainer.hasChildNodes()).toBe(true);
            expect(myContainer.childElementCount).toBe(numBalls);
        })
    })
});