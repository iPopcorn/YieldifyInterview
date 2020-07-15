import React, {Component} from 'react';

class Ball extends Component {
    constructor(props) {
        super(props);
        this.state = {
            positionX: props.positionX,
            positionY: props.positionY,
            boundaries: props.boundaries,
            movingForward: true,
            movingUp: true,
            minimumDistance: 25
        }
    }

    componentDidMount() {
        this.animationID = setInterval(() => this.getPositionQuadratic(), 10);
        console.dir(this.state.boundaries);
    }

    scaleY(rawNumber) {
        const minY = this.state.boundaries.top;
        const maxY = this.state.boundaries.bottom;
        // minPossible = 0;
        const maxPossible = Math.pow(this.state.boundaries.right, 2);

        return (maxY - minY) * rawNumber / maxPossible + minY;
    }

    switchDirectionVertical() {
        const threshold = 9;
        const switchFactor = Math.floor((Math.random() * 10) + 1); // get a number between 1 and 10

        // randomly switch direction at a certain threshold
        return (switchFactor > threshold) ? !this.state.movingUp : this.state.movingUp;
    }
    
    getPositionQuadratic() {
        let newState = {...this.state}
        let newPositionX = this.state.positionX + 1;
        let newPositionY = this.state.positionY;

        if (this.state.movingUp) {
            newPositionY -= 2;

            // randomly switch direction after a minimum distance has been traveled
            (newState.minimumDistance > 0) ? newState.minimumDistance -= 1 : newState.movingUp = this.switchDirectionVertical();
        } else {
            newPositionY += 4;
        }

        // let newPositionY = (this.state.movingUp) ? this.state.positionY - 2 : this.state.positionY + 4;
        // let newPositionY = this.scaleY(2 * (Math.pow(this.state.positionX, 2)));  // Apply simple -x^2 function and scale it

        newState.positionX = newPositionX;
        newState.positionY = newPositionY;

        // console.log(`x: ${newPositionX}, y: ${newPositionY}`);

        this.setState(newState);
    }

    getPositionHorizontal() {
        let newState = {...this.state}
        let newPositionX = (this.state.movingForward) ? this.state.positionX + 5 : this.state.positionX - 5;

        if (newPositionX >= this.state.boundaries.right || newPositionX <= this.state.boundaries.left) {
            newState.movingForward = !this.state.movingForward;
        }

        newState.positionX = newPositionX;

        this.setState(newState);
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
