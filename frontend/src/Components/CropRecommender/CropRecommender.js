import * as React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { State, City }  from 'country-state-city';
import { Alert, Button, TextField, Box, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next'

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

    const [LangStates, setLangStates] = useState([])
    const [LangCities, setLangCities] = useState([])

    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)
    const [data, setData] = useState()
    
    const [formElements,setFormElements] = useState({});
    
    const { t } = useTranslation();
    let localLan = localStorage.getItem("i18nextLng");

    useEffect(() => {
        setStates(State.getStatesOfCountry("IN"))
    }, [country])

    // converting the states in english to required language
    useEffect(()=>{
        let localState = []
        if (localLan !== null || localLan !== "") {
            states.map(async(state)=>{
                const localStateValue = await translatorFunc('en',localLan,state.name);
                localState.push({...state,name:localStateValue});
            })
        }
        setLangStates(localState);
        console.log(localState);
    },[states])
    
    // converting the cities in english to required lanuguage when a city is selected
    useEffect(()=>{
        let values;

        (async()=>{
        
            values = await Promise.all(cities.map(async(city)=>{
                const Localcity = await translatorFunc('en',localLan,city.name);
                return {...city,name:Localcity}
            }))
            // .then((result)=>{
            //     console.log("values",result); // this works aswell
            // })
            
            setLangCities(values); // updating the cities
        })()
    
    },[cities])


    useEffect(()=>{
        if(data)
            makePostCall(formElements);
    },[data])

    async function translatorFunc(src,tar,text) {
        
        var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl="+ src + "&tl=" + tar + "&dt=t&q=" + encodeURI(text);
        const res = await fetch(url);
        const json = await res.json();
        const value = json[0][0][0];
        
        return value;
    }

    const makePostCall = (fromElements) =>{
        // const fromElements = event.target.elements;
        console.log("Data - ",data);

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
        .then( (response) => {
            setCrop(response.data.crop)
        })
        .catch((error) => alert(error))
    }


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!chooseStateCity) {
            getGeoLocation()
        }

        const rtvalue = await fetchTempertureAndHumidity();
        console.log("rt-",rtvalue);

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

        LangStates.forEach((state) => {
            if (state.name === event.target.value) {
                setCities(City.getCitiesOfState("IN", state.isoCode))
            }
        })
    }

    const handleCityChange = (event) => {
        setCity(event.target.value)

        LangCities.forEach((c) => {
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
                        <h1 className='heading'>🌾 {t('crs')} </h1>
                        <TextField
                            required
                            id="N"
                            name="N"
                            label={`${t('N')}`}
                            type="number"
                        />
                        <br />
                        <TextField
                            required
                            id="P"
                            name="P"
                            label={`${t('P')}`}
                            type="number"
                        />
                        <br />
                        <TextField
                            required
                            id="K"
                            name="K"
                            label={`${t('K')}`}
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
                            <FormLabel id="location">{t('loc')}</FormLabel>
                            <RadioGroup
                                defaultValue="geolocation"
                                name="radio-buttons-group"
                                onChange={handleLocationInfoChange}
                                required
                            >
                                <FormControlLabel value="geolocation" control={<Radio />} label={`${t('geoLoc')}`} />
                                <FormControlLabel value="enter" control={<Radio />} label={`${t('manual')}`} />
                            </RadioGroup>
                        </FormControl>

                        <br/>
                        
                        {
                            chooseStateCity 

                            &&
                            <div>
                                <FormControl sx={{m:1, width: '25ch'}}>
                                    <InputLabel id="state">{t('state')}</InputLabel>
                                    <Select
                                    id="state-select"
                                    value={state}
                                    label="State"
                                    onChange={handleStateChange}
                                    >
                                    {
                                        LangStates.map((s) => {
                                            return <MenuItem value={s.name} key={s.name}>{s.name}</MenuItem>
                                        })
                                    }
                                    </Select>
                                </FormControl>
                            
                            <br/>
                                
                                {
                                    state !== '' 

                                    &&

                                    <FormControl sx={{m:1, width: '25ch'}}>
                                        <InputLabel id="city">{t('city')}</InputLabel>
                                        <Select
                                        id="city-select"
                                        value={city}
                                        label="City"
                                        onChange={handleCityChange}
                                        >
                                        {
                                            LangCities.map((c) => {
                                                return <MenuItem value={c.name} key={c.name}>{c.name}</MenuItem>
                                            })
                                        }
                                        </Select>
                                    </FormControl>
                                }
                            </div>

                        }

                        <br />
                        <TextField
                            required
                            id="pH"
                            name="pH"
                            label={`${t('PH')}`}
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
                            label={`${t('rf')}`}
                            type="number"
                            inputProps={{
                                step: "any"
                            }}
                        />

                        <br />
                        <br />

                        <Button className='submitBtn' variant="contained" color="success" type="submit">{t('submit')}</Button>
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