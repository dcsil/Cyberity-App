import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import {VictoryTooltip,createContainer, VictoryChart,VictoryLabel , VictoryAxis, VictoryLine } from 'victory';
import { assign } from "lodash";


const useStyles = makeStyles((theme) => ({
    card: {
        paddingLeft: theme.spacing(4),
        textAlign: 'center',
        userSelect: 'none',
        flexGrow: 1,
    },
}));

export default function InsiderThreatChart() {
    const classes = useStyles();
    const [zoomDomain, setZoomDomain] = useState({});
    const [threatDataByDate, setThreatDataByDate] = useState([]);

    React.useEffect(() => {
        let d_i = new Date();
        let d_f = new Date();
        d_i.setDate(d_i.getDate() - 7);
        d_f.setDate(d_f.getDate());
        setZoomDomain({x: [d_i,d_f]});
        fetch('/api/numThreatsByDate', {
            method: 'GET',
            headers: new Headers({
                "content-type": "application/json",
            })
        })
            .then(response => response.json())
            .then(data => {
                
                data.forEach((item) => {
                    item["date"] = new Date(item["date"] + " 00:00");
                })
                if(data[0]){
                    let d_i = new Date(data[0]["date"]);
                    let d_f =  new Date(data[0]["date"]);
                    d_i.setDate(d_i.getDate() - 7);
                    d_f.setDate(d_f.getDate());
                    setZoomDomain({x: [d_i,d_f]});
                }
                setThreatDataByDate(data);
            })
            .catch(err => {
                console.log(err)
            })
    }, []);

    const handleZoom = (domain) => {
        setZoomDomain({ zoomDomain: domain });
    }
    
    const colors = ["#252525", "#525252", "#737373", "#969696", "#bdbdbd", "#d9d9d9", "#f0f0f0"];
    
    const charcoal = "#252525";
    const white = "#ffffff"

    const sansSerif = "'Gill Sans', 'Seravek', 'Trebuchet MS', sans-serif";
    const letterSpacing = "normal";
    const fontSize = 14;

    const baseProps = {
      width: 450,
      height: 300,
      padding: 50,
      colorScale: colors
    };

    const baseLabelStyles = {
      fontFamily: sansSerif,
      fontSize,
      letterSpacing,
      padding: 10,
      fill: white,
      stroke: "transparent"
    };
    
    const centeredLabelStyles = assign({ textAnchor: "middle" }, baseLabelStyles);

    const strokeLinecap = "round";
    const strokeLinejoin = "round";
    
    const chartTheme = {
      axis: assign(
        {
          style: {
            axis: {
              fill: "transparent",
              stroke: charcoal,
              strokeWidth: 1,
              strokeLinecap,
              strokeLinejoin
            },
            axisLabel: assign({}, centeredLabelStyles, {
              padding: 25
            }),
            grid: {
              fill: "none",
              stroke: "none",
              pointerEvents: "painted"
            },
            ticks: {
              fill: "transparent",
              size: 1,
              stroke: "transparent"
            },
            tickLabels: baseLabelStyles
          }
        },
        baseProps
      ),
      legend: {
        colorScale: colors,
        gutter: 10,
        orientation: "vertical",
        titleOrientation: "top",
        style: {
          data: {
            type: "circle"
          },
          labels: baseLabelStyles,
          title: assign({}, baseLabelStyles, { padding: 5 })
        }
      },
      line: assign(
        {
          style: {
            data: {
              fill: "transparent",
              opacity: 1,
              stroke: charcoal,
              strokeWidth: 2,
              
            },
            labels: baseLabelStyles
          }
        },
        baseProps
      ),
      tooltip: {
        style: assign({}, baseLabelStyles, { padding: 0, pointerEvents: "none" }),
        flyoutStyle: {
          stroke: "#913973",
          strokeWidth: 1,
          fill: "#f0f0f0",
          pointerEvents: "none"
        },
        flyoutPadding: 9,
        pointerLength: 10
      },
      voronoi: assign(
        {
          style: {
            data: {
              fill: "transparent",
              stroke: "transparent",
              strokeWidth: 0
            },
            labels: assign({}, baseLabelStyles, { padding: 5, pointerEvents: "none" }),
            flyout: {
              stroke: "white",
              strokeWidth: 1,
              fill: "#f0f0f0",
              pointerEvents: "none"
            }
          }
        },
        baseProps
      )
    };
      
    const VictoryZoomVoronoiContainer = createContainer("zoom", "voronoi");

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [month, day, year].join('-');
    }

    return (
        <Paper className={classes.card}> 
            <VictoryChart width={1200} height={220} scale={{ x: "time" }} theme={chartTheme}
                containerComponent={
                    <VictoryZoomVoronoiContainer
                        zoomDimension="x"
                        zoomDomain={zoomDomain}
                        onZoomDomainChange={handleZoom.bind(this)}
                        voronoiDimension="x"
                        labels={({ datum }) => `Threats: ${datum.threatCount} Date: ${formatDate(datum.date)}`}
                        labelComponent={<VictoryTooltip flyoutStyle={{fill: "rgba(66,66,66, 0.35)"}}/>}
                    />
                }
            >
                <VictoryLine
                    labelComponent={<VictoryLabel renderInPortal dy={-20}/>}
                    interpolation="natural"
                    style={{
                        data: { stroke: "#913973", strokeWidth: 3 },
                        labels: {fill: "white"}
                    }}
                    data={threatDataByDate}
                    x="date"
                    y="threatCount"
                />

        <VictoryAxis
            label="Date"
            style={{
                axisLabel: {fill:"white", padding: 30 }
            }}
          />
          <VictoryAxis dependentAxis
            label="Threat Count"
            style={{
              axisLabel: {fill:"white", padding: 35 }
            }}
          />
            </VictoryChart>
        </Paper>
    );
}