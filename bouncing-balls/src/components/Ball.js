import React, {Component} from 'react';

class Ball extends Component {
    constructor(props) {
        super(props);
        this.state = {
            positionX: props.positionX,
            positionY: props.positionY,
            boundaries: props.boundaries,
            movingForward: true
        }
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.getPosition(), 10);
    }

    getPosition() {
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
