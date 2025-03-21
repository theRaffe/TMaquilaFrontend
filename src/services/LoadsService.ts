import axios from "axios";
import getBaseHostApi from "./baseApiHost";


export async function getLoadsPagination(pageIndex:number, pageSize:number) {
    const host = getBaseHostApi()
    const { data } =  await axios.get<any>(
        `${host}/api/TMaquila/getLoadsPagination`,
        { params: { pageIndex, pageSize}}
    );

    return data;
}