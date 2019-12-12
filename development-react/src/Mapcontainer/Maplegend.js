import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import './maplegend.css';

class Maplegend extends Component {
    render(){
        return (
                <div className="map-overlay map-overlay-step-1" id="legend">
                    <div id="legend-name">legendtitle</div>
                    <div id="legend-body" className="legend-body">legendbody</div>
                </div>
        );
    }
}

export default Maplegend;