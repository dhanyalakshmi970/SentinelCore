import axios from "axios";

export const login=(username,password)=>
    axios.post('http://localhost:8080/api/auth/login',{ username,password});
export const refreshAccessToken = (refreshToken)=>
    axios.post('http://localhost:8080/api/auth/refresh',{refreshToken});