import * as React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { State, City }  from 'country-state-city';
import { Alert, Button, TextField, Box, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

import './FertilizerRecommender.css';

const URL = "http://127.0.0.1:5000/fertilizer"

export default function FertilizerRecommender() {

    const [fertilizer, setFertilizer] = useState(-1)
    const [chooseStateCity, setChooseStateCity] = useState(false)

    const country = "India"
    const [state, setState] = useState("")
    const [city, setCity] = useState("")

    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    
    const [soilType, setSoilType] = useState("")
    const [cropType, setCropType] = useState("")
    
    const[formElements,setFormElements] = useState({});

    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)
    const [data, setData] = useState()

    const soilTypes = ["Black", "Clayey", "Loamy", "Red", "Sandy"];
    const cropTypes = ["Barley","Cotton","Ground Nuts","Maize","Millets","Oil seeds","Paddy","Pulses","Sugarcane","Tobacco", "Wheat"];
    const fertilizers=  ["10-26-26","14-35-14","17-17-17","20-20","28-28","DAP","Urea"]

    useEffect(() => {
        setStates(State.getStatesOfCountry("IN"))
    }, [country])

    useEffect(()=>{
        if(data)
            makePostCall(formElements);
        
    },[data]);

    
    const makePostCall = (fromElements) =>{
        // const fromElements = event.target.elements;
        // console.log("Data - ",data);
        const formInput = {
            "N": fromElements["N"].value,
            "P": fromElements["P"].value,
            "K": fromElements["K"].value,
            "temperature": data.main.temp,
            "humidity": data.main.humidity,
            "moisture": fromElements["moisture"].value,
            "soiltype": fromElements["soilType"].value,
            "croptype": fromElements["cropType"].value
        }
        console.log(formInput)

        axios.post(URL, formInput)
        .then(async (response) => {
            await setFertilizer(response.data.fertilizer)
        })
        .catch((error) => alert(error))
    }


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!chooseStateCity) {
            await getGeoLocation()
        }

        const rtvalue = await fetchTempertureAndHumidity();
        // console.log("rt-",rtvalue);

        setFormElements(event.target.elements);

        setData(()=>{
            return {...rtvalue};
        })

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
        let resp = {};
        await fetch(`${process.env.REACT_APP_WEATHER_API_URL}/weather/?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`)
            .then(res => res.json())
            .then(async (result) => {
                resp = result;
            })
        return resp;
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
        <div className='FertilizerRecommender'>
            <Box
              component="form"
              sx={{
                  '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
              autoComplete="off"
              onSubmit={e => handleSubmit(e)}
              className="fertilizerForm"
            >
                <div>
                    <center>
                        <h1 className='Fheading'>🌾 Fertilizer Recommendation System</h1>
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
                            id="moisture"
                            name="moisture"
                            label="Moisture"
                            type="number"
                            inputProps={{
                                step: "any"
                            }}
                        />
                        <br />

                        <FormControl sx={{m:1, width: '25ch'}}>
                            <InputLabel id="soilType">Soil Type</InputLabel>
                            <Select
                                id="select-soilType"
                                value={soilType}
                                name="soilType"
                                label="soilType"
                                onChange={(e)=>{setSoilType(e.target.value)}}
                                >
                                {
                                    soilTypes.map((s,idx) => {
                                        return <MenuItem value={idx} key={s+"-"+idx}>{s}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                        <br/>
                        <FormControl sx={{m:1, width: '25ch'}}>
                            <InputLabel id="cropType">Crop Type</InputLabel>
                            <Select
                                id="select-cropType"
                                value={cropType}
                                name="cropType"
                                label="cropType"
                                onChange={(e)=>{setCropType(e.target.value)}}
                                >
                                {
                                    cropTypes.map((s,idx) => {
                                        return <MenuItem value={idx} key={s+"-"+idx}>{s}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                        <br />
                        <br />

                        <Button className='FsubmitBtn' variant="contained" color="success" type="submit">Submit</Button>
                    </center>
                </div>

                <br/>
                <div>
                    {
                        fertilizer != -1
                        &&
                        <Alert severity="success">Recommended Fertilizer is <b>{fertilizers[fertilizer]}</b></Alert>
                    }
                </div>
            </Box>
        </div>
    )
}