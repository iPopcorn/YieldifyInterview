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
        this.removeBall = this.removeBall.bind(this);
    }

    componentDidMount() {
        const boundingRectangle = this.containerRef.current.getBoundingClientRect();
        
        let boundaries = {
            left: boundingRectangle.left,
            right: boundingRectangle.right - 15,
            top: boundingRectangle.top,
            bottom: boundingRectangle.bottom - 15
        }

        this.setState((state) => {
            state.boundaries = boundaries
        });

        console.dir(boundaries);
    }

    createBall = (e) => {
        e.persist();
        const myKey = `ball_${this.state.count}`
        
        let newBall = [{
            key: myKey,
            ballKey: myKey,  // key is a special prop which is not accesible in the child
            positionX: e.pageX,
            positionY: e.pageY,
            boundaries: this.state.boundaries,
            removeBall: this.removeBall
        }];
        
        let newBalls = [...this.state.balls, ...newBall]
        let newState = {
            count: this.state.count + 1,
            balls: newBalls
        }
        
        this.setState(newState);
    }

    /**
     * Removes the ball based on the key
     * @param {string} key The key of the ball to remove
     */
    removeBall(key) {
        let newBalls = this.state.balls.filter((ball) => {return ball.key !== key; });

        this.setState({balls: newBalls});
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
