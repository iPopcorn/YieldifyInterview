/**
 * This class is responsible for everything related to animating the balls.
 * Each ball animates itself by leveraging the event loop to call a setPosition() method on a set interval.
 */
import React, {Component} from 'react';

class Ball extends Component {
    constructor(props) {
        super(props);
        this.state = this.setInitialState(props);
        this.key = props.ballKey;
        this.mounted = false;
    }

    /**
     * React lifecycle method. This method begins the animation by calling setPosition() on a given interval.
     */
    componentDidMount() {
        this.mounted = true;
        this.animationID = setInterval(() => this.setPosition(), 17);  // 17ms interval to approximate a 60fps animation
    }

    /**
     * React lifecycle method. This method releases the setPosition() call.
     */
    componentWillUnmount() {
        this.mounted = false;
        clearInterval(this.animationID);
    }

    /**
     * Sets the initial state by randomly choosing the direction and speed.
     * @param {object} props The props passed in to the constructor of this object.
     */
    setInitialState(props) {
        /**
         * Changing these values affect how often a ball starts moving in a given direction.
         * Lower horizontalDirectionThreshold means the ball will start by moving to the right more often than not.
         * Lower verticalDirectionThreshold means the ball will start by moving up more often than not.
         */
        const horizontalDirectionThreshold = 5;
        const verticalDirectionThreshold = 5;
        
        return {
            positionX: props.positionX,
            positionY: props.positionY,
            boundaries: props.boundaries,
            movingForward: (this.getRandom() > horizontalDirectionThreshold) ? true : false,
            movingUp: (this.getRandom() > verticalDirectionThreshold) ? true : false,
            currentSpeedY: this.setSpeed(),
            currentSpeedX: this.setSpeed(),
            distanceTraveled: 0,
            isMoving: true
        }
    }

    /**
     * Helper method for randomly choosing speed and direction. Returns a number between 1 and 10 inclusive.
     */
    getRandom() {
        return Math.floor((Math.random() * 10) + 1);
    }

    /**
     * Sets the speed based on a random number.
     */
    setSpeed() {
        const speedChoice = this.getRandom();
        const slow = 3;
        const medium = 6;
        const fast = 9;
        
        if (speedChoice < 4) {
            return slow;
        } else if (speedChoice < 7) {
            return medium;
        } else {
            return fast;
        }
    }

    /**
     * Sets a new speed based on the current direction. Returns a number that represents the new speed.
     * @param {object} state The current state of the ball
     */
    updateSpeedY(state) {
        let newSpeed;

        // Slow down if moving up, otherwise speed up
        (state.movingUp) ? newSpeed = state.currentSpeedY - 1 : newSpeed = state.currentSpeedY + 1;

        return newSpeed;
    }

    /**
     * Sets a new speed in the X direction. The speed is updated based on the position of the ball. It only reduces the speed 
     * if the ball is rolling at the bottom of the container.
     * @param {object} state The current state of the ball
     */
    updateSpeedX(state) {
        const speedYThreshold = 2;  // Even when the ball is rolling at the bottom, sometimes it has a Y speed of 1.
        
        /**
         * How far the ball should roll before changing the speed.
         * The higher this number, the longer the ball will roll before stopping.
         */
        const travelDistanceThreshold = 20;

        if(
            this.isAtBottom(state) && 
            !state.movingUp && 
            state.currentSpeedY < speedYThreshold && 
            state.currentSpeedX > 0 && 
            state.distanceTraveled % travelDistanceThreshold === 0) {
            
            return state.currentSpeedX - 1;
        } else {
            return state.currentSpeedX;
        }
    }
    
    /**
     * Calculates the new position of the ball on each interval. Copies the current state object and sets new values relating to 
     * position, speed, and distance. Finally, calls setState() with the new state object which triggers react to render the ball again.
     */
    setPosition() {
        let newState = {...this.state}
        let newPositionX = this.state.positionX;
        let newPositionY = this.state.positionY;

        /**
         * Use the speed to determine how much the position should change.
         * Evaluate the direction to determine if the change should be positive or negative.
         * The signs for the Y position are counterintuitive because the smaller Y coordinates are near the top of the screen.
         */
        (this.state.movingForward) ? newPositionX += this.state.currentSpeedX : newPositionX -= this.state.currentSpeedX;
        (this.state.movingUp) ? newPositionY -= this.state.currentSpeedY : newPositionY += this.state.currentSpeedY;

        newState.positionX = newPositionX;
        newState.positionY = newPositionY;
        newState.distanceTraveled += 1;  // distanceTraveled determines when the speed is updated

        if(newState.distanceTraveled % 5 === 0) {  // update the speed every 5 iterations
            newState.currentSpeedY = this.updateSpeedY(newState);
            newState.currentSpeedX = this.updateSpeedX(newState);

            if(newState.currentSpeedY === 0 && !this.isAtBottom(newState)) {  // At the height of the curve, change the direction
                newState.movingUp = !newState.movingUp;
            }
        }

        newState = this.handleBoundaries(newState);
        newState.isMoving = this.isMoving(newState);

        if(!newState.isMoving) {  // Remove the ball from the app once it stops moving
            this.props.removeBall(this.key);
        }

        if(this.mounted) {  // Don't attempt to set state after ball has unmounted, this fixes the memory leak warning.
            this.setState(newState);
        }
    }

    /**
     * Checks if the ball is at the bottom of the container
     * @param {Object} state The current state of the ball
     */
    isAtBottom(state) {
        return (state.boundaries.bottom - state.positionY === 1) ? true : false;
    }

    /**
     * Checks if the ball is still moving. The ball is considered to be moving if either the Y speed is above the threshold 
     * or the X speed is greater than 0.
     * @param {object} state The current state of the ball
     */
    isMoving(state) {
        const speedYThreshold = 2;
        return (state.currentSpeedY < speedYThreshold && state.currentSpeedX === 0) ? false : true;
    }

    /**
     * Checks if the ball is at any of the container boundaries. Switches the direction and calculates a new speed if so.
     * @param {object} state The current state of the ball
     */
    handleBoundaries(state) {
        // The minimum speed to calculate a bounce for. Using a lower threshold causes the ball to bounce forever.
        const speedThreshold = 4;
        let newState = {...state};

        if(state.positionX >= state.boundaries.right || state.positionX <= state.boundaries.left) {  // Reverse the direction if the ball is at a boundary
            newState.movingForward = !state.movingForward;

            // Fix for the edge case where the ball can vibrate around the boundary
            if(state.positionX >= state.boundaries.right) {
                newState.positionX = state.boundaries.right - 1;
            } else if(state.positionX <= state.boundaries.left) {
                newState.positionX = state.boundaries.left + 1;
            }
        }

        if(state.positionY <= state.boundaries.top) {
            newState.movingUp = !state.movingUp;
            
            // Set position just inside of the boundary so that the method doesn't get called again in case the position was outside of the boundary
            newState.positionY = state.boundaries.top + 1;
        } else if(state.positionY >= state.boundaries.bottom) {
            
            // Set position just inside of the boundary so that the method doesn't get called again in case the position was outside of the boundary
            newState.positionY = state.boundaries.bottom - 1;
            
            if(Math.abs(state.currentSpeedY) >= speedThreshold) {
                newState.movingUp = !state.movingUp;

                // Reduce the speed by about 50% until the speed threshold is hit, then reduce the speed to 0
                newState.currentSpeedY = state.currentSpeedY - Math.floor(state.currentSpeedY / 2);
            } else {
                newState.movingUp = false;
                newState.currentSpeedY = 0;
            }
        }

        return newState;
    }
    
    /**
     * React lifecycle method. This method shows the ball on the screen. It is called when the ball is instantiated, 
     * and also anytime the state is updated. The animation works because the state is constantly updated with new positions,
     * and the positions are used in the css rules.
     */
    render() {
        let myStyle = {
            borderStyle: "solid",
            height: "15px",
            width: "15px",
            backgroundColor: "red",
            borderRadius: "50%",
            position: "fixed",
            top: this.state.positionY,
            left: this.state.positionX
        }

        if(this.state.isMoving) {
            return (
                <span style={myStyle}></span>
            )
        } else {
            return null;
        }
    }

}

export default Ball;
