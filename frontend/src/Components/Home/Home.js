import './Home.css'

import { Button } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useTranslation } from 'react-i18next'

export default function Home() {
    const { t } = useTranslation();
    return (
        <div className="Home">
            <div className='Buttons'>
            <Button 
             sx={{ color: 'white', 
                   borderColor: 'white',
                   fontSize:'20px',
                   background:'#252525a6',
                   "&:hover": { borderColor: "green", backgroundColor: "green" } 
                }}
             className="Btn1" 
             variant="outlined"
             href="/crop-recommender"
            >
                <b>{t('crecom')}</b>
            </Button>
                &nbsp; &nbsp;
            <Button 
             sx={{ color: 'white', 
                    borderColor: 'white',
                    fontSize:'20px',
                    background:'#252525a6',
                    "&:hover": { borderColor: "green", backgroundColor: "green" } 
                }}
             className="Btn1" 
             variant="outlined"
             href="/fertilizer-recommender"
            >
                <b>{t('frecom')}</b>
            </Button>
            </div>
        </div>
    )
}