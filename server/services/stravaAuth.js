const axios=require("axios");
const Athlete=require("../models/Athlete");
async function getValidAccessToken(){
    const athlete=await Athlete.findOne();
    
    if(!athlete){
        throw new Error("No athlete found. OAuth not completed.");
    }
    const now=Math.floor(Date.now() / 1000);
    if (athlete.tokenExpiresAt > now) {
        return athlete.accessToken;
      }
//getting refresh token and updating into DB
    const response = await axios.post(
        "https://www.strava.com/oauth/token",
        {
          client_id: process.env.STRAVA_CLIENT_ID,
          client_secret: process.env.STRAVA_CLIENT_SECRET,
          refresh_token: athlete.refreshToken,
          grant_type: "refresh_token"
        }
      );
      const {
        access_token,
        refresh_token,
        expires_at
      } = response.data;
      
    
  athlete.accessToken = access_token;
  athlete.refreshToken = refresh_token;
  athlete.tokenExpiresAt = expires_at;

  await athlete.save();

  return access_token;
}
module.exports = { getValidAccessToken };
