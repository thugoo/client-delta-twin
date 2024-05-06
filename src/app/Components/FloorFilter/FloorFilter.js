import React, { useState } from 'react';
import './FloorFilter.css';

export default function FloorFilter({ active, toggleFloor }) {
    return (
        <div>
            <div className="floor-options">
                <div className="icon-row">

                <div>
                    <div 
                        id="filter-first" 
                        className={`icon-container floor ${active === 'first' ? 'active' : ''}`}
                        onClick={() => toggleFloor("first")}>

                        <p>1. floor</p>
                    </div>
                </div>

                <div>
                    <div 
                        id="filter-second" 
                        className={`icon-container floor ${active === 'second' ? 'active' : ''}`}
                        onClick={() => toggleFloor("second")}>

                        <p>2. floor</p>
                    </div>
                </div>

                </div>
            </div>
            <div id="filter-first-text" className="tooltip-text bottom">Display first floor</div>
            <div id="filter-second-text" className="tooltip-text bottom">Display second floor</div>
        </div>
    )
}