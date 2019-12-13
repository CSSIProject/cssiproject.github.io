/* import React from 'react'; */
import React, { Component } from "react";
import ReactDOM from 'react-dom';
import './index.css';
import Navigation from './navbar/Navigation';
import Mapcontainer from './Mapcontainer/Map';
import Maplayer from './Mapcontainer/Maplayer';
import Maplegend from './Mapcontainer/Maplegend';
import Footercontainer from './footer/footer';

class Page extends Component {
    constructor(props){
        super(props);
        this.state ={
            footerActive: true,
        };
    }
    updateFooter = value => {
        this.setState({
            footerActive: value
        });
    }
    render(){
        return(
            <>
                <Navigation />
                <Mapcontainer footeron={this.state.footerActive}/>
                <Maplayer />
                <Maplegend />
                <Footercontainer updatePage={this.updateFooter}/>
            </>
        )
    }
}

ReactDOM.render(
    <Page />,
    document.getElementById('root')
);
