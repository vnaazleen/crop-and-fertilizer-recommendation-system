import * as React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { State, City }  from 'country-state-city';
import { Alert, Button, TextField, Box, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

import './CropRecommender.css';

const URL = "http://127.0.0.1:5000/crops"

export default function CropRecommender() {

    const [crop, setCrop] = useState("")
    const [chooseStateCity, setChooseStateCity] = useState(false)

    const country = "India"
    const [state, setState] = useState("")
    const [city, setCity] = useState("")

    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])

    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)
    const [data, setData] = useState()

    useEffect(() => {
        setStates(State.getStatesOfCountry("IN"))
    }, [country])


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!chooseStateCity) {
            await getGeoLocation()
        }

        await fetchTempertureAndHumidity()

        const fromElements = event.target.elements;
        const formInput = {
            "N": fromElements["N"].value,
            "P": fromElements["P"].value,
            "K": fromElements["K"].value,
            "temperature": data.main.temp,
            "humidity": data.main.humidity,
            "pH": fromElements["pH"].value,
            "rainfall": fromElements["rainfall"].value
        }

        console.log(formInput)

        axios.post(URL, formInput)
        .then(async (response) => {
            console.log(response.data)
            await setCrop(response.data.crop)
        })
        .catch((error) => alert(error))
    }

    const handleLocationInfoChange = (event) => {
        if (event.target.value === "geolocation") {
            setChooseStateCity(false)
        } else {
            setChooseStateCity(true)
        }

        console.log(event.target.value)
    }

    const fetchTempertureAndHumidity = async () => {
        await fetch(`${process.env.REACT_APP_WEATHER_API_URL}/weather/?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`)
            .then(res => res.json())
            .then(result => {
                setData(result)
            })
    }

    const updateState = (latitude, longitude) => {

        console.log("Latitude is :", latitude)
        console.log("Longitude is :", longitude)

        setLatitude(latitude)
        setLongitude(longitude)
    }

    const options = {
        enableHighAccuracy: false,
        timeout: 500000,
        maximumAge: Infinity
    }

    const successCallback = (position) => {
        updateState(position.coords.latitude, position.coords.longitude)
    }
    
    const errorCallback = (error) => {
        console.log(error)
    }

    const getGeoLocation = () => {
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
        setCity(event.target.value)

        cities.forEach((c) => {
            if (c.name === event.target.value) {
                updateState(c.latitude, c.longitude)
            }
        })
    }

    return (
        <div className='CropRecommender'>
            <Box
              component="form"
              sx={{
                  '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
              autoComplete="off"
              onSubmit={e => handleSubmit(e)}
              className="cropForm"
            >
                <div>
                    <center>
                        <h1 className='heading'>🌾 Crop Recommendation System</h1>
                        <TextField
                            required
                            id="N"
                            name="N"
                            label="Nitrogen"
                            type="number"
                        />
                        <br />
                        <TextField
                            required
                            id="P"
                            name="P"
                            label="Phosphorus"
                            type="number"
                        />
                        <br />
                        <TextField
                            required
                            id="K"
                            name="K"
                            label="Potassium"
                            type="number"
                        />
                        <br />
                        {/* <TextField
                            required
                            id="temperature"
                            name="temperature"
                            label="Temperature"
                            type="number"
                            inputProps={{
                                step: "any"
                            }}
                        />
                        <br />
                        <TextField
                            required
                            id="humidity"
                            name="humidity"
                            label="Humidity"
                            type="number"
                            inputProps={{
                                step: "any"
                            }}
                        />
                        <br /> */}

                        <FormControl sx={{m:1, width: '25ch'}}>
                            <FormLabel id="location">Location</FormLabel>
                            <RadioGroup
                                defaultValue="geolocation"
                                name="radio-buttons-group"
                                onChange={handleLocationInfoChange}
                                required
                            >
                                <FormControlLabel value="geolocation" control={<Radio />} label="Get via Geo-location" />
                                <FormControlLabel value="enter" control={<Radio />} label="Enter Manually" />
                            </RadioGroup>
                        </FormControl>

                        <br/>
                        
                        {
                            chooseStateCity 

                            &&
                            <div>
                                <FormControl sx={{m:1, width: '25ch'}}>
                                    <InputLabel id="state">State</InputLabel>
                                    <Select
                                    id="state-select"
                                    value={state}
                                    label="State"
                                    onChange={handleStateChange}
                                    >
                                    {
                                        states.map((s) => {
                                            return <MenuItem value={s.name} key={s.name}>{s.name}</MenuItem>
                                        })
                                    }
                                    </Select>
                                </FormControl>
                            
                            <br/>
                            
                                <FormControl sx={{m:1, width: '25ch'}}>
                                    <InputLabel id="city">City</InputLabel>
                                    <Select
                                    id="city-select"
                                    value={city}
                                    label="City"
                                    onChange={handleCityChange}
                                    >
                                    {
                                        cities.map((c) => {
                                            return <MenuItem value={c.name} key={c.name}>{c.name}</MenuItem>
                                        })
                                    }
                                    </Select>
                                </FormControl>
                            </div>

                        }

                        <br />
                        <TextField
                            required
                            id="pH"
                            name="pH"
                            label="pH"
                            type="number"
                            inputProps={{
                                step: "any"
                            }}
                        />
                        <br />
                        <TextField
                            required
                            id="rainfall"
                            name="rainfall"
                            label="Rainfall"
                            type="number"
                            inputProps={{
                                step: "any"
                            }}
                        />

                        <br />
                        <br />

                        <Button className='submitBtn' variant="contained" color="success" type="submit">Submit</Button>
                    </center>
                </div>

                <br/>
                <div>
                    {
                        crop
                        &&
                        <Alert severity="success">Recommended Crop is <b>{crop}</b></Alert>
                    }
                </div>
            </Box>
        </div>
    )
}