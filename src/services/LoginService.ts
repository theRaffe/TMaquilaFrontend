import axios from "axios";
import getBaseHostApi from "./baseApiHost";


export async function registerUserAccess() {
    const host = getBaseHostApi()
    return axios.get<unknown>(
        `${host}/api/TMaquila/registerAccess`
    );
}