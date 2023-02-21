#!/usr/bin/env node
//imports
import minimist from "minimist";
import moment from "moment-timezone";
import fetch from "node-fetch";

//help stuff
const args = minimist(process.argv.slice(2));

if (args.h != null) {
  console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit`);
  process.exit(0);
}

//fetch API call and URL Building
//moment.tz.guess()
// extracts system timezone

let timezone = moment.tz.guess();
if (args.z != null) {
  timezone = args.z;
}

// make and set latitude and longitude

let latitude = 0;
let longitude = 0;

if ("n" in args) {
  if ("s" in args) {
    console.log("Cannot specify LATITUDE twice");
  } else {
    latitude = args.n;
  }
} else if ("s" in args) {
  if ("n" in args) {
    console.log("Cannot specify LATITUDE twice");
  } else {
    latitude = -args.s;
  }
} else {
  console.log("Latitude must be in range");
}

if ("e" in args) {
  if ("w" in args) {
    console.log("Cannot specify LONGITUDE twice");
  } else {
    longitude = args.e;
  }
} else if ("w" in args) {
  if ("e" in args) {
    console.log("Cannot specify LONGITUDE twice");
  } else {
    longitude = -args.w;
  }
} else {
  console.log("Longitude must be in range");
}

// create const url

const baseUrl = "https://api.open-meteo.com/v1/forecast?";
const url =
  baseUrl +
  "latitude=" +
  latitude +
  "&longitude=" +
  longitude +
  "&timezone=" +
  timezone +
  "&daily=precipitation_hours";

const response = await fetch(url);
const data = await response.json();

// create const days

const days = args.d;

// if j, exit

if (args.j == true) {
  console.log(data);
  process.exit(0);
}

// create response text

if (days == 0) {
  console.log("today.");
  if ((data.daily.precipitation_hours[0] = 0)) {
    console.log("You will not need your galoshes ");
  } else {
    console.log("You might need your galoshes ");
  }
} else if (days > 1) {
  console.log("in " + days + " days.");
  if ((data.daily.precipitation_hours[days] = 0)) {
    console.log("You will not need your galoshes ");
  } else {
    console.log("You might need your galoshes ");
  }
} else {
  console.log("tomorrow.");
  if ((data.daily.precipitation_hours[days] = 0)) {
    console.log("You will not need your galoshes ");
  } else {
    console.log("You might need your galoshes ");
  }
}
