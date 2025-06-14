import { Platform } from "react-native";
export const LOCALHOST = Platform.OS === "android" ? "10.0.2.2" : "localhost";

export const DEV_API = "http://192.168.0.139:3000";
// : `http://${LOCALHOST}:3000`;

export const PROD_API = "https://habitify-tawny.vercel.app";

export const API_URL = __DEV__ ? DEV_API : PROD_API;
