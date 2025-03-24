import { CustomPaginationTable } from "@/components/CustomPaginationActionsTable";
import { ColumnConfig } from "@/components/CustomPaginationActionsTable/Column.model";
import { LoadActionEnum, PostNewLoadResponse } from "@/models";
import * as loadsService from "@/services/LoadsService";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { NewLoad } from "../NewLoad";

interface State extends SnackbarOrigin {
  open: boolean;
}

function Dashboard() {
  interface PaginationState {
    pageIndex: number;
    pageSize: number;
  }
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 0,
  });
  const [dataRows, setDataRows] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [open, setOpen] = useState(false);
  const [stateNewLoad, setStateNewLoad] = useState<State>({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const [loadAction, setLoadAction] = useState(LoadActionEnum.NEW_LOAD);
  const [loadRequest, setLoadRequest] = useState();

  const { vertical, horizontal, open: openNewLoadAlert } = stateNewLoad;

  const handleNewLoad = () => {
    setLoadAction(LoadActionEnum.NEW_LOAD)
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadsService.getLoadsPagination(
        paginationState.pageIndex,
        paginationState.pageSize
      );
      setDataRows(data.loads);
      setTotalPages(data.totalPages);
      console.log({ dataRows: data.loads });
    };

    if (paginationState.pageIndex) {
      fetchData();
    }
  }, [paginationState]);

  const onChangePageEvent = (pageIndex: number, pageSize: number) => {
    setPaginationState({ pageIndex, pageSize });
  };

  const handleFilterChange = (e) => {
    const target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value == "") return items;
        else {
          //console.log({value: target.value, items});
          const valueSearch = target.value.toLowerCase();
          return items.filter((item) => {
            console.log({ item, value: valueSearch });
            return item.vendorName.toLowerCase().includes(valueSearch);
          });
        }
      },
    });
  };

  /**
   * Handler of NewLoad Modal's submit button
   *
   * @param response response of create new Load API
   */
  const onHandleNewLoadEvt = (response: PostNewLoadResponse) => {
    if (response.success) {
      setOpen(false);
      setStateNewLoad({ ...stateNewLoad, open: true });
    }
  };

  const onEditLoadEvent = (row: any) => {
    setLoadAction(LoadActionEnum.UPDATE_LOAD);
    setLoadRequest(row);
    setOpen(true);
  }

  const columns: ColumnConfig[] = [
    {
      width: 30,
      label: "Id",
      dataKey: "id",
      disableSorting: true
    },
    {
      width: 100,
      label: "Vendor Name",
      dataKey: "vendorName",
    },
    {
      width: 50,
      label: "Leg Date",
      dataKey: "legDate",
    },
    {
      width: 20,
      label: "Deleted",
      dataKey: "deleted",
    },
    {
      width: 50,
      label: "Created At",
      dataKey: "createdAt",
    },
  ];

  return (
    <Box
      sx={{
        marginBottom: 2,
        gap: 2,
        display: "flex",
        flexFlow: "column",
        padding: 8,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <TextField
          label="Filter by Vendor"
          variant="outlined"
          onChange={handleFilterChange}
          fullWidth
          sx={{ maxWidth: 400 }}
        />
        <Button onClick={handleNewLoad}>Add New</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <NewLoad handleSaveChangesEvt={onHandleNewLoadEvt} loadAction={loadAction} loadRequest={loadRequest}/>
        </Modal>
      </Box>

      <CustomPaginationTable
        rows={dataRows}
        columnData={columns}
        totalPages={totalPages}
        filterFn={filterFn}
        changePageEvent={onChangePageEvent}
        editRowEvent={onEditLoadEvent}
  
      />

      {/* */}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openNewLoadAlert}
        key={"successNewLoad"}
        autoHideDuration={5000}
        onClose={() => setStateNewLoad({ ...stateNewLoad, open: false })}
      >
        <Alert
          onClose={() => setStateNewLoad({ ...stateNewLoad, open: false })}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          { loadAction === LoadActionEnum.UPDATE_LOAD ? 'Saved Changes!!' : 'New Load created!' }
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Dashboard;
