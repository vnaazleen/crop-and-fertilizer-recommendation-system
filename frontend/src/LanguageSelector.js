import React, { useEffect, useState } from "react";
import { Select, FormControl, InputLabel, MenuItem } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Contains the value and text for the options
const languages = [
//   { value: "", text: "Options" },
  { value: "en", text: "English" },
  { value: "hi", text: "हिंदी" },
  { value: "bn", text: "বাংলা" },
  { value: "te", text: "తెలుగు" },
  { value: "ta", text: "தமிழ்" },
  { value: "ml", text: "മലയാളം" },
  { value: "kn", text: "ಕನ್ನಡ" },
  { value: "mr", text: "मराठी" },
  { value: "gu", text: "ગુજરાતી" },
  { value: "pa", text: "ਪੰਜਾਬੀ" },
  { value: "ne", text: "नेपाली" },
  { value: "ur", text: "نیپالی" },
];

function LanguageSelector() {
  
  const { t } = useTranslation();
  const location = useLocation();
  

  let localLan = localStorage.getItem("i18nextLng");
  const [lang, setLang] = useState(localLan);
  
  if (localLan === null || localLan === "") {
    setLang("en");
  }

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    const language = queryParameters.get("lng");
    
    if (language != null) setLang(language);
    
  }, []);

  // This function put query that helps to change the language
  const handleChange = (e) => {
    console.log(location.pathname, navigator.language);
    let loc = "http://localhost:3000/";
    
    setLang(e.target.value);
    localStorage.setItem("language", e.target.value);
    window.location.replace(location.pathname + "?lng=" + e.target.value);
  };

  return (
    <div className="App" style={{position:'relative'}}>
      <FormControl
        className="selector"
        sx={{
          position: "fixed",
          bottom: "5%",
          right: "10%",
          width: "12rem",
          fontSize: "2rem",
          color: "white",
          borderColor: "white",
          fontSize: "20px",
          background: "#2525254c",
          borderRadius: "15px",
          "&:hover": { borderColor: "green", backgroundColor: "green" },
        }}
      >
        <InputLabel
          id="select-label"
          sx={{
            fontWeight: "900",
            color: "white",
            fontSize: "20px",
            borderRadius: "10px",
          }}
        >
          Language
        </InputLabel>
        <Select
          labelId="select-label"
          id="select"
          value={lang}
          label="Language"
          onChange={handleChange}
          sx={{
            fontWeight: "900",
            color: "white",
            borderRadius: "15px",
            border: "none",
            textDecoration: "none",
          }}
        >
          {languages.map((item) => {
            return (
              <MenuItem key={item.value} value={item.value}>
                {item.text}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}

export default LanguageSelector;
