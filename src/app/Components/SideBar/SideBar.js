import { useState, useEffect } from 'react';
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft, faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import './SideBar.css';


function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}


export default function SideBar({ sideBarCollapsed, toggleSideBar, selectedPath, measurements, timetablesSis, timetablesDeltaqr, popupColors }) {

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // If browser window width is 700px or smaller,
        // change to the mobile-friendly layout.
        function handleResize() {
            if (window.innerWidth < 701) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);

    }, [sideBarCollapsed]);

    function convertTimestamp(timestamp) {
        let date = new Date(timestamp);

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        let hours = date.getHours();
        let minutes = date.getMinutes();

        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;

        return hours + ':' + minutes + ', ' + day + '.' + month + '.' + year;
    }

    const handleMeasurement = (type) => {
        let suffix = type == "temperature" ? "°C" : " ppm";
        let value = measurements[selectedPath.id][`qe_${type}`];

        if (value != "No data") {
            value += suffix;
            return (
                <div>
                    <h1 style={{ color: popupColors[type] }} >{value}</h1>
                    <p>Last measured: {convertTimestamp(measurements[selectedPath.id][`qe_${type}_time`])}</p>
                </div>
            )
        }

        return (
            <h1 style={{ color: "rgba(255, 255, 255, 0.5)" }} >{value}</h1>
        );
    }

    const handleTimetable = () => {
        let value;
        let timetableType;

        if (selectedPath.id.substring(0, 2) !== "QR") {
            timetableType = timetablesSis;
            if (timetablesSis[selectedPath.id] && !isEmpty(timetablesSis[selectedPath.id])) {
                value = timetablesSis[selectedPath.id].current_event ? "Booked" : "Empty";
            } else {
                value = "No data";
            }
        } else if (selectedPath.id.substring(0, 2) === "QR") {
            timetableType = timetablesDeltaqr;
            if (timetablesDeltaqr[selectedPath.id] && !isEmpty(timetablesDeltaqr[selectedPath.id])) {
                value = timetablesDeltaqr[selectedPath.id].current_event ? "Booked" : "Empty";
            } else {
                value = "No data";
            }
        }

        if (value == "Booked") {
            return (
                <div>
                    <h1 style={{ color: popupColors.occupancy }}>{value}</h1>
                    <div className="side-bar-timetable">

                        <div className="timetable-row" style={{ padding: '10px 10px', color: "white", borderRight: "1px white dotted", borderBottom: "1px white dotted" }}>Title</div>
                        <div className="timetable-row" style={{ padding: '10px 10px', color: "white", borderBottom: "1px white dotted"}}>{timetableType[selectedPath.id].current_event.title}</div>

                        <div className="timetable-row" style={{ padding: '10px 10px', color: "white", borderRight: "1px white dotted", borderBottom: "1px white dotted" }}>Type</div>
                        <div className="timetable-row" style={{ padding: '10px 10px', color: "white", borderBottom: "1px white dotted" }}>{timetableType[selectedPath.id].current_event.study_work_type}</div>

                        <div className="timetable-row" style={{ padding: '10px 10px', color: "white", borderRight: "1px white dotted", borderBottom: "1px white dotted"  }}>Begin time</div>
                        <div className="timetable-row" style={{ padding: '10px 10px', color: "white", borderBottom: "1px white dotted" }}>{timetableType[selectedPath.id].current_event.begin_time}</div>

                        <div className="timetable-row" style={{ padding: '10px 10px', color: "white", borderRight: "1px white dotted"  }}>End time</div>
                        <div className="timetable-row" style={{ padding: '10px 10px', color: "white" }}>{timetableType[selectedPath.id].current_event.end_time}</div>
                    </div>
                </div>
            );
            



        } else if (value == "Empty") {
            return (
                <div>
                    <h1 style={{ color: popupColors.occupancy }}>{value}</h1>
                </div>
            )
        } else {
            return (
                <h1 style={{ color: "rgba(255, 255, 255, 0.5)" }}>{value}</h1>
            );
        }
    }

    return (
        <div>
            <div id="side-bar" className={`${!sideBarCollapsed ? "" : "collapsed"}`}>

                <div className="side-bar-content">
                    <div
                        className="side-bar-title">
                        <h4
                            style={{
                                color: "rgba(255, 255, 255, 0.3)",
                                fontWeight: "normal",
                                userSelect: "none"
                            }}
                        > All times are displayed in Europe/Tallinn time zone </h4>
                        <h2
                            style={{
                                color: !selectedPath ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 1)",
                                fontWeight: "normal"
                            }}
                        >{selectedPath ? `Room ${selectedPath.id}` : "Select a room to display information"}
                        </h2>
                    </div>

                    <div
                        className="side-bar-data">
                        <h2>{selectedPath ? "Temperature" : ""}</h2>
                        <h1>{selectedPath ? handleMeasurement("temperature") : ""}</h1>
                    </div>

                    <div
                        className="side-bar-data">
                        <h2>{selectedPath ? "CO2 level" : ""}</h2>
                        <h1>{selectedPath ? handleMeasurement("co2") : ""}</h1>
                    </div>

                    <div
                        className="side-bar-data">
                        <h2>{selectedPath ? "Occupancy" : ""}</h2>
                        <h1>{selectedPath ? handleTimetable() : ""}</h1>
                    </div>
                </div>
            </div>
            <div id="side-bar-button-div" className={`${!sideBarCollapsed ? "" : "collapsed"}`}>
                <span id="side-bar-button" onClick={() => toggleSideBar()}>
                    <FontAwesomeIcon
                        icon={!isMobile ? (!sideBarCollapsed ? faChevronLeft : faChevronRight) : (!sideBarCollapsed ? faChevronDown : faChevronUp)}
                        style={{ fontSize: "18px" }} />
                </span>
            </div>
        </div>
    )
}