import { styleModal } from "@/constants/styles";
import { Box } from "@mui/material";
import { NewLoadForm } from "./components";
import { useLoads } from "@/hooks/useLoads";
import { ILoadRequest } from "@/models/load.request";
import { LoadActionEnum, LoadFormData, PostNewLoadResponse } from "@/models";

interface Props {
  handleSaveChangesEvt: (param: PostNewLoadResponse) => void;
  loadAction?: LoadActionEnum;
  loadRequest?: any;
}

function NewLoad({
  handleSaveChangesEvt,
  loadAction = LoadActionEnum.NEW_LOAD,
  loadRequest,
}: Props) {
  const { postNewLoad, loading } = useLoads();

  const onSubmitHandler = async (event: LoadFormData) => {
    const request: ILoadRequest = {
      vendorName: event.vendorName,
      deleted: event.deleted ? 1 : 0,
      type: event.type,
      legDate: (event.legDate as Date).toISOString(),
    };

    if (loadAction === LoadActionEnum.UPDATE_LOAD) {
      request.id = loadRequest.id;
    }

    const response = await postNewLoad(request);
    if (response.success) {
      console.log({ response: response.data });
    }
    handleSaveChangesEvt(response);
  };
  return (
    <Box sx={{ ...styleModal, width: 400 }}>
      <NewLoadForm
        submitHandler={onSubmitHandler}
        loadAction={loadAction}
        loadRequest={loadRequest}
      />
    </Box>
  );
}

export default NewLoad;
