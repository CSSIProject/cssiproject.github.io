import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import './map.css';


class Mapcontainer extends Component {
    constructor(props){
        super(props);

    }
    render(){
        return (
                <div id="mainmap" className={this.props.footeron ? "map-step-1": "map-step-2"}> Place Map Here </div>
        );
    }
}

export default Mapcontainer;