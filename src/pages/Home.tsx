import { FC, ReactElement, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { makeStyles, createStyles } from "@material-ui/core/styles";

// components
import PageTitle from "../components/PageTitle";
import { Button, CardContent, Grid, Typography } from "@material-ui/core";
import { Card, Divider, CardHeader } from "@material-ui/core";
// constants
import {
  APP_TITLE,
  PAGE_TITLE_HOME,
  DEPTH,
  BTC_USD_SWAP_LIN,
  ETH_USD_SWAP_LIN,
  FLEX_USD_SWAP_LIN,
  SUSHI_USD_SWAP_LIN,
  PAGE_TITLE_ORDERS,
  REFRESH_RATE,
} from "../utils/constants";
import { coinFLEXWs } from "../utils/Streams";
import SnackbarAlert from "../components/SnackbarAlert";
import Orders from "../components/Orders";

// define css-in-js
const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flex: 2,
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    sparkCard: {
      transition: "0.3s",
      margin: "auto",
      maxWidth: "400px",
      marginTop: "3%",
      padding: "0.5%",
      color: "white",
      backgroundColor: "#292929",
      boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
      "&:hover": {
        boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
      },
      "& .MuiCardMedia-root": {
        paddingTop: "56.25%",
      },
      "& .MuiCardContent-root": {
        textAlign: "center",
        padding: 3,
      },
      "& .MuiDivider-root": {
        margin: `3px 0`,
      },
      "& .MuiTypography--heading": {
        fontWeight: "bold",
      },
      "& .MuiTypography--subheading": {
        lineHeight: 1.8,
      },
      "& .MuiAvatar-root": {
        display: "inline-block",
        border: "2px solid white",
        "&:not(:first-of-type)": {
          marginLeft: 2,
        },
      },
      "& .MuiGrid-container": {
        width: "250px",
        textAlign: "center",
      },
    },
    tradeDisplay: {
      backgroundColor: "#2A5AC5",
      padding: "10%",
      maxWidth: "250px",
    },
    priceContainer: {
      display: "inline",
    },
    tradeButton: {
      borderColor: "#2A5AC5 !important",
      border: "1px solid",
      margin: "2%",
      color: "white",
      padding: "10%",
    },
  })
);

const Home: FC<{}> = (): ReactElement => {
  const classes = useStyles();
  const [alertMessage, setAlertMessage] = useState({
    open: false,
    message: "",
  });
  const [renderOrders, setRenderOrders] = useState([]);
  const [btcToUSD, setBtcToUSD] = useState({
    marketCode: "",
    bestAsk: 0,
    bestBid: 0,
  });

  const [ethToUSD, setEthToUSD] = useState({
    marketCode: "",
    bestAsk: 0,
    bestBid: 0,
  });

  const [flexToUSD, setFlexToUsd] = useState({
    marketCode: "",
    bestAsk: 0,
    bestBid: 0,
  });

  const [sushiToUSD, setSushiToUSD] = useState({
    marketCode: "",
    bestAsk: 0,
    bestBid: 0,
  });

  const listToDisplay = [btcToUSD, ethToUSD, flexToUSD, sushiToUSD];
  const subscribeToWS = () => {
    coinFLEXWs.onopen = function () {
      //Subscribe to the channel BTC-USD
      coinFLEXWs.send(
        JSON.stringify({
          op: "subscribe",
          tag: 103,
          args: [DEPTH + ":" + BTC_USD_SWAP_LIN],
        })
      );
      coinFLEXWs.send(
        JSON.stringify({
          op: "subscribe",
          tag: 103,
          args: [DEPTH + ":" + ETH_USD_SWAP_LIN],
        })
      );

      coinFLEXWs.send(
        JSON.stringify({
          op: "subscribe",
          tag: 103,
          args: [DEPTH + ":" + FLEX_USD_SWAP_LIN],
        })
      );

      coinFLEXWs.send(
        JSON.stringify({
          op: "subscribe",
          tag: 103,
          args: [DEPTH + ":" + SUSHI_USD_SWAP_LIN],
        })
      );
    };
  };

  const flush = (bufferData: any) => {
    if (bufferData.length) {
      const [{ asks, bids, marketCode }] = bufferData.pop();
      bufferData = [];
      switch (marketCode) {
        case BTC_USD_SWAP_LIN:
          setBtcToUSD(() => {
            return {
              marketCode,
              bestAsk: getBestAsk(asks),
              bestBid: getBestBid(bids),
            };
          });
          break;
        case ETH_USD_SWAP_LIN:
          setEthToUSD(() => {
            return {
              marketCode,
              bestAsk: getBestAsk(asks),
              bestBid: getBestBid(bids),
            };
          });
          break;
        case FLEX_USD_SWAP_LIN:
          setFlexToUsd(() => {
            return {
              marketCode,
              bestAsk: getBestAsk(asks),
              bestBid: getBestBid(bids),
            };
          });
          break;
        case SUSHI_USD_SWAP_LIN:
          setSushiToUSD(() => {
            return {
              marketCode,
              bestAsk: getBestAsk(asks),
              bestBid: getBestBid(bids),
            };
          });
          break;
        default:
      }
    }
  };

  useEffect(() => {
    subscribeToWS();
    let btcToUSDBuffer: any[] = [];
    let ethToUSDBuffer: any[] = [];
    let flexToUsdBuffer: any[] = [];
    let sushiToUSDBuffer: any[] = [];

    let btcTimer = setInterval(() => {
      flush(btcToUSDBuffer);
    }, REFRESH_RATE);
    let ethTimer = setInterval(() => {
      flush(ethToUSDBuffer);
    }, REFRESH_RATE);
    let flexTimer = setInterval(() => {
      flush(flexToUsdBuffer);
    }, REFRESH_RATE);
    let sushiTimer = setInterval(() => {
      flush(sushiToUSDBuffer);
    }, REFRESH_RATE);

    coinFLEXWs.onmessage = (msg: any) => {
      const data = JSON.parse(msg.data);
      if (data.table === "depthL5") {
        const [{ marketCode }] = data.data;
        switch (marketCode) {
          case BTC_USD_SWAP_LIN:
            btcToUSDBuffer.push(data.data);
            break;
          case ETH_USD_SWAP_LIN:
            ethToUSDBuffer.push(data.data);
            break;
          case FLEX_USD_SWAP_LIN:
            flexToUsdBuffer.push(data.data);
            break;
          case SUSHI_USD_SWAP_LIN:
            sushiToUSDBuffer.push(data.data);
            break;
          default:
        }
      }
    };
    coinFLEXWs.onclose = (e) => {
      console.log(
        "Socket is closed. Reconnect will be attempted in 1 second.",
        e.reason
      );
    };
    coinFLEXWs.onerror = (err) => {
      console.error("Socket encountered error: ", err, "Closing socket");
      coinFLEXWs.close();
    };
    return () => {
      clearInterval(btcTimer);
      clearInterval(ethTimer);
      clearInterval(flexTimer);
      clearInterval(sushiTimer);
      //coinFLEXWs.close();
    };
  }, []);

  useEffect(() => {
    // @ts-ignore.
    const orders: any[] = JSON.parse(localStorage.getItem("orders")) || [];
    const OrdersArray = orders.map((order: any, id: number) => {
      const [type, instrument, ask, bid] = order;
      return {
        id: id + 1,
        type,
        instrument,
        ask,
        bid,
      };
    });
    // @ts-ignore.
    setRenderOrders(OrdersArray);
  }, []);
  const formatPrice = (price: number) => {
    return <b style={{ fontSize: 15 }}>{price}</b>;
  };

  const onClose = () => {
    setAlertMessage((): any => {
      return {
        open: false,
        message: "",
      };
    });
  };

  const getBestBid = (bids: [[number, number]]) => {
    const bidPriceList = bids.map(([bid]) => {
      return bid;
    });
    return Math.max(...bidPriceList);
  };

  const getBestAsk = (asks: [[number, number]]) => {
    const askPriceList = asks.map(([ask]) => {
      return ask;
    });
    return Math.min(...askPriceList);
  };

  const setTrade = (pairData: any, type: string) => {
    if (type === "Ask") {
      setAlertMessage((): any => {
        return {
          open: true,
          message:
            "Recording Ask Trade:  " +
            pairData.marketCode +
            " BestAsk:  " +
            pairData.bestAsk +
            " BestBid: " +
            pairData.bestBid,
        };
      });
      setStorage(pairData, type);
    } else {
      setAlertMessage((): any => {
        return {
          open: true,
          message:
            "Recording Bid Trade:  " +
            pairData.marketCode +
            " BestAsk:  " +
            pairData.bestAsk +
            " BestBid: " +
            pairData.bestBid,
        };
      });
      setStorage(pairData, type);
    }
  };

  const setStorage = (pairData: any, type: string) => {
    // @ts-ignore.
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push([
      type,
      pairData.marketCode,
      pairData.bestAsk,
      pairData.bestBid,
    ]);
    localStorage.setItem("orders", JSON.stringify(orders));
    // @ts-ignore.
    const OrdersArray = orders.map((order: any, id: number) => {
      const [type, instrument, ask, bid] = order;
      return {
        id: id + 1,
        type,
        instrument,
        ask,
        bid,
      };
    });
    setRenderOrders(OrdersArray);
  };

  return (
    <>
      <Helmet>
        <title>
          {PAGE_TITLE_HOME} | {APP_TITLE}
        </title>
      </Helmet>
      <PageTitle title={PAGE_TITLE_HOME} />
      <br />

      <div className={classes.root}>
        {listToDisplay &&
          listToDisplay.map((item, index) => {
            return (
              <Card key={index} className={classes.sparkCard}>
                <CardHeader>{item.marketCode}</CardHeader>
                <CardContent>
                  <Typography
                    className={"MuiTypography--heading"}
                    variant={"h6"}
                    gutterBottom
                  >
                    {item.marketCode}
                  </Typography>
                  <Typography
                    className={"MuiTypography--subheading"}
                    variant={"caption"}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <div className={classes.tradeDisplay}>
                          {formatPrice(item.bestBid)}
                        </div>
                      </Grid>
                      <Grid item xs={6}>
                        <div className={classes.tradeDisplay}>
                          {formatPrice(item.bestAsk)}
                        </div>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          onClick={() => setTrade(item, "Bid")}
                          className={classes.tradeButton}
                        >
                          Bid
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          onClick={() => setTrade(item, "Ask")}
                          className={classes.tradeButton}
                        >
                          Ask
                        </Button>
                      </Grid>
                    </Grid>
                    <br />
                    <Typography className={classes.priceContainer}></Typography>
                  </Typography>
                  <Divider light />
                </CardContent>
              </Card>
            );
          })}
      </div>
      <Typography>
        <SnackbarAlert
          message={alertMessage.message}
          open={alertMessage.open}
          onClose={onClose}
        />
      </Typography>

      <br />
      <br />
      <hr />

      <Typography>
        <PageTitle title={PAGE_TITLE_ORDERS} />
        <Button
          variant="contained"
          onClick={() => {
            localStorage.removeItem("orders");
            setRenderOrders([]);
          }}
          size="small"
        >
          Clear Orders
        </Button>
        <Button> </Button>
        <Orders renderOrders={renderOrders} />
      </Typography>
    </>
  );
};

export default Home;
