import { FC, ReactElement } from "react";
import { Helmet } from "react-helmet";
import { makeStyles, createStyles } from "@material-ui/core/styles";

// components
import PageTitle from "../components/PageTitle";

// constants
import { PAGE_TITLE_ORDERS } from "../utils/constants";
// define css-in-js
const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flex: 1,
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      justifyContent: "space-between",
    },
  })
);

const Orders: FC<{}> = (): ReactElement => {
  const classes = useStyles();
  return (
    <>
      <Helmet> Orders </Helmet>
      <br />
      <div className={classes.root}>
        <PageTitle title={PAGE_TITLE_ORDERS} />
      </div>
    </>
  );
};

export default Orders;
