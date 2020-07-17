/**
 * This class has 3 main responsibilities:
 *  - Add balls to the app
 *  - Remove balls from the app
 *  - Define the boundaries for the balls in the app
 */
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

        // Create a reference that will be used later to get the <div> that encapsulates this component.
        this.containerRef = React.createRef();

        // Allow the child to call this method with a reference to the container.
        this.removeBall = this.removeBall.bind(this);
    }

    /**
     * React lifecycle hook. After the container is rendered, get the boundaries and add them to the state.
     */
    componentDidMount() {
        const boundingRectangle = this.containerRef.current.getBoundingClientRect();
        const borderOffset = 15;  // offset the borders so that the ball appears to bounce off the walls.
        
        const boundaries = {
            left: boundingRectangle.left,
            right: boundingRectangle.right - borderOffset,
            top: boundingRectangle.top,
            bottom: boundingRectangle.bottom - borderOffset
        }

        this.setState((state) => {
            state.boundaries = boundaries
        });
    }

    /**
     * Adds a new ball to screen. Works by adding the ball to the state, and then calling setState() which
     * causes react to redraw the component and all the children. This method is called when the user clicks
     * within the container.
     * @param {*} e The event object that triggered this callback.
     */
    createBall = (e) => {
        e.persist();  // persist the virtual event object, otherwise all the data inside will be null.
        const myKey = `ball_${this.state.count}`
        
        const newBall = [{
            key: myKey,
            ballKey: myKey,  // key is a special prop which is not accesible in the child
            positionX: e.pageX,
            positionY: e.pageY,
            boundaries: this.state.boundaries,
            removeBall: this.removeBall
        }];
        
        /**
         * Rule of thumb in react is to never mutate the state,
         * so create a new list by appending the new ball to the old list. Also create a new state object.
         */
        const newBalls = [...this.state.balls, ...newBall]
        const newState = {
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
        // I chose to use array.filter() because it returns a new array, which maintains immutability.
        const newBalls = this.state.balls.filter((ball) => {return ball.key !== key; });

        this.setState({balls: newBalls});
    }
    
    /**
     * React lifecycle hook. This method draws the component on the screen. It is called after the component is
     * first instantiated, and also every time the state is updated.
     */
    render() {
        // I chose to define css styles as a javascript object because they are relatively simple.
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
                onClick={this.createBall}  // bind the onClick event to the createBall() method defined earlier
                
                /**
                 * Bind the containerRef object created earlier to this DOM element.
                 * This allows me to get the size of the <div> using getBoundingClientRect().
                 */
                ref={this.containerRef}
                data-testid="myContainer">  
                {
                    /**
                     * Create a Ball component for each element in balls array in the state.
                     * The information in each element is passed to the component as props.
                     */
                    this.state.balls.map((item) => (
                        <Ball {...item}></Ball>
                    ))
                }
            </div>
        )
    }

}

export default Container;
