import React, {Component} from 'react';

class Container extends Component {
    render() {
        const myStyle = {
            borderStyle: "solid",
            height: "420px",
            width: "75%",
            margin: "50px"
        }

        function handleClick(e) {
            console.log('handleClick()');
            e.persist();
            console.dir(e);
        }

        return (
            <div 
                style={myStyle}
                onClick={handleClick}>
            </div>
        )
    }

}

export default Container;
