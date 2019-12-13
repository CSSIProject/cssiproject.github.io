import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import './maplayer.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
/* import MyIcon from '../iconography/createIcon.js'; */

function Maplayer() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
// Change map background layer

    function switchLayer(layer) {
        var layerId = layer.id;
      /*  map.setStyle('mapbox://styles/mapbox/' + layerId); */  
    }

    return (
        <>
            <div className="map-layer-btn" onClick={handleShow}>
                    bground
            </div>
            <Modal show={show} onHide={handleClose} className="modal fade" id="maplayerModal">
                <Modal.Body>
                    <ButtonGroup aria-label="Switch map layers" className="map-layer-modal-btngrp">
                        <Button variant="secondary" className="btn-dark" id="streets-v11">Street</Button>
                        <Button variant="secondary" className="btn-dark" id="satellite-v9">Sat</Button>
                        <Button variant="secondary" className="btn-dark" id="dark-v10">Dark</Button>
                        <Button variant="secondary" className="btn-dark" id="light-v10">Light</Button>
                        <Button variant="secondary" className="btn-dark" id="outdoors-v11">Sun</Button>
                    </ButtonGroup>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Maplayer;