import { styleModal } from "@/constants/styles";
import { Box } from "@mui/material";
import { NewLoadForm } from "./components";
import { useLoads } from "@/hooks/useLoads";
import { ILoadRequest } from "@/models/load.request";
import { LoadFormData, PostNewLoadResponse } from "@/models";

interface Props {
  handleNewLoadEvt: (param: PostNewLoadResponse) => void;
}

function NewLoad({handleNewLoadEvt}: Props) {
    const { postNewLoad, loading } = useLoads();

    const onSubmitHandler = async (event: LoadFormData) => {
        const request: ILoadRequest= {
            vendorName: event.vendorName,
            deleted: event.deleted ? 1 : 0,
            type: event.type,
            legDate: (event.legDate as Date).toISOString()
        }
        const response = await postNewLoad(request);
        if (response.success) {
          console.log({response: response.data});
        }
        handleNewLoadEvt(response);
    };
  return (
    <Box sx={{ ...styleModal, width: 400 }}>
      <NewLoadForm submitHandler={onSubmitHandler}/>
    </Box>
  );
}

export default NewLoad;
