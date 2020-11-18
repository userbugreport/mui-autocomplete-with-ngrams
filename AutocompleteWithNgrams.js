import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Grid, InputAdornment, TextField, Typography } from "@material-ui/core";
import html5colors from "./colors.json";
import moreColors from "./more-colors.json";
import allTheColors from "./colornames-top-20k.json";
// import colors from "./colors-cn.json";
import tryItLive from "./try-it-live.png";
import tryItLiveMobile from "./try-it-live-mobile.png";

const COLOR_TYPES = { allTheColors, html5colors, moreColors };

export const DemoCallout = ({ children }) => (
  <Grid container justify="center" alignItems="center" spacing={2}>
    <Grid item xs={12} sm={6}>
      {children}
    </Grid>
    <Grid item xs={12} sm={6}>
      <img
        src={window.innerWidth < 700 ? tryItLiveMobile : tryItLive}
        style={{ width: "100%" }}
      />
    </Grid>
  </Grid>
);

const SampleColor = ({ hex }) => (
  <div
    style={{
      display: "inline-block",
      marginBottom: 3,
      height: 20,
      width: 20,
      backgroundColor: hex,
      border: "1px solid grey",
    }}
  />
);

String.prototype.ngrams = function (n) {
  var r = [];

  for (var j = 1; j <= n; j++) {
    for (var i = 0; i <= this.toLowerCase().length - j; i++) {
      r.push(this.toLowerCase().substring(i, i + j));
    }
  }

  return r;
};

function intersect(array1, array2) {
  return array1.filter((value) => array2.includes(value));
}

export const BasicAutocomplete = () => {
  return (
    <Autocomplete
      options={html5colors}
      getOptionLabel={(option) => option.displayName}
      renderInput={(params) => (
        <TextField {...params} label="Colors" variant="outlined" />
      )}
      style={{ width: 300 }}
    />
  );
};

export const AutocompleteWithSwatch = ({ colorType }) => {
  const colors = COLOR_TYPES[colorType] || html5colors;
  return (
    <Autocomplete
      options={colors}
      getOptionLabel={(option) => option.displayName}
      renderInput={(params) => {
        const selectedColor = colors.find(
          ({ displayName }) => displayName == params.inputProps.value
        );
        return (
          <TextField
            {...params}
            label="Colors"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              startAdornment: selectedColor && (
                <InputAdornment position="start">
                  <SampleColor hex={selectedColor.hex} />
                </InputAdornment>
              ),
            }}
          />
        );
      }}
      renderOption={({ displayName, hex }) => (
        <div>
          <SampleColor hex={hex} />{" "}
          <Typography noWrap style={{ display: "inline-block" }}>
            {displayName}
          </Typography>
        </div>
      )}
      style={{ width: 300 }}
    />
  );
};

export const AutocompleteWithTrigrams = ({ initialValue, colorType }) => {
  const colors = COLOR_TYPES[colorType] || html5colors;
  return (
    <Autocomplete
      options={colors}
      getOptionLabel={(option) => option.displayName}
      filterOptions={(options, state) => {
        const { inputValue } = state;
        if (!inputValue) {
          return options.slice(0, 1000);
        }
        const inputTrigrams = inputValue.ngrams(3);
        return (
          options
            // iterate over each option and compute intersect(ngram(search), all_color_ngrams)
            .map((option) => {
              const nMatches = intersect(
                inputTrigrams, // ngrams of search input (i.e. "crnflower")
                option.displayName.ngrams(3) // ngrams of the option (i.e. "cornflowerblue")
              ).length;
              return {
                ...option,
                nMatches,
              };
            })
            // toss out anything that had no matches
            .filter(({ nMatches }) => nMatches > 0)
            // for sanity's sake we'll only display the top 10 results. we're going to
            // order by `nMatches`. in the event of a tie the shorter word wins.
            //
            // i.e. if we're searching for "blue" then "Blue" is #1 and "Green Blue" #2
            .sort((a, b) => {
              const diff = b.nMatches - a.nMatches;
              if (diff) {
                return diff;
              }
              // if they have the same number off matching trigrams, shorter one wins
              return a.displayName.length - b.displayName.length;
            })
            // return the top 10
            .slice(0, 10)
        );
      }}
      renderInput={(params) => {
        const selectedColor = colors.find(
          ({ displayName }) => displayName == params.inputProps.value
        );
        return (
          <TextField
            {...params}
            label="Colors"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              startAdornment: selectedColor && (
                <InputAdornment position="start">
                  <SampleColor hex={selectedColor.hex} />
                </InputAdornment>
              ),
            }}
          />
        );
      }}
      renderOption={({ displayName, hex }) => (
        <div>
          <SampleColor hex={hex} />{" "}
          <Typography noWrap style={{ display: "inline-block" }}>
            {displayName}
          </Typography>
        </div>
      )}
      style={{ width: 300 }}
    />
  );
};

export default AutocompleteWithTrigrams;
