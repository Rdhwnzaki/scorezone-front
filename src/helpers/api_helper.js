import axios from "axios";
import { api } from "../config";

// default
axios.defaults.baseURL = api.API_URL;
axios.defaults.timeout = 180000;
axios.defaults.headers.post["Content-Type"] = "application/json";

// content type
const token = JSON.parse(sessionStorage.getItem("authUser"))
    ? JSON.parse(sessionStorage.getItem("authUser")).token
    : null;
if (token) axios.defaults.headers.common["Authorization"] = "Bearer " + token;

// console.log('token', axios.defaults.headers.common);

axios.interceptors.response.use(
    function (response) {
        return response.data ? response.data : response;
    },
    function (error) {
        const originalRequest = error.config;

        if (error.response.status === 403 || error.response.status === 401) {
            // && originalRequest.url === api.API_URL + "/refresh"
            window.location = "/logout";
            return Promise.reject(error);
        }

        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            window.location = "/logout";
        }
        return Promise.reject(error);
    }
);
/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token) => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

class APIClient {
    getOne = (url, id) => {
        return axios.get(url + "/" + id);
    };

    get = (url, params, path) => {
        const token = JSON.parse(sessionStorage.getItem("authUser"))
            ? JSON.parse(sessionStorage.getItem("authUser")).token
            : null;
        if (token)
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;

        // console.log('token di get', axios.defaults.headers.common);
        let response;

        let paramKeys = [];

        if (path) url = url + path;

        if (params) {
            Object.keys(params).map((key) => {
                paramKeys.push(key + "=" + params[key]);
                return paramKeys;
            });

            const queryString =
                paramKeys && paramKeys.length ? paramKeys.join("&") : "";
            response = axios.get(`${url}?${queryString}`, params);
        } else {
            response = axios.get(`${url}`, params);
        }

        return response;
    };

    getId = (url, data) => {
        return axios.get(url + "/" + data.id, data);
    };

    post = (url, data) => {
        return axios.post(url, data);
    };

    postImg = (url, data) => {
        return axios.post(url, data, {
            headers: {
                "content-type": "multipart/form-data", // do not forget this
            },
        });
    };

    put = (url, data) => {
        return axios.put(url + "/" + data.id, data);
    };

    patch = (url, data) => {
        return axios.patch(url + "/" + data.id, data);
    };

    patchImg = (url, data) => {
        let formObject = Object.fromEntries(data.entries());
        let id = data.id;
        console.log(formObject);
        if (!id) id = formObject.id;

        return axios.patch(url + "/" + id, data, {
            headers: {
                "content-type": "multipart/form-data", // do not forget this
            },
        });
    };

    delete = (url, data) => {
        if (!data.id) {
            data = { id: data };
        }
        return axios.delete(url + "/" + data.id, data);
    };
}

export { APIClient, setAuthorization };
