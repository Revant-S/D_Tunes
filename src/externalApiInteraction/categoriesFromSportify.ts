import axios from "axios";
import { getToken } from "./authTokenGeneration";

const api = axios.create({
  baseURL: "https://api.spotify.com/v1",
  withCredentials: true
});

export async function getCategories() {
  try {
    const access_token = await getToken();
    console.log(access_token);

    const response = await api.get("/browse/categories", {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    return response.data.categories.items
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}
