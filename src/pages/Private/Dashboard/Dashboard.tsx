import { CustomPaginationTable } from "@/components/CustomPaginationActionsTable";
import { useEffect, useState } from "react";
import * as loadsService from "@/services/LoadsService";
import { ColumnConfig } from "@/components/CustomPaginationActionsTable/Column.model";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { NewLoad } from "../NewLoad";
import { PostNewLoadResponse } from "@/models";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

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

  const { vertical, horizontal, open: openNewLoadAlert } = stateNewLoad;

  const handleOpen = () => {
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

  const columns: ColumnConfig[] = [
    {
      width: 30,
      label: "Id Row",
      dataKey: "id",
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
        <Button onClick={handleOpen}>Add New</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <NewLoad handleNewLoadEvt={onHandleNewLoadEvt} />
        </Modal>
      </Box>

      <CustomPaginationTable
        rows={dataRows}
        columnData={columns}
        totalPages={totalPages}
        filterFn={filterFn}
        changePageEvent={onChangePageEvent}
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
          New Load created!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Dashboard;
