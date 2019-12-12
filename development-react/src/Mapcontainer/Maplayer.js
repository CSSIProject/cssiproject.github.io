import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import './maplayer.css';
import MyIcon from '../iconography/createIcon.js';
import { createConditional } from "typescript";

class Maplayer extends Component {
    render(){
        return (
                <div className="map-layer-btn">
                    <MyIcon name={'mapview'} />
                </div>
        );
    }
}

export default Maplayer;