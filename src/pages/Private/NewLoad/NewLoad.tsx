import { styleModal } from "@/constants/styles";
import { Box } from "@mui/material";
import { NewLoadForm } from "./components";
import { useLoads } from "@/hooks/useLoads";
import { ILoadRequest } from "@/models/load.request";
import { LoadFormData } from "@/models";

function NewLoad() {
    const { postNewLoad, loading } = useLoads();

    const onSubmitHandler = async (event: LoadFormData) => {
        const request: ILoadRequest= {
            vendorName: event.vendorName,
            deleted: event.deleted ? 1 : 0,
            type: event.type,
            legData: (event.legDate as Date).toISOString()
        }
        const response = await postNewLoad(request);
        if (response.success) {
          console.log({response: response.data});
        }
    };
  return (
    <Box sx={{ ...styleModal, width: 400 }}>
      <NewLoadForm submitHandler={onSubmitHandler}/>
    </Box>
  );
}

export default NewLoad;
