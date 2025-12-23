const express = require("express");
const axios = require("axios");
const Athlete = require("../models/Athlete");

const router = express.Router();

/**
 * STEP 1: Redirect user to Strava authorization page
 */
router.get("/strava", (req, res) => {
  const authURL =
    "https://www.strava.com/oauth/authorize" +
    `?client_id=${process.env.STRAVA_CLIENT_ID}` +
    "&response_type=code" +
    `&redirect_uri=${process.env.STRAVA_REDIRECT_URI}` +
    "&approval_prompt=force" +
    "&scope=read,activity:read_all";

  res.redirect(authURL);
});

/**
 * STEP 2: Strava redirects back with authorization code
 */
router.get("/strava/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Authorization code missing");
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post(
      "https://www.strava.com/oauth/token",
      {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: "authorization_code"
      }
    );

    const {
      access_token,
      refresh_token,
      expires_at,
      athlete
    } = tokenResponse.data;

    // Save or update athlete in DB
    await Athlete.findOneAndUpdate(
      { athleteId: athlete.id },
      {
        athleteId: athlete.id,
        username: athlete.username,
        accessToken: access_token,
        refreshToken: refresh_token,
        tokenExpiresAt: expires_at
      },
      { upsert: true, new: true }
    );

    // For now, just confirm success
    res.send("Strava connected successfully. OAuth flow complete.");

  } catch (error) {
    console.error(
      "OAuth error:",
      error.response?.data || error.message
    );
    res.status(500).send("Strava OAuth failed");
  }
});

module.exports = router;
