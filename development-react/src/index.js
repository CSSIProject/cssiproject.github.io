import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Navigation from './navbar/Navigation';
import Mapcontainer from './Mapcontainer/Map';
import Maplayer from './Mapcontainer/Maplayer';
import Maplegend from './Mapcontainer/Maplegend';
import Footercontainer from './footer/footer';

ReactDOM.render(
    <div>
    <Navigation />
    <Mapcontainer />
    <Maplayer />
    <Maplegend />
    <Footercontainer />
    </div>,
    document.getElementById('root')
);