import { CustomPaginationTable } from "@/components/CustomPaginationActionsTable";
import { useEffect, useState } from "react";
import * as loadsService from "@/services/LoadsService";
import { ColumnConfig } from "@/components/CustomPaginationActionsTable/Column.model";

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

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadsService.getLoadsPagination(
        paginationState.pageIndex,
        paginationState.pageSize
      );
      setDataRows(data.loads);
      setTotalPages(data.totalPages);
      console.log({dataRows: data.loads});

    };

    if (paginationState.pageIndex) {
      fetchData();
    }
  }, [paginationState]);

  const onChangePageEvent = (pageIndex: number, pageSize: number) => {
    setPaginationState({ pageIndex, pageSize });
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
    <CustomPaginationTable
      rows={dataRows}
      columnData={columns}
      totalPages={totalPages}
      changePageEvent={onChangePageEvent}
    />
  );
}

export default Dashboard;
