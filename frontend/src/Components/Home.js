import './Home.css'

import { Button } from '@mui/material';

export default function Home() {
    return (
        <div className="Home">
            <div className='Buttons'>
            <Button 
             sx={{ color: 'white', 
                   borderColor: 'white',
                   "&:hover": { borderColor: "green", backgroundColor: "green" } 
                }}
             className="Btn1" 
             variant="outlined"
             href="/crop-recommender"
            >
                Crop Recommender
            </Button>
                &nbsp; &nbsp;
            <Button 
             sx={{ color: 'white', 
                    borderColor: 'white',
                    "&:hover": { borderColor: "green", backgroundColor: "green" } 
                }}
             className="Btn1" 
             variant="outlined"
            >
                Fertilizer Recommender
            </Button>
            </div>
        </div>
    )
}