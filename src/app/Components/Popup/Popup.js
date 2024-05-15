import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import React, { useEffect } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import './Popup.css';

export default function Popup({ location, text, popupVisible, setSelectedPath, popupColors, svgRef }) {

    // Passing the scrolling event to the floor plan
    useEffect(() => {
        const handleWheel = (event) => {
            event.preventDefault();
            if (svgRef && svgRef.current) {
                svgRef.current.dispatchEvent(new WheelEvent('wheel', event));
            }
        };

        const popupElement = document.getElementById("popup-window");
        popupElement.addEventListener('wheel', handleWheel);

        return () => {
            popupElement.removeEventListener('wheel', handleWheel);
        };
    }, [svgRef]);

    return (
        <div
        id="popup-window" 
        style={{
            left: `${location.left}`, 
            top: `${location.top}`, 
            visibility: popupVisible != false ? "visible" : "hidden", 
            opacity: popupVisible != false ? "1" : "0"}}
            >
            <h2 id="popup-title" style={{textAlign: "center"}}>Room {text.title}</h2>

            <FontAwesomeIcon icon={faTimes} className="fas fa-times" onClick={()=> {
                setSelectedPath(false);
            }}/>
            
            <div className="grid-container">
                <div className="grid-item">Temperature</div>
                <div className="grid-item">
                    <span id="popup-temperature-color" className="dot" style={{backgroundColor: popupColors.temperature}}></span>
                    <span id="popup-temperature">{text.temperature}</span>
                </div>
            
                <div className="grid-item">CO2 level</div>
                <div className="grid-item">
                    <span id="popup-co2-color" className="dot" style={{backgroundColor: popupColors.co2}}></span>
                    <span id="popup-co2">{text.co2}</span>
                </div>
            
                <div className="grid-item">Occupancy</div>
                <div className="grid-item">
                    <span id="popup-occupancy-color" className="dot" style={{backgroundColor: popupColors.occupancy}}></span>
                    <span id="popup-occupancy">{text.occupancy}</span>
                </div>
            </div>
            <div className="triangle"></div>
        </div>
    );
}