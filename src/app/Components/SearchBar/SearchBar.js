import React, { useState, useEffect, useRef } from 'react';
import "./SearchBar.css";

function useOutsideAlerter(ref, setSuggestionsActive) {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setSuggestionsActive(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}


export default function SearchBar({ placeholder, searchData, toggleCentering, suggestionsActive, setSuggestionsActive, selectedPath }) {
    const ref = useRef(null);
    useOutsideAlerter(ref, setSuggestionsActive);

    const [filteredData, setFilteredData] = useState([]);
    const [wordEntered, setWordEntered] = useState("");

    const handleFilter = (event) => {
        const searchWord = event.target.value;
        setWordEntered(searchWord);
        const newFilter = searchData.filter((key) => {
            return key.toLowerCase().includes(searchWord.toLowerCase());
        });

        if (searchWord === "") {
            setFilteredData([]);
            setSuggestionsActive(false);
        } else {
            setFilteredData(newFilter);
            if (newFilter.length > 0) {
                setSuggestionsActive(true);
            } else {
                setFilteredData(['No matches found'])
            }
        }
    };

    const onSearch = (searchValue) => {
        setSuggestionsActive(false);
        setWordEntered(searchValue);
        toggleCentering(searchValue);
        setFilteredData([searchValue]);
    }

    useEffect(() => {
        const searchWord = selectedPath ? selectedPath.id : ""
        setWordEntered(searchWord)
        const newFilter = searchData.filter((key) => {
            return key.toLowerCase().includes(searchWord.toLowerCase());
        });
        if (searchWord === "") {
            setFilteredData([]);
        } else {
            setFilteredData(newFilter);
        }
    }, [selectedPath]);

    return (
        <div className="search-form" ref={ref}>
            <input
                type="text"
                placeholder={placeholder}
                value={wordEntered}
                onChange={handleFilter}
                onFocus={() => {
                    filteredData.length > 0 ? setSuggestionsActive(true) : setSuggestionsActive(false);
                }}
                style={{borderBottomLeftRadius: suggestionsActive ? "0px" : "10px",  borderBottomRightRadius: suggestionsActive ? "0px" : "10px"}}
            />
            {suggestionsActive && filteredData.length !== 0 && (
                <div className="dataResult" style={{ display: suggestionsActive ? 'block' : 'none' }}>
                    {filteredData.slice(0, 4).map((value, index, array) => {
                        return (
                            <div 
                                key={value} 
                                className={value === "No matches found" ? "data-item-inactive" : "data-item"}
                                onClick={() => value !== "No matches found" && onSearch(value)}
                                style={index === array.length - 1 ? { borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px" } : {}}
                                >
                                <p>{value}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
