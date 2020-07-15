import React, {Component} from 'react';
import Ball from './Ball';

class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            balls: [],
            boundaries: {}
        }
        this.containerRef = React.createRef();
    }

    componentDidMount() {
        const boundingRectangle = this.containerRef.current.getBoundingClientRect();
        
        let boundaries = {
            left: boundingRectangle.left,
            right: boundingRectangle.right - 15,
            top: boundingRectangle.top,
            bottom: boundingRectangle.bottom
        }

        this.setState((state) => {
            state.boundaries = boundaries
        });
    }

    createBall = (e) => {
        e.persist();
        
        let newBall = [{
            key: `ball_${this.state.count}`,
            positionX: e.pageX,
            positionY: e.pageY,
            boundaries: this.state.boundaries
        }];
        
        let newBalls = [...this.state.balls, ...newBall]
        let newState = {
            count: this.state.count + 1,
            balls: newBalls
        }
        
        this.setState(newState);
    }
    
    render() {
        const myStyle = {
            borderStyle: "solid",
            height: "420px",
            width: "75%",
            margin: "50px",
            position: "relative"
        }

        return (
            <div 
                style={myStyle}
                onClick={this.createBall}
                ref={this.containerRef}>
                {
                    this.state.balls.map((item) => (
                        <Ball {...item}></Ball>
                    ))
                }
            </div>
        )
    }

}

export default Container;
