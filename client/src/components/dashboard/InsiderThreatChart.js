import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import {VictoryTooltip,createContainer, VictoryChart,VictoryLabel , VictoryAxis, VictoryLine } from 'victory';
import { assign } from "lodash";


const useStyles = makeStyles((theme) => ({
    card: {
        paddingLeft: theme.spacing(5),
        textAlign: 'center',
        userSelect: 'none',
        flexGrow: 1,
    },
}));

export default function InsiderThreatChart() {
    const classes = useStyles();
    const [zoomDomain, setZoomDomain] = useState({ x: [new Date(1990, 1, 1), new Date(2009, 1, 1)] });

    const handleZoom = (domain) => {
        setZoomDomain({ zoomDomain: domain });
    }
    
    // Styles
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
        flyoutPadding: 5,
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

    return (
        <Paper className={classes.card}> 
            <VictoryChart width={1200} height={220} scale={{ x: "time" }} theme={chartTheme}
                containerComponent={
                    <VictoryZoomVoronoiContainer
                        zoomDimension="x"
                        zoomDomain={zoomDomain}
                        onZoomDomainChange={handleZoom.bind(this)}
                        voronoiDimension="x"
                        labels={({ datum }) => `Threats: ${datum.y} Date: ${datum.x}`}
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
                    data={[
                        { x: new Date(1982, 1, 1), y: 125,l: "one" },
                        { x: new Date(1987, 1, 1), y: 257 },
                        { x: new Date(1993, 1, 1), y: 345 },
                        { x: new Date(1997, 1, 1), y: 515 },
                        { x: new Date(2001, 1, 1), y: 132 },
                        { x: new Date(2005, 1, 1), y: 305 },
                        { x: new Date(2011, 1, 1), y: 270 },
                        { x: new Date(2015, 1, 1), y: 470 }
                    ]}
                    x="x"
                    y="y"
                />

        <VictoryAxis
            label="Date"
            style={{
                axisLabel: {fill:"#913973", padding: 30 }
            }}
          />
          <VictoryAxis dependentAxis
            label="Threat Count"
            style={{
              axisLabel: {fill:"#913973", padding: 35 }
            }}
          />

            </VictoryChart>
        </Paper>
    );
}