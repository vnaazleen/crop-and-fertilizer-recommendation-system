import * as React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { Alert, Button, TextField, Box } from '@mui/material';

const URL = "http://127.0.0.1:5000/crops"

export default function CropRecommender() {

    const [crop, setCrop] = useState("")

    const handleSubmit = (event) => {
        event.preventDefault();
        const fromElements = event.target.elements;
        const formInput = {
            "N": fromElements["N"].value,
            "P": fromElements["P"].value,
            "K": fromElements["K"].value,
            "temperature": fromElements["temperature"].value,
            "humidity": fromElements["humidity"].value,
            "pH": fromElements["pH"].value,
            "rainfall": fromElements["rainfall"].value
        }

        console.log(formInput)

        axios.post(URL, formInput)
        .then((response) => {
            console.log(response.data)
            setCrop(response.data.crop)
        })
        .catch((error) => alert(error))
    }

    return (
        <div>
            <Box
              component="form"
              sx={{
                  '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
              autoComplete="off"
              onSubmit={e => handleSubmit(e)}
            >
                <div>
                    <center>
                        <h1>Crop Recommendation System</h1>
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
                        <TextField
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
                        <Button variant="contained" color="success" type="submit">Submit</Button>
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