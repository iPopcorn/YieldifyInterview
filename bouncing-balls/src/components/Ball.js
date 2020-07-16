import React, {Component} from 'react';

class Ball extends Component {
    constructor(props) {
        super(props);
        this.state = this.setInitialState(props);
    }

    componentDidMount() {
        this.animationID = setInterval(() => this.setPosition(), 10);
        console.dir(this.state.boundaries);
    }

    /**
     * Sets the initial state by randomly choosing the direction and speed.
     * @param {object} props The props passed in to the constructor of this object.
     */
    setInitialState(props) {
        const horizontalDirectionThreshold = 5;
        const verticalDirectionThreshold = 5;
        const initialSpeed = this.setSpeed();
        
        return {
            positionX: props.positionX,
            positionY: props.positionY,
            boundaries: props.boundaries,
            movingForward: (this.getRandom() > horizontalDirectionThreshold) ? true : false,
            // movingUp: (this.getRandom() > verticalDirectionThreshold) ? true : false,
            movingUp: true,
            initialSpeed: initialSpeed,
            currentSpeed: initialSpeed,
            distanceTraveled: 0
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
     * Sets a new speed based on the distance traveled and the current direction. Returns a number that represents 
     * the new speed.
     * @param {object} state The current state of the ball
     */
    updateSpeed(state) {
        let newSpeed;

        // Slow down if moving up, otherwise speed up
        (state.movingUp) ? newSpeed = state.currentSpeed - 1 : newSpeed = state.currentSpeed + 1;

        return newSpeed;
    }
    
    /**
     * Calculates the new position of the ball on each tick. Copies the current state object and sets new values relating to 
     * position, speed, and distance. Finally, calls setState() with the new state object which triggers react to render the ball again.
     */
    setPosition() {
        let newState = {...this.state}
        let newPositionX = (this.state.movingForward) ? this.state.positionX + 1 : this.state.positionX - 1;
        let newPositionY = this.state.positionY;

        (this.state.movingUp) ? newPositionY -= this.state.currentSpeed : newPositionY += this.state.currentSpeed;

        newState.positionX = newPositionX;
        newState.positionY = newPositionY;
        newState.distanceTraveled += 1;

        if(newState.distanceTraveled % 5 === 0) {
            newState.currentSpeed = this.updateSpeed(newState);

            if(newState.currentSpeed === 0) {
                newState.movingUp = !newState.movingUp;
            }
        }

        newState = this.handleBoundaries(newState);

        this.setState(newState);
    }

    /**
     * Checks if the ball is at any of the container boundaries. Switches the direction and calculates a new speed if so.
     */
    handleBoundaries(state) {
        // The minimum speed to calculate a bounce for. Using a lower threshold causes the ball to bounce forever.
        const speedThreshold = 4;
        let newState = {...state};

        if(state.positionX >= state.boundaries.right || state.positionX <= state.boundaries.left) {
            newState.movingForward = !state.movingForward;
        }

        if(state.positionY <= state.boundaries.top) {
            newState.movingUp = !state.movingUp;
        } else if(state.positionY >= state.boundaries.bottom) {
            // Set position just inside of the boundary so that the method doesn't get called again in case the position was outside of the boundary
            newState.positionY = state.boundaries.bottom - 1;
            
            if(Math.abs(state.currentSpeed) >= speedThreshold) {
                newState.movingUp = !state.movingUp;

                // Reduce the speed by about 50% until the speed threshold is hit, then reduce the speed to 0
                newState.currentSpeed = state.currentSpeed - Math.floor(state.currentSpeed / 2);
            } else {
                newState.movingUp = false;
                newState.currentSpeed = 0;
            }
        }

        return newState;
    }
    
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

        return (
            <span style={myStyle}></span>
        )
    }

}

export default Ball;
