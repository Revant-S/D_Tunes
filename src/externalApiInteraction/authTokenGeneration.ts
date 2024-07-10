import axios from 'axios';
import config from "config"
const client_id = config.get("client_id");
const client_secret = config.get("client_secret");

interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}


export async function getToken(): Promise<string> {
    const auth = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
    const response = await axios.post<TokenResponse>('https://accounts.spotify.com/api/token',
        new URLSearchParams({
            'grant_type': 'client_credentials',
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${auth}`,
            },
        }
    );
    let token = response.data.access_token
    return token;
}


