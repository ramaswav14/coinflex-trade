import { DataGrid } from "@mui/x-data-grid";
import { useEffect } from "react";

export default function Orders(props: any) {
  const columns = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "type", headerName: "Type", width: 200 },
    { field: "instrument", headerName: "Instrument", width: 200 },
    {
      field: "ask",
      headerName: "Ask",
      type: "number",
      width: 200,
    },
    { field: "bid", headerName: "Bid", width: 200 },
  ];
  //   const [rows, setRows] = useState([]);

  useEffect(() => {
    //console.log(props.renderOrders);
    //@ts-ignore.
    // const orders = JSON.parse(localStorage.getItem("orders")) || [];
    // const OrdersArray = orders.map((order: any, id: number) => {
    //   const [type, instrument, ask, bid] = order;
    //   return {
    //     id: id + 1,
    //     type,
    //     instrument,
    //     ask,
    //     bid,
    //   };
    // });
    // setRows(() => {
    //   return OrdersArray;
    // });
  }, []);

  return (
    <div style={{ height: 500, width: "100%" }}>
      <DataGrid rows={props.renderOrders} columns={columns} />
    </div>
  );
}
