import axios from "axios";
import getBaseHostApi from "./baseApiHost";
import { ILoadRequest } from "@/models/load.request";


export async function getLoadsPagination(pageIndex:number, pageSize:number) {
    const host = getBaseHostApi()
    const { data } =  await axios.get<any>(
        `${host}/api/TMaquila/getLoadsPagination`,
        { params: { pageIndex, pageSize}}
    );

    return data;
}

/**
 * TODO: use real API
 * @param request object to create a new load
 */
export async function postNewLoad(request: ILoadRequest) {
    const promiseReq  = new Promise<ILoadRequest>((resolve) => resolve(request));
    const result = await promiseReq;

    return result;
}