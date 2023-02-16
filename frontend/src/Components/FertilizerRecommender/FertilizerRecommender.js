import * as React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { State, City }  from 'country-state-city';
import { Alert, Button, TextField, Box, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next'
import FertilizerImage from '../images/fertilizer.png';


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

    const [LangStates, setLangStates] = useState([])
    const [LangCities, setLangCities] = useState([])
    
    const [soilType, setSoilType] = useState("")
    const [cropType, setCropType] = useState("")
    
    const[formElements,setFormElements] = useState({});

    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)
    const [data, setData] = useState()
    
    const { t } = useTranslation();
    let localLan = localStorage.getItem("i18nextLng");



    // const soilTypes = ["Black", "Clayey", "Loamy", "Red", "Sandy"];
    const soilTypes = [t('Black'),t('Clayey'),t('Loamy'),t('Red'),t('Sandy')]
    // const cropTypes = ["Barley","Cotton","Ground Nuts","Maize","Millets","Oil seeds","Paddy","Pulses","Sugarcane","Tobacco", "Wheat"];
    const cropTypes = [t('Barley'),t('Cotton'),t('Ground Nuts'),t('Maize'),t('Millets'),t('Oil seeds'),t('Paddy'),t('Pulses'),t('Sugarcane'),t('Tobacco'),t('Wheat')]
    const fertilizers=  ["10-26-26","14-35-14","17-17-17","20-20","28-28","DAP","Urea"]


    useEffect(() => {
        setStates(State.getStatesOfCountry("IN"))
    }, [country])

    // converting the states in english to required language
    useEffect(()=>{
        let localState = []
        if (localLan !== null || localLan !== "") {
            states.map(async(state)=>{
                const localStateValue = await translatorFunc('en',localLan,state.name);
                localState.push({...state,name:(Array.isArray(localStateValue) && !localStateValue.length)?state.name:localStateValue});
            })
        }
        setLangStates(localState);
        // console.log(localState);
    },[states])

    
    // converting the cities in english to required lanuguage when a city is selected
    useEffect(()=>{
        let values;
        (async()=>{
        
            values = await Promise.all(cities.map(async(city)=>{
                const Localcity = await translatorFunc('en',localLan,city.name);
                return {...city,name:(Array.isArray(Localcity) && !Localcity.length)?city.name:Localcity}
            })).catch((err)=>{
                return err + " Mainly due to Internet Issue! ";
            })
            // .then((result)=>{
            //     console.log("values",result); // this works aswell
            // })
            
            setLangCities(values); // updating the cities
        })()
    
    },[cities])


    useEffect(()=>{
        if(data)
            makePostCall(formElements);

    },[data]);

    const handleError = (err) => {
        console.warn(err, " Mainly due to Internet Issue! ");
    }

    async function translatorFunc(src,tar,text) {
        
        var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl="+ src + "&tl=" + tar + "&dt=t&q=" + encodeURI(text);
        try
        {
            const res = await (fetch(url).catch(handleError));
            const json = await (res.json().catch(handleError));
            const value = json[0][0][0];
            return value;
        }
        catch
        {
            console.warn("Internet Issue");
            return [];
        }
        
        
    }
    
    const makePostCall = (fromElements) =>{
        // const fromElements = event.target.elements;
        // console.log("Data - ",data);
        const formInput = {
            "N": Number(fromElements["N"].value),
            "P": Number(fromElements["P"].value),
            "K": Number(fromElements["K"].value),
            "temperature": data.temp,
            "humidity": data.humid,
            "moisture": Number(fromElements["moisture"].value),
            "soiltype": Number(fromElements["soilType"].value),
            "croptype": Number(fromElements["cropType"].value)
        }
        console.log(formInput)

        axios.post(URL, formInput)
        .then( (response) => {
            setFertilizer(response.data.fertilizer)
        })
        .catch((error) => alert(error))
    }


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!chooseStateCity) {
            getGeoLocation()
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

        // console.log(event.target.value)
    }

    const getAvgTemperatureAndHumidity = async () =>{
        
        let avgTemp = [];
        let avgHumidity=[];
        const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;

        let todayDate = new Date();
        let endDate = new Date();
        endDate.setMonth(todayDate.getMonth()+3);

        for (let index = 1; index <= 10; index++) {
        
            todayDate.setFullYear(todayDate.getFullYear()-1)
            endDate.setFullYear(endDate.getFullYear()-1)
        
            await fetch(`https://archive-api.open-meteo.com/v1/era5?latitude=${latitude}&longitude=${longitude}&start_date=${todayDate.toISOString().slice(0, 10)}&end_date=${endDate.toISOString().slice(0, 10)}&hourly=temperature_2m,relativehumidity_2m`)
                .then(res => res.json())
                .then(async (result) => {
                    avgTemp.push(average(result.hourly.temperature_2m));
                    avgHumidity.push(average(result.hourly.relativehumidity_2m));
            })
        }
        return {temp:Math.round(average(avgTemp)*100)/100,humid:Math.round(average(avgHumidity)*100)/100}
    }
    
    const fetchTempertureAndHumidity = async () => {
        let resp = {};
        resp = await getAvgTemperatureAndHumidity();
        return {...resp};
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
        // console.log(" state changed ");
        let checkStates = []
        LangStates.length != 0 ? checkStates = LangStates : checkStates = states
       
        checkStates.forEach((state) => {
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
                        <h1 className='Fheading'><img src={FertilizerImage}></img> {t('Fertilizer Recommendation System')} </h1>
                        <TextField
                            required
                            id="N"
                            name="N"
                            label={`${t('Nitrogen')} (mg/kg) `}
                            type="number"
                        />
                        <br />
                        <TextField
                            required
                            id="P"
                            name="P"
                            label={`${t('Phosphorus')} (mg/kg)`}
                            type="number"
                        />
                        <br />
                        <TextField
                            required
                            id="K"
                            name="K"
                            label={`${t('Potassium')} (mg/kg)`}
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
                            <FormLabel id="location">{t('Location')}</FormLabel>
                            <RadioGroup
                                defaultValue="geolocation"
                                name="radio-buttons-group"
                                onChange={handleLocationInfoChange}
                                required
                            >
                                <FormControlLabel value="geolocation" control={<Radio />} label={`${t('Get via Geo-location')}`} />
                                <FormControlLabel value="enter" control={<Radio />} label={`${t('Enter Manually')}`} />
                            </RadioGroup>
                        </FormControl>

                        <br/>

                        {
                            chooseStateCity 
                            &&
                            <div>
                                <FormControl sx={{m:1, width: '25ch'}}>
                                    <InputLabel id="state">{t('State')}*</InputLabel>
                                    <Select
                                    required
                                    id="state-select"
                                    value={state}
                                    label="State"
                                    onChange={handleStateChange}
                                    >
                                    {
                                        LangStates.length != 0 ?
                                            LangStates.map((s) => {
                                                return <MenuItem value={s.name} key={s.name}>{s.name}</MenuItem>
                                            }) :
                                            states.map((s) => {
                                                return <MenuItem value={s.name} key={s.name}>{s.name}</MenuItem>
                                            })
                                    }
                                    </Select>
                                </FormControl>
                            
                            <br/>

                            {
                                state !== ""
                                &&
                                <FormControl sx={{m:1, width: '25ch'}}>
                                    <InputLabel id="city">{t('City')}*</InputLabel>
                                    <Select
                                    required
                                    id="city-select"
                                    value={city}
                                    label="City"
                                    onChange={handleCityChange}
                                    >
                                    {   
                                        LangCities.length != 0 ?
                                            LangCities.map((c) => {
                                                // console.log(c);
                                                return <MenuItem value={c.name} key={c.name}>{c.name}</MenuItem>
                                            }) : 
                                            cities.map((c) => {
                                                // console.log(c);
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
                            id="moisture"
                            name="moisture"
                            label={`${t('Moisture')} (g/m³)`}
                            type="number"
                            inputProps={{
                                step: "any"
                            }}
                        />
                        <br />

                        <FormControl sx={{m:1, width: '25ch'}}>
                            <InputLabel id="soilType">{t('Soil Type')}*</InputLabel>
                            <Select
                                required
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
                            <InputLabel id="cropType">{t('Crop Type')}*</InputLabel>
                            <Select
                                required
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
                        <div>
                        </div>
                        <br />

                        <Button className='FsubmitBtn' variant="contained" color="error" type="submit">{t('Submit')}</Button>
                    </center>
                </div>
                <br/>
                <div>
                    {
                        fertilizer != -1
                        &&
                        <Alert severity="success">{t('Recommended Fertilizer is')} <b>{fertilizers[fertilizer]}</b></Alert>
                    }
                </div>
                
            </Box>
        </div>
    )
}