import axios from "axios";

export const axiosInstance = axios.create({});


export const apiConnector = (method, url, bodyData, headers, params) => {
    return axiosInstance({
        method: method,
        url: url,
<<<<<<< HEAD
        data: bodyData?bodyData:null, 
=======
        data: bodyData?bodyData:null,
>>>>>>> 7e87fc53e11de061f1f2f5a7317415c46ad4b89f
        headers: headers?headers:null,
        params: params?params:null
    })
};