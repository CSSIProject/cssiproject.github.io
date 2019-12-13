import React, { Component } from "react";
import './footer.css';


class Footercontainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            footerActive: false,
        };
    }
    /* this setup is local in that I can't use this to affect other components i.e. mapsize */
    toggleClass = () => {
        this.setState({ footerActive: !this.state.footerActive });
        this.props.updatePage(this.state.footerActive);
    };
    render(){
        return (
                <div 
                    className={this.state.footerActive ? "footer-container footer-container-step-2": "footer-container footer-container-step-1"}
                    onClick={this.toggleClass}
                >
                    <div id="dateslider">datesliderhere</div>
                    <div className={this.state.footerActive ? "footer-inner-container": "footer-inner-container footer-inner-container-step-0"}>
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