import React, {useState, useEffect} from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CalendarHeatmap from 'reactjs-calendar-heatmap'
import moment from 'moment';
import * as d3 from "d3";


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    card: {
      padding: theme.spacing(2),
      textAlign: 'center',
      userSelect: 'none',
      flexGrow: 1,
    },
    link: {
        textDecoration: 'none'
    }
}));

let now = moment().endOf('day').toDate()
let time_ago = moment().startOf('day').subtract(10, 'year').toDate()
let data = d3.timeDays(time_ago, now).map(function (dateElement, index) {
    return {
        date: dateElement,
        details: Array.apply(null, new Array(Math.floor(Math.random() * 15))).map(function(e, i, arr) {
        return {
            'name': 'Project ' + Math.ceil(Math.random() * 10),
            'date': function () {
            let projectDate = new Date(dateElement.getTime())
            projectDate.setHours(Math.floor(Math.random() * 24))
            projectDate.setMinutes(Math.floor(Math.random() * 60))
            return projectDate
            }(),
            'value': 3600 * ((arr.length - i) / 5) + Math.floor(Math.random() * 3600) * Math.round(Math.random() * (index / 365))
        }
        }),
        init: function () {
        this.total = this.details.reduce(function (prev, e) {
            return prev + e.value
        }, 0)
        return this
        }
    }.init()
})

  

export default function InsiderThreatCalender() { 
    const classes = useStyles();

    return (
        <Paper className={classes.card}>
            <CalendarHeatmap
                data={data}
                color={"#913973"}
            />
        </Paper>
    );
}