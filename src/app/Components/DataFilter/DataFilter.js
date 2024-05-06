import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThermometerFull, faWind, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

import './DataFilter.css';

export default function DataFilter({ filter, setFilter }) {
    return (
            <div className="filter-options">
                <div className="icon-row">
                    
                    <div>
                        <div 
                            id="filter-temperature" 
                            className={`icon-container filter ${filter == 'temperature' ? 'active' : ''}`}
                            onClick={() => setFilter('temperature')}>

                            <FontAwesomeIcon icon={faThermometerFull} className="fas fa-thermometer-full" style={{marginLeft: "10px", fontSize: "18px"}}/>
                            <p>Temperature</p>
                        </div>
                    </div>

                    <div>
                        <div 
                            id="filter-co2" 
                            className={`icon-container filter ${filter == 'co2' ? 'active' : ''}`}
                            onClick={() => setFilter('co2')}>

                            <FontAwesomeIcon icon={faWind} className="fas fa-wind" style={{marginLeft: "10px", fontSize: "18px"}} />
                            <p>CO2</p>
                        </div>
                    </div>

                    <div>
                        <div 
                            id="filter-occupancy" 
                            className={`icon-container filter ${filter == 'occupancy' ? 'active' : ''}`}
                            onClick={() => setFilter('occupancy')}>

                            <FontAwesomeIcon icon={faCalendarAlt} className="fas fa-calendar-alt" style={{marginLeft: "10px", fontSize: "18px"}}/>
                            <p>Occupancy</p>
                        </div>
                    </div>

                </div>
            </div>

    )
}