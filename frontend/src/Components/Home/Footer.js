import { Box, Container, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import "./Footer.css";

const Footer = () => {
  const [localText, setLocalText] = React.useState([]);

  const texts = [
    "Crop and Fertilizer Recommendation System",
    "Crop Recommender",
    "Fertilizer Recommender",
  ];

  const localLan = localStorage.getItem("i18nextLng");
  useEffect(() => {
    let values;

    (async () => {
      values = await Promise.all(
        texts.map(async (instruction) => {
          const Local = await translatorFunc("en", localLan, instruction);
          return Local;
        })
      ).catch((err) => {
        return err + " Mainly due to Internet Issue! ";
      });
      setLocalText(values);
    })();
  }, []);

  async function translatorFunc(src, tar, text) {
    try {
      var url =
        "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" +
        src +
        "&tl=" +
        tar +
        "&dt=t&q=" +
        encodeURI(text);
      const res = await fetch(url).catch("handleError");
      const json = await res.json().catch("handleError");
      const value = json[0][0][0];
      console.log(value);
      if (value === "" || value.length === 0) {
        return text;
      }
      return value;
    } catch {
      console.warn("Internet Issue");
      return [];
    }
  }

  return (
    <div>
      <Box
        sx={{
          width: "100%",
          height: "auto",
          color: "#fff",
          backgroundColor:"green",
          paddingTop: "1rem",
          paddingBottom: "1rem",
        }}
      >
        <Container maxWidth="lg">
          <br/><br/>
          <Grid container direction="column" alignItems="center">
            <Grid item xs={12}>
              <Typography color="#fff" variant="h5" className="title">
                {localText[0] ? localText[0] : texts[0]}
              </Typography>
            </Grid>
            <br />
            <br/>
            <Grid item xs={12}>
              <Typography color="#fff" variant="subtitle1">
                {`${new Date().getFullYear()} | ${
                  localText[1] ? localText[1] : texts[1]
                } | ${localText[2] ? localText[2] : texts[2]}`}
              </Typography>
            </Grid>
          </Grid>
          <br/>
        </Container>
      </Box>
    </div>
  );
};

export default Footer;
