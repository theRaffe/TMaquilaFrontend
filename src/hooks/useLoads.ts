import { ILoadRequest } from "@/models/load.request";
import { PostNewLoadResponse } from "@/models/load.response";
import * as loadService from '@/services/LoadsService';
import { useState } from "react";

export const useLoads = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const postNewLoad = async (request: ILoadRequest):Promise<PostNewLoadResponse>  => {
        setLoading(true);
        setError(null);
        try {
            const response = await loadService.postNewLoad(request);
            setLoading(false);
            return { success: true, data: response };
        } catch(err: any) {
            setLoading(false);
            setError(err);
          return { success: false, error: err.message };
        }
    }

    return { postNewLoad, loading, error };
}