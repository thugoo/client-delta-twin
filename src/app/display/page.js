"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

import SecondFloor from '../Components/SecondFloor/SecondFloor';
import FirstFloor from '../Components/FirstFloor/FirstFloor';


export default function Display({
    searchParams,
}) {


    function getColor(filter, value) {

        if (value == "No data") return "hsl(0, 0%, 50%)";

        let normalizedValue;
        let hue;

        if (filter == "temperature") {
            if (value >= 18 && value < 22) {
                normalizedValue = (value - 18) / (22 - 18);
                hue = (180 - normalizedValue * 60).toString(10);
            } else {
                normalizedValue = (value - 22) / (25 - 22);
                hue = ((1 - normalizedValue) * 120).toString(10);
            }
        } else if (filter == "co2") {
            normalizedValue = (value - 300) / (1000 - 300);
            hue = ((1 - normalizedValue) * 120).toString(10);
        } else if (filter == "occupancy") {
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

    const floor = searchParams["floor"];
    const filter = searchParams["filter"];

    const [colorValues, setColorValues] = useState("");

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

    const initZoom = () => {
        function handleZoom(e) {
            d3.select(`#${floor} #content-group-${floor}`)
                .attr('transform', e.transform);
        }

        let svg = d3.select(`#${floor}`);
        let zoom = d3.zoom().on('zoom', handleZoom);

        let transformX = floor == "first" ? -1230 : -1330;

        let startTransform = d3.zoomIdentity.translate(transformX, -3300).scale(2);
        let endTransform = d3.zoomIdentity.translate(transformX, 300).scale(2);

        svg.call(zoom.transform, startTransform);

        svg.transition()
            .duration(10000)
            .ease(d3.easeLinear)
            .tween("transform", function () {
                let i = d3.interpolate({ x: startTransform.x, y: startTransform.y }, { x: endTransform.x, y: endTransform.y });
                return function (t) {
                    let interpolatedTransform = d3.zoomIdentity.translate(
                        i(t).x,
                        i(t).y
                    ).scale(1.95);
                    d3.select(`#${floor} #content-group-${floor}`).attr('transform', interpolatedTransform);
                };
            });
    }

    const [data, setData] = useState({});
    const [timetableData, setTimetableData] = useState({});

    const apiUrl = "http://172.17.89.119.nip.io/api"
    // const apiUrl = "http://localhost:5000/api"

    useEffect(() => {
        generateSearchData();
        const fetchData = async () => {
            const response = await axios.get(`${apiUrl}/measurements`);
            setData(response.data);
            const response_timetables = await axios.get(`${apiUrl}/timetables`);
            setTimetableData(response_timetables.data);
        };
        fetchData();
        initZoom();
    }, []);

    let displayFilter; 

    if (filter == "occupancy") {
        displayFilter = "occupancy data"
    } else if (filter == "co2") {
        displayFilter = "CO2 concentration data"
    } else {
        displayFilter = "temperature data"
    }

    let displayString = `Live ${displayFilter} from the ${floor} floor`;

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

        const currentTime = new Date();
        const formattedTime = currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
        document.title = `Delta Twin [${formattedTime}]`;

    }, [data, timetableData]);


    return floor == "first" ?
        (
            <div>
                <p style={{
                    position: "absolute",
                    background: "transparent",
                    bottom: 0,
                    right: 0,
                    zIndex: 2,
                    marginBottom: "50px",
                    marginRight: "150px",
                    fontSize: "45px"
                }}>
                    {displayString}
                </p>
                <div>
                    <FirstFloor
                        hide={false}
                        toggleSelectedPath={null}
                        colorValues={colorValues}
                        data={data}
                        timetableData={timetableData}
                        filter={filter}
                    />
                </div>
            </div>
        ) :
        (
            <div>
                <p style={{
                    position: "absolute",
                    background: "transparent",
                    bottom: 0,
                    right: 0,
                    zIndex: 2,
                    marginBottom: "50px",
                    marginRight: "150px",
                    fontSize: "45px"
                }}>
                    {displayString}
                </p>

                <div>
                    <SecondFloor
                        hide={false}
                        toggleSelectedPath={null}
                        colorValues={colorValues}
                        data={data}
                        timetableData={timetableData}
                        filter={filter}
                    />
                </div>
            </div>
        );
};
