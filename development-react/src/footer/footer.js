import React, { Component } from "react";
import './footer.css';


class Footercontainer extends Component {
    render(){
        return (
                <div className="footer-container footer-container-step-2">
                    <div className="footer-inner-container">
                        <div id="dateslider">datesliderhere</div>
                        <div id="block-info">
                        <div className="footer-heading">HEADING</div>
                        <div id = "textblock">some info</div>
                        <div id = "plotblock" className="js-plotly-plot">some plot</div>
                        </div>
                    </div>
                </div>
        );
    }
}

export default Footercontainer;