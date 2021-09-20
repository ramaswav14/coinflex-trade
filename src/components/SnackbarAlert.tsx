import * as React from "react";
import { Button, Snackbar, IconButton } from "@material-ui/core";

const SnackbarAlert = (props: any) => {
  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={props.onClose}>
        CLOSE
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={props.onClose}
      ></IconButton>
    </React.Fragment>
  );
  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={props.open}
        autoHideDuration={6000}
        onClose={props.onClose}
        message={props.message}
        action={action}
      />
    </div>
  );
};
export default SnackbarAlert;
