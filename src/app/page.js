"use client";

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

import FirstFloor from './Components/FirstFloor/FirstFloor';
import SecondFloor from './Components/SecondFloor/SecondFloor';
import SearchBar from './Components/SearchBar/SearchBar';
import Popup from './Components/Popup/Popup';
import FloorFilter from './Components/FloorFilter/FloorFilter';
import DataFilter from './Components/DataFilter/DataFilter';
import SideBar from './Components/SideBar/SideBar';

var svg;
var zoom;

function Home() {

    //  This state holds the path element of the selected room.
    //  Used for displaying the information
    const [selectedPath, setSelectedPath] = useState(false);
    const toggleSelectedPath = (pathId) => {
        let query = document.getElementById(pathId);
        setSelectedPath(query);

        triggerPopupWindow(!popupWindow);
    };

    useEffect(() => {
        if (selectedPath) {
            const handleResize = () => {
                updatePopupLocation();
            };

            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        } else {
            setPopupVisible(false);
        }
    }, [selectedPath]);


    const [colorValues, setColorValues] = useState("");
    function getColor(type, value) {

        if (value == "No data") return "hsl(0, 0%, 50%)";

        let normalizedValue;
        let hue;

        if (type == "temperature") {
            if (value >= 18 && value < 22) {
                normalizedValue = (value - 18) / (22 - 18);
                hue = (180 - normalizedValue * 60).toString(10);
            } else {
                normalizedValue = (value - 22) / (26 - 22);
                hue = ((1 - normalizedValue) * 120).toString(10);
            }
        } else if (type == "co2") {
            normalizedValue = (value - 300) / (1000 - 300);
            hue = ((1 - normalizedValue) * 120).toString(10);
        } else if (type == "occupancy") {
            if (value == "Booked") {
                return "hsl(0, 100%, 60%)";
            } else if (value == "Empty") {
                return "hsl(120, 100%, 60%)";
            }
            normalizedValue = (value - 300) / (1000 - 300);
            hue = ((1 - normalizedValue) * 120).toString(10);
        }

        return ["hsl(", hue, ",100%,50%)"].join("");
    }


    const [filter, setFilter] = useState("temperature");
    useEffect(() => {
        let newColorValues = {};
        let value;

        searchData.forEach((key) => {
            if (filter == "occupancy") {
                if (timetableData[key]) {
                    value = timetableData[key].current_event ? "Booked" : "Empty";
                } else {
                    value = "No data";
                }
            } else {
                value = data[key][`qe_${filter}`];
            }
            let color = getColor(filter, value);
            newColorValues[key] = color;
        });
        setColorValues(newColorValues);
    }, [filter])


    const [popupWindow, triggerPopupWindow] = useState(false);
    const [popupText, setPopupText] = useState(
        {
            "temperature": "",
            "co2": "",
            "occupancy": ""
        }
    );
    const [popupLocation, setPopupLocation] = useState(
        {
            "top": "0px",
            "left": "0px"
        }
    );
    const [popupColors, setPopupColors] = useState(
        {
            "title": '',
            "temperature": '',
            "co2": '',
            "occupancy": ''
        }
    );
    const [popupVisible, setPopupVisible] = useState(false);

    const updatePopupLocation = () => {
        /**
         * Updates the coordinates of the pop-up, based on the location of the room path that is connected to the pop-up by ID.
         */
        const id = selectedPath.id;

        const specialValues = {
            "1003": {
                "x": 20,
                "y": 0
            },
            "1010": {
                "x": 0,
                "y": -10
            },
            "1012": {
                "x": 0,
                "y": 25
            },
            "1013": {
                "x": 0,
                "y": -75
            },
            "1015": {
                "x": -50,
                "y": -100
            },
            "1031-F": {
                "x": 0,
                "y": 10,
            },
            "1032": {
                "x": 0,
                "y": -20
            },
            "1034": {
                "x": 20,
                "y": 0,
            },
            "2010": {
                "x": -30,
                "y": 0
            },
            "2017": {
                "x": -50,
                "y": 0
            },
            "2025": {
                "x": 0,
                "y": 50
            },
            "2041": {
                "x": 0,
                "y": 10
            },
            "2051": {
                "x": -30,
                "y": 0
            }
        }

        let specialX;
        let specialY;

        if (specialValues.hasOwnProperty(id)) {
            specialX = specialValues[id].x;
            specialY = specialValues[id].y;
        } else {
            specialX = 0;
            specialY = 0;
        }

        let boundingBox = selectedPath.getBBox();
        let x = specialX + boundingBox.x + boundingBox.width / 2;
        let y = specialY + boundingBox.y + boundingBox.height / 2;
        let point = new DOMPoint(x, y);
        let convertedPoint = point.matrixTransform(selectedPath.getScreenCTM());
        let convertedX = convertedPoint.x
        let convertedY = convertedPoint.y

        setPopupLocation(
            {
                "left": convertedX - 172 / 2 + 'px',
                "top": convertedY - 132 - 10 + 'px'
            }
        );

    };
    const updatePopupText = () => {

        let temperature;
        let co2;
        let occupancy;


        if (data[selectedPath.id]["qe_temperature"] == "No data") {
            temperature = "No data"
        } else {
            temperature = `${data[selectedPath.id]["qe_temperature"]} °C`
        }

        if (data[selectedPath.id]["qe_co2"] == "No data") {
            co2 = "No data"
        } else {
            co2 = `${data[selectedPath.id]["qe_co2"]} ppm`
        }

        if (timetableData[selectedPath.id]) {
            occupancy = timetableData[selectedPath.id].current_event ? "Booked" : "Empty";
        } else {
            occupancy = "No data";
        }

        let text = {
            "title": selectedPath.id,
            "temperature": temperature,
            "co2": co2,
            "occupancy": occupancy
        }
        setPopupText(text);
    };
    const updatePopupColors = () => {

        let temperature = data[selectedPath.id]["qe_temperature"];
        let co2 = data[selectedPath.id]["qe_co2"];
        let occupancy;

        if (timetableData[selectedPath.id]) {
            occupancy = timetableData[selectedPath.id].current_event ? "Booked" : "Empty";
        } else {
            occupancy = "No data";
        }

        setPopupColors(
            {
                "temperature": getColor("temperature", temperature),
                "co2": getColor("co2", co2),
                "occupancy": getColor("occupancy", occupancy)
            }
        );
    };

    useEffect(() => {
        if (selectedPath) {
            updatePopupLocation();
            updatePopupText();
            updatePopupColors();
            initZoom(true);
        }
    }, [popupWindow]);

    useEffect(() => {
        if (selectedPath) {
            setPopupVisible(true);
        }
    }, [popupLocation])

    const [floor, setFloor] = useState("first");
    const toggleFloor = (floorValue) => {
        setSelectedPath(false);
        setFloor(floorValue);
    };
    useEffect(() => {
        initZoom();
    }, [floor]);


    const [center, triggerCenter] = useState(false);
    const toggleCentering = (pathId) => {
        if (pathId.charAt(0) == 1 && floor != "first") {
            toggleFloor("first");
        } else if ((pathId.charAt(0) == 2 || pathId.substring(0, 2) == "QR") && floor != "second") {
            toggleFloor("second");
        }

        toggleSelectedPath(pathId);
        triggerCenter(!center);
    };
    const centerRoom = () => {
        /**
         * Center the given room path, in relation to the browser window.
         */
        if (!selectedPath) {
            return;
        }

        if (selectedPath) {
            var bbox = selectedPath.getBBox();
            var x = bbox.x + bbox.width / 2;
            var y = bbox.y + bbox.height / 2;
            var scale = 2;

            var contentBBox = document.getElementById(`content-group-${floor}`).getBBox();

            // Center coordinates of the SVG viewBox.
            var centerWidth = contentBBox.width / 2;
            var centerHeight = contentBBox.height / 2;

            let width = document.getElementById(floor).getAttribute('viewBox').split(' ')[2];
            let height = document.getElementById(floor).getAttribute('viewBox').split(' ')[3];


            let translateX = centerWidth - x;
            let toRight = false;
            // If center of the room path is to the right of the un-scaled middle point
            if (translateX < 0) {
                translateX = -(translateX) + width / 2;
                toRight = true;
            }
            let percentageX = translateX / width;

            // Scaled middle point location of x
            let middleXScaled = -(width * scale / 2) + width / 2;

            let scaledX = width * scale * percentageX;

            if (!toRight) {
                scaledX = middleXScaled + scaledX;
            } else {
                scaledX = -(scaledX - width / 2);
            }

            let translateY = centerHeight - y;
            let toDown = false;
            if (translateY < 0) {
                translateY = -(translateY) + height / 2;
                toDown = true;
            }

            let percentageY = translateY / height;

            let middleYScaled = -(height * scale / 2) + height / 2;

            let scaledY = height * scale * percentageY;

            if (!toDown) {
                scaledY = middleYScaled + scaledY;
            } else {
                scaledY = -(scaledY - height / 2);
            }

            // Display the pop-up for the room path.
            // displayPopup(roomId);

            svg.transition()
                .duration(1000)
                .call(zoom.transform, d3.zoomIdentity
                    .translate(scaledX, scaledY)
                    .scale(scale));
        }
    }
    useEffect(() => {
        initZoom(true);
        centerRoom();
    }, [center])


    const initZoom = (reset = false) => {

        function handleZoom(e) {
            d3.select(`#${floor} #content-group-${floor}`)
                .attr('transform', e.transform);

            // Update pop-up location when panning/zooming.
            if (selectedPath) {
                updatePopupLocation();
            }
        }

        svg = d3.select(`#${floor}`);

        svg.on("mousedown", function (event) {
            setSuggestionsActive(false)
        });

        zoom = d3.zoom()
            .scaleExtent([0.8, 10])
            .on('zoom', handleZoom);

        svg.call(zoom).on("dblclick.zoom", null);

        if (!reset) {
            svg.call(zoom.transform, d3.zoomIdentity);
            svg.call(zoom.scaleBy, 0.8);
        }

    }

    const [sideBarCollapsed, setSideBarCollapsed] = useState(true)
    const toggleSideBar = () => {
        setSideBarCollapsed(!sideBarCollapsed);
    }


    const [suggestionsActive, setSuggestionsActive] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const generateSearchData = () => {
        let paths = document.querySelectorAll(".room-group path");
        let ids = [];

        paths.forEach((path) => {
            let id = path.id; // Replace 'name' with the actual attribute name
            ids.push(id);
        });
        setSearchData(ids);
    }


    const [data, setData] = useState({});
    const [timetableData, setTimetableData] = useState({});
    // const apiUrl = "http://172.17.89.119.nip.io/api"
    const apiUrl = "http://localhost:5000/api"

    useEffect(() => {
        generateSearchData();
        const fetchData = async () => {
            const response = await axios.get(`${apiUrl}/measurements`);
            setData(response.data);
            const response_timetables = await axios.get(`${apiUrl}/timetables`);
            setTimetableData(response_timetables.data);
        };

        fetchData();

        const now = new Date();
        const delay = (60 - now.getSeconds() + 30) % 60 * 1000 - now.getMilliseconds();

        const timeoutId = setTimeout(() => {
            fetchData();
            const intervalId = setInterval(fetchData, 60 * 1000);

            return () => {
                clearInterval(intervalId);
            };
        }, delay);

        return () => clearTimeout(timeoutId);
    }, []);

    
    useEffect(() => {
        let newColorValues = {};
        let value;

        searchData.forEach((key) => {
            if (filter == "occupancy") {
                if (timetableData[key]) {
                    value = timetableData[key].current_event ? "Booked" : "Empty";
                } else {
                    value = "No data";
                }
            } else {
                value = data[key][`qe_${filter}`];
            }
            let color = getColor(filter, value);
            newColorValues[key] = color;
        });

        setColorValues(newColorValues);

        if (selectedPath) {
            updatePopupText();
            updatePopupColors();
        }

        const currentTime = new Date();
        const formattedTime = currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
        document.title = `Delta Twin [${formattedTime}]`;

    }, [data, timetableData]);


    // Used for passing the events to the floor component.
    //
    // E.g. wheel events are passed from popup component to floor components
    // to enable zooming of the floor plan while hovering the popup component.
    const firstSvgRef = useRef(null);
    const secondSvgRef = useRef(null);


    return (
        <div className="App">
            <header className="App-header">

                <SearchBar
                    placeholder="Search by room number"
                    data={searchData}
                    toggleCentering={toggleCentering}
                    suggestionsActive={suggestionsActive}
                    setSuggestionsActive={setSuggestionsActive}
                    selectedPath={selectedPath}
                />

                <FloorFilter
                    active={floor}
                    toggleFloor={toggleFloor}
                />

                <Popup
                    svgRef={floor == "first" ? firstSvgRef : secondSvgRef}
                    location={popupLocation}
                    text={popupText}
                    popupVisible={popupVisible}
                    setSelectedPath={setSelectedPath}
                    popupColors={popupColors}
                    popupWindow={popupWindow}
                />

                <FirstFloor
                    ref={firstSvgRef}
                    hide={floor == "first" ? false : true}
                    toggleSelectedPath={toggleSelectedPath}
                    colorValues={colorValues}
                    data={data}
                    timetableData={timetableData}
                    filter={filter}
                />

                <SecondFloor
                    ref={secondSvgRef}
                    hide={floor == "second" ? false : true}
                    toggleSelectedPath={toggleSelectedPath}
                    colorValues={colorValues}
                    data={data}
                    timetableData={timetableData}
                    filter={filter}
                />

                <SideBar
                    sideBarCollapsed={sideBarCollapsed}
                    toggleSideBar={toggleSideBar}
                    selectedPath={selectedPath}
                    data={data}
                    timetableData={timetableData}
                    popupColors={popupColors}
                />

                <DataFilter
                    filter={filter}
                    setFilter={setFilter}
                />

            </header>
        </div>
    );
}

export default Home;
