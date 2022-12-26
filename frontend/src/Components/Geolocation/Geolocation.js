import { State, City }  from 'country-state-city';
import React, {useEffect, useState} from 'react';

import './Geolocation.css'

export default function Geolocation() {

    const country = "India"
    const [state, setState] = useState()
    const [city, setCity] = useState()

    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])

    const [lat, setLat] = useState(0)
    const [lon, setLon] = useState(0)

    useEffect(() => {
        setStates(State.getStatesOfCountry("IN"))
    }, [country])

    const options = {
        enableHighAccuracy: false,
        timeout: 500000,
        maximumAge: Infinity
    }

    const successCallback = (position) => {
        console.log(position)

        console.log("Latitude is :", position.coords.latitude)
        console.log("Longitude is :", position.coords.longitude)

        setLat(position.coords.latitude)
        setLon(position.coords.longitude)
    }
    
    const errorCallback = (error) => {
        console.log(error)
    }

    const handleClick = () => {
        console.log("Getting geo-location...")
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
    }

    const handleStateChange = (event) => {
        setState(event.target.value)

        states.forEach((state) => {
            if (state.name === event.target.value) {
                setCities(City.getCitiesOfState("IN", state.isoCode))
            }
        })
    }

    const handleCityChange = (event) => {
        setCity(event.target.value);

        cities.forEach((c) => {
            if (c.name === event.target.value) {
                setLat(c.latitude)
                setLon(c.longitude)

                console.log(c.latitude, c.longitude)
            }
        })
    }
    

    return (
        <div>
            <div className='geolocationForm'>
                <h1>Geo-location</h1>
                <button className='field' onClick={handleClick}>Use my geo-location</button>
            </div>

            <div className='locationForm'>
                <h1>Location Input</h1>
                <div className='field'>
                    Country: &nbsp;
                    <select disabled>
                        
                        <option>India</option>
                    </select>
                    <br />
                </div>
            
                <div className='field'>
                    State: &nbsp;
                    <select onChange={handleStateChange}>
                        <option>Choose a state</option>
                        {
                            states.map((s) => {
                                return <option key={s.isoCode}>{s.name}</option>
                            })
                        }
                    </select>
                </div>

                <div className='field'>
                    City: &nbsp;
                    <select onChange={handleCityChange}>
                        <option>Choose a city</option>
                        {
                            cities.map((c) => {
                                return <option key={c.name}>{c.name}</option>
                            })
                        }
                    </select>
                </div>
            </div>

            <div className='latLong'>
                    <p><b>Latitude: </b> {lat}</p>
                    <p><b>Longitude: </b> {lon}</p>
            </div>

        </div>
    )
}