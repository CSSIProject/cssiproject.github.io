import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { compileFunction } from 'vm';
import { render } from '@testing-library/react';
import Navigation from './navbar/Navigation';
import Mapcontainer from './Mapcontainer/Map';
import Maplayer from './Mapcontainer/Maplayer';

ReactDOM.render(
    <Navigation />,
    <Mapcontainer />,
    <Maplayer />,
    document.getElementById('root')
);