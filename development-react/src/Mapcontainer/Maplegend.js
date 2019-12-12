import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import './maplegend.css';
import { createConditional } from "typescript";

class Maplegend extends Component {
    render(){
        return (
                <div className="map-overlay map-overlay-step-1" id='legend'>
                    <div id='legend-name'></div>
                    <div od="legend-body" classname="legend-body"></div>
                </div>
        );
    }
}

export default Maplegend;