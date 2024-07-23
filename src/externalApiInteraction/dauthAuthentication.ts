import axios from "axios";
import config from "config";


export async function getAccessToken(code: string) {
    const queryparams = {
        client_id: config.get("dauth_client_Id") as string,
        client_secret: config.get("dauth_client_secret") as string,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "http://localhost:5000/home"
    };

    const URL = "https://auth.delta.nitt.edu/api/oauth/token";

    try {
        const response = await axios.post(URL, new URLSearchParams(queryparams).toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log("Access Token Response:", response.data);

        return response.data.access_token;
    } catch (error: any) {
        console.error("Error fetching access token:", error.message);
        throw error; 
    }
}

export async function getUserDetails(code: string) {
    console.log("Getting the Access Token");

    try {
        const access_token = await getAccessToken(code);
        console.log("GOT THE ACCESS TOKEN " + access_token);

        const userResources = await axios.post("https://auth.delta.nitt.edu/api/resources/user", {}, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        return userResources.data; 
    } catch (error: any) {
        console.error("Error fetching user details:", error.message);
        throw error;
    }
}
