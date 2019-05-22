import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { fade } from '@material-ui/core/styles/colorManipulator';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SettingsIcon from '@material-ui/icons/Settings';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import Grid from '@material-ui/core/Grid';
import { MuiPickersUtilsProvider, InlineDatePicker } from 'material-ui-pickers';

import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Collapse from '@material-ui/core/Collapse';
import Checkbox from '@material-ui/core/Checkbox';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Slider from '@material-ui/lab/Slider';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import MomentUtils from '@date-io/moment';
import moment from "moment";

import Highcharts from 'highcharts';
import HighStock from 'highcharts/highstock'

import EventListener from 'react-event-listener';
import Graph from './Graph.js';
const pjson = require('../package.json');

let extremesTimer = [null, null];
let windowResizeTimer = null;
let loadCheckTimer = null;
let isWindowResize = false;
const drawerWidth = 360;
const animBackground = 'linear-gradient(270deg, rgba(142, 68, 173,1.0), rgba(26, 188, 156,1.0))';
const animBackgroundSize =  '200% 60px';
const animAnimation = 'airis-anim 12s ease infinite';
const styles = theme => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  appBar: {
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: animBackground,
    backgroundSize: animBackgroundSize,
    animation: animAnimation,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    fontFamily : `'Comfortaa', cursive`,
    marginTop : 6,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  loadingMask : {
      backgroundColor : 'rgba(0,0,0,0.25)',
      position : 'fixed',
      top : 0,
      left : 0,
      right : 0,
      bottom : 0,
      display : 'flex',
      alignItems : 'flex-start',
      zIndex : 9999,
  },
  splashScreen : {
      backgroundColor : 'rgba(0,0,0,0.75)',
      position : 'fixed',
      top : 0,
      left : 0,
      right : 0,
      bottom : 0,
      display : 'flex',
      alignItems : 'center',
      justifyContent : 'center',
      zIndex : 99999,
  },
  splashScreenBox : {
    borderRadius : 8,
    background: animBackground,
    backgroundSize: animBackgroundSize,
    animation: animAnimation,
    boxShadow : '0 2px 4px rgba(0,0,0,0.5), inset 0 0 2px rgba(255,255,255,0.75)',
    overflow : 'hidden',
  },
  splashScreenBoxImage : {
    width : 400,
    height : 200,
    padding : 18,
    backgroundImage : 'url(./img/splash_bg.png)',
    backgroundPosition : 'bottom right',
    backgroundRepeat : 'no-repeat',
    backgroundSize : '80%, 100%',
    position : 'relative',
  },
  splashScreenBoxFoot : {
    position : 'absolute',
    bottom : 0,
    left : 0,
    right : 0,
    textAlign : 'center',
    padding : 8,
    backgroundColor : 'rgba(0,0,0,0.3)'
  },
  version : {
    color : 'rgba(255,255,255,0.75)'
  },
  waitGraphBox : {
    display : 'flex',
    backgroundColor: '#1abc9c',
    borderRadius : 4,
    overflow: 'hidden',
    border: 'solid 1px rgba(0,0,0,0.7)',
    boxSizing: 'border-box',
    marginTop : 8
  },
  waitGraphBar : {
    height : 12,
  },
  chartTitle : {
    position: 'absolute',
    zIndex  : 2,
    left    : 24,
    top     : 10,
    opacity : 0.5
  },
  chartBox : {
    position : 'relative',
    padding  : '0 12px !important',
  },
  selectRow : {
    cursor : 'pointer',
    transition : 'background-color .2s linear',
    '&:hover' : {
      backgroundColor : '#3f51b5'
    }
  },
  menuSelected : {
    backgroundColor : 'rgba(0,0,0,0.3) !important',
    '&:hover' : {
      backgroundColor : 'rgba(0,0,0,0.1) !important',
    }
  },
  columnIcon : {
    width : 30,
    height : 24,
    boxSizing : 'border-box',
    border : 'solid 1px #999',
    display : 'flex',
    borderRadius : 2,
    verticalAlign: 'middle',
    position : 'relative'
  },
  columnBox : {
    boxSizing : 'border-box',
    border : 'solid 1px #999',
    width : '100%',
    '&div:nth-child(n+2)' : {
      marginLeft : -1,
    }
  },
  columnNumber : {
    position : 'absolute',
    left : '50%',
    textAlign : 'center',
    marginLeft : -10,
    width : 20,
    heiht : 20,
    borderRadius : 10,
    textShadow: '0 0 2px #333,0 0 2px #333,0 0 2px #333,0 0 2px #333,0 0 2px #333,0 0 2px #333,0 0 2px #333,0 0 2px #333,0 0 2px #333'
  },
  container : {
    position: 'sticky',
    top: 64,
    zIndex: 4,
    backgroundColor: '#333',
    borderBottom: 'solid 1px rgba(0,0,0,0.15)',  
  },
  /*
  toolBox : {
    position: 'sticky',
    top: 64,
    zIndex: 4,
    backgroundColor: '#333',
    borderBottom: 'solid 1px rgba(0,0,0,0.15)',
  },*/
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    overflowX : 'hidden',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    justifyContent: 'space-between',
    position : 'sticky',
    top : 0,
    minHeight : 64,
//    backgroundColor : '#424242',
    borderBottom : 'solid 1px rgba(255,255,255,0.1)',
    zIndex : 4,
    background: animBackground,
    backgroundSize: animBackgroundSize,
    animation: animAnimation,
  },
  ListSubheader : {
    top : 64,
    backgroundColor : '#424242',
    zIndex : 1,
    display: 'flex',
    justifyContent: 'space-between',
  },
  customBadge : {
    backgroundColor : '#3f51b5',
    textAlign : 'center',
    padding : '2px 6px',
    borderRadius : 4,
  },
  customBadgeWarning : {
    backgroundColor : '#c0392b'
  },
  customBadgeText : {
    fontSize : 12
  },
  slider: {
    padding: '22px 0px',
  },
  sliderThumb : {
    backgroundColor : '#f50057',
    '&:hover' : {
      boxShadow: '0px 0px 0px 9px rgba(245, 0, 87, 0.16)'
    },
    '&$sliderActivated' : {
      boxShadow: '0px 0px 0px 18px rgba(245, 0, 87, 0.16)'
    }
  },
  sliderTrackBefore : {
    backgroundColor : 'rgba(245, 0, 87, 1)'
  },
  sliderTrackAfter : {
//    backgroundColor : 'rgba(245, 0, 87, 0.5)'
    backgroundColor : 'rgba(0, 0, 0, 0.5)'
  },
  sliderActivated : {
    
  },
  listItemLineHeight : {
    lineHeight : '1.2em'
  },
  listHeader : {
    position: 'sticky',
    top: 65,
    zIndex: 3,
    fontWeight : 800,
    backgroundColor: '#333',
    '&:hover' : {
      backgroundColor: '#222',
    },
    '&:active' : {
      backgroundColor: '#222',
    },
    '&:focus' : {
      backgroundColor: '#222',
    },
  }
});
const theme = createMuiTheme({
  palette: {
      type: 'dark',
  },
  typography: { useNextVariants: true },
});

const ColumnIcon = (prop) => {
  const {length, classes} = prop;
  
  const columns = [];
  for(let i=0; i<length; i++){
    columns.push(i);
  }
  return (
    <div className={classes.columnIcon}>
      <span className={classes.columnNumber}>
        {length}
      </span>
      {
        columns.map((c, i) => (<div className={classes.columnBox} key={`column-box-${length}-${i}`}></div>))
      }
    </div>
  )
}
let setting = null;
const settingName = "StatsPackVisualizer";
const defaultLimitMenus = [{
  value : 10,
  selected : false
},{
  value : 20,
  selected : true
},{
  value : 30,
  selected : false
},{
  value : 40,
  selected : false
},{
  value : 50,
  selected : false
},{
  value : 100,
  selected : false
}];
const defaultChartMenu = [{
  title : 'CPU Usage',
  func  : 'getCpuUsage',
  enabled : true,
  data  : 'cpuUsageChartOptions',
},{
  title : 'CPU Utilization',
  func  : 'getCpuUtilization',
  enabled : true,
  data :'cpuUtilizationChartOptions'
},{
  title : 'Memory Usage',
  func  : 'getMemoryUsage',
  enabled : true,
  dependent : 'Memory Swap Free',
  data :'memoryUsageChartOptions'
},{
  title     : 'Memory Swap Free',
  func      : null,
  enabled   : true,
  dependent : 'Memory Usage',
  data :'memorySwapChartOptions'
},{
  title : 'Memory Allocation',
  func  : 'getMemoryAllocation',
  enabled : true,
  data :'memoryAllocationChartOptions'
},{
  title : 'Page In/Out',
  func  : 'getPageInOut',
  enabled : true,
  data :'pageInOutChartOptions'
},{
  title : 'Logons',
  func  : 'getLogons',
  enabled : true,
  data :'logonsChartOptions'
},{
  title : 'Opened Cursors Current',
  func  : 'getOpenedCursorsCurrent',
  enabled : true,
  data :'openedCursorsCurrentChartOptions'
},{
  title : 'Executions',
  func  : 'getExecutions',
  enabled : true,
  data :'executionsChartOptions'
},{
  title : 'Physical Reads',
  func  : 'getPhysicalReads',
  enabled : true,
  data :'physicalReadsChartOptions'
},{
  title : 'Physical Writes',
  func  : 'getPhysicalWrites',
  enabled : true,
  data :'physicalWritesChartOptions'
},{
  title : 'Physical Reads Direct',
  func  : 'getPhysicalReadsDirect',
  enabled : true,
  data :'physicalReadsDirectChartOptions'
},{
  title : 'Physical Writes Direct',
  func  : 'getPhysicalWritesDirect',
  enabled : true,
  data :'physicalWritesDirectChartOptions'
},{
  title : 'Redo Size',
  func  : 'getRedoSize',
  enabled : true,
  data :'redoSizeChartOptions'
},{
  title : 'Buffer Hit',
  func  : 'getBufferHit',
  enabled : true,
  data :'bufferHitChartOptions'
},{
  title : 'Library Hit',
  func  : 'getLibraryHit',
  enabled : true,
  data :'libraryHitChartOptions'
},{
  title : 'Latch Hit',
  func  : 'getLatchHit',
  enabled : true,
  data :'latchHitChartOptions'
},{
  title : 'SQL',
  func  : 'getSelectRangeLogs',
  enabled : true,
  data : 'logs'
}];
const defaultColumnMenus = [{
  value : 1,
  selected : true,
},{
  value : 2,
  selected : false,
},{
  value : 3,
  selected : false,
},{
  value : 4,
  selected : false,
}];
const defaultWaitClassChartHeight = [{
  height : 300,
  selected : true
},{
  height : 400,
  selected : true
},{
  height : 600,
  selected : false
},{
  height : 800,
  selected : false
},{
  height : 1000,
  selected : false
},{
  height : 1200,
  selected : false
}];
const defaultChartHeight = [{
  height : 160,
  selected : true
},{
  height : 180,
  selected : false
},{
  height : 200,
  selected : false
},{
  height : 240,
  selected : false
},{
  height : 260,
  selected : false
},{
  height : 280,
  selected : false
},{
  height : 300,
  selected : false
}];
class App extends Component {
  constructor(props) {
    super(props);
    this.loadLocalStorage();
    const limitMenus = defaultLimitMenus.map(l => {
      if(setting && setting.limitMenus){
        l.selected = Boolean(l.value === setting.limitMenus);
      }
      return l;
    });
    const chartMenu = defaultChartMenu.map(c => {
      if(setting && setting.chartMenu){
        c.enabled = Boolean(setting.chartMenu.indexOf(c.title) > -1);
      }
      return c;
    });
    const columnMenus = defaultColumnMenus.map(c => {
      if(setting && setting.columnMenus){
        c.selected = Boolean(c.value === setting.columnMenus);
      }
      return c;
    });

    const waitClassChartHeight = defaultWaitClassChartHeight.map(w => {
      if(setting && setting.waitClassChartHeight){
        w.selected = Boolean(w.height === setting.waitClassChartHeight);
      }
      return w;
    });

    const chartHeight = defaultChartHeight.map(w => {
      if(setting && setting.defaultChartHeight){
        w.selected = Boolean(w.height === setting.defaultChartHeight);
      }
      return w;
    })
    const chartDataInterval = (setting && setting.chartDataInterval !== undefined) ? setting.chartDataInterval : 10;
    this.autoBind();
    this.state={
        isMenuOpen : false,
        ranges     : [{
          startDate  : moment().add(-1, 'day'),
          endDate    : moment().add(-1, 'day'),
        }],
        minDate    : moment().add(-1, 'day'),
        maxDate    : moment().add(-1, 'day'),
        locale     : 'ja',
        loading    : true,
        summaryChartOptions : [],
        cpuUsageChartOptions : {},
        cpuUtilizationChartOptions : {},
        logonsChartOptions : {},
        openedCursorsCurrentChartOptions : {},
        memoryUsageChartOptions : {},
        memorySwapChartOptions  : {},
        pageInOutChartOptions   : {},
        executionsChartOptions : {},
        physicalReadsChartOptions : {},
        physicalWritesChartOptions : {},
        physicalReadsDirectChartOptions : {},
        physicalWritesDirectChartOptions : {},
        redoSizeChartOptions : {},
        bufferHitChartOptions : {},
        libraryHitChartOptions : {},
        latchHitChartOptions : {},
        memoryAllocationChartOptions : {},
        logs : [],
        queryParams : [],
        waitGraph : {},
        range : {
            start : null,
            end   : null,
        },
        limitMenus : limitMenus,
        openDialog : false,
        waitClassNames : [],
        summaryChartTitle : 'Wait Event',
        chartDataInterval : chartDataInterval, // Unit: minutes
        columnMenus : columnMenus,
        drawerOpen : false,
        chartMenu : chartMenu,
        firstLoad : true,
        showInfo  : false,
        waitClassChartHeight : waitClassChartHeight,
        defaultChartHeight : chartHeight,
        anchorWaitClassHeightEl : null,
        anchorChartHeightEl : null,
        loadData : [],
        compare : false,
        setSyncHeight : this.setSyncHeight,
        syncHeight : {},
        brandImage : false,
    };
    
  }
  autoBind() {
    Object.getOwnPropertyNames(this.constructor.prototype)
      .filter(prop => typeof this[prop] === 'function')
      .forEach(method => {
        this[method] = this[method].bind(this);
      });
  }
  componentWillMount(){
    const numFormat = {
      lang: {
        // 小数点の文字を指定
        decimalPoint: '.',
        // 桁区切りの文字を指定
        thousandsSep: ','
      }
    };
    const timeZone = {
      global: {
        useUTC: false
      }
    };
    const chartTheme = {
      colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
          '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
      chart: {
          backgroundColor: {
              linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
              stops: [
                  [0, '#2a2a2b'],
                  [1, '#3e3e40']
              ]
          },
          style: {
              fontFamily: '\'Unica One\', sans-serif'
          },
          plotBorderColor: '#606063'
      },
      title: {
          style: {
              color: '#E0E0E3',
              textTransform: 'uppercase',
              fontSize: '20px'
          }
      },
      subtitle: {
          style: {
              color: '#E0E0E3',
              textTransform: 'uppercase'
          }
      },
      xAxis: {
          gridLineColor: '#707073',
          labels: {
              style: {
                  color: '#E0E0E3'
              }
          },
          lineColor: '#707073',
          minorGridLineColor: '#505053',
          tickColor: '#707073',
          title: {
              style: {
                  color: '#A0A0A3'
  
              }
          }
      },
      yAxis: {
          gridLineColor: '#707073',
          labels: {
              style: {
                  color: '#E0E0E3'
              }
          },
          lineColor: '#707073',
          minorGridLineColor: '#505053',
          tickColor: '#707073',
          tickWidth: 1,
          title: {
              style: {
                  color: '#A0A0A3'
              }
          }
      },
      tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          style: {
              color: '#F0F0F0'
          },
          pointFormat : `<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>`
      },
      plotOptions: {
          series: {
              dataLabels: {
                  color: '#B0B0B3'
              },
              marker: {
                  lineColor: '#333'
              }
          },
          boxplot: {
              fillColor: '#505053'
          },
          candlestick: {
              lineColor: 'white'
          },
          errorbar: {
              color: 'white'
          }
      },
      legend: {
          itemStyle: {
              color: '#E0E0E3'
          },
          itemHoverStyle: {
              color: '#FFF'
          },
          itemHiddenStyle: {
              color: '#606063'
          }
      },
      credits: {
          enabled : false
      },
      labels: {
          style: {
              color: '#707073'
          }
      },
  
      drilldown: {
          activeAxisLabelStyle: {
              color: '#F0F0F3'
          },
          activeDataLabelStyle: {
              color: '#F0F0F3'
          }
      },
  
      navigation: {
          buttonOptions: {
              symbolStroke: '#DDDDDD',
              theme: {
                  fill: '#505053'
              }
          }
      },
  
      // scroll charts
      rangeSelector: {
          buttonTheme: {
              fill: '#505053',
              stroke: '#000000',
              style: {
                  color: '#CCC'
              },
              states: {
                  hover: {
                      fill: '#707073',
                      stroke: '#000000',
                      style: {
                          color: 'white'
                      }
                  },
                  select: {
                      fill: '#000003',
                      stroke: '#000000',
                      style: {
                          color: 'white'
                      }
                  }
              }
          },
          inputBoxBorderColor: '#505053',
          inputStyle: {
              backgroundColor: '#333',
              color: 'silver'
          },
          labelStyle: {
              color: 'silver'
          }
      },
  
      navigator: {
          handles: {
              backgroundColor: '#666',
              borderColor: '#AAA'
          },
          outlineColor: '#CCC',
          maskFill: 'rgba(255,255,255,0.1)',
          series: {
              color: '#7798BF',
              lineColor: '#A6C7ED'
          },
          xAxis: {
              gridLineColor: '#505053'
          }
      },
  
      scrollbar: {
          barBackgroundColor: '#808083',
          barBorderColor: '#808083',
          buttonArrowColor: '#CCC',
          buttonBackgroundColor: '#606063',
          buttonBorderColor: '#606063',
          rifleColor: '#FFF',
          trackBackgroundColor: '#404043',
          trackBorderColor: '#404043'
      },
  
      // special colors for some of the
      legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
      background2: '#505053',
      dataLabelsColor: '#B0B0B3',
      textColor: '#C0C0C0',
      contrastTextColor: '#F0F0F3',
      maskColor: 'rgba(255,255,255,0.3)'
    };
    Highcharts.setOptions(numFormat);
    HighStock.setOptions(numFormat);
    Highcharts.setOptions(timeZone);
    HighStock.setOptions(timeZone);
    Highcharts.theme = chartTheme;
    HighStock.theme  = chartTheme;
    Highcharts.setOptions(Highcharts.theme);
    HighStock.setOptions(HighStock.theme);

    this.getDateRange();
  }
  componentDidMount(){
    /**
     * In order to synchronize tooltips and crosshairs, override the
     * built-in events with handlers defined on the parent element.
     */
    /*
    console.log('Fire componentDidMount', document.getElementById('container'));
    ['mousemove', 'touchmove', 'touchstart'].forEach(function (eventType) {
      document.getElementById('container').addEventListener(
          eventType,
          function (e) {
              var chart,
                  point,
                  i,
                  event;
              
              for (i = 0; i < Highcharts.charts.length; i = i + 1) {
                  chart = Highcharts.charts[i];
                  console.log('chart', chart);
                  // Find coordinates within the chart
                  event = chart.pointer.normalize(e);
                  // Get the hovered point
                  point = chart.series[0].searchPoint(event, true);

                  if (point) {
                      point.highlight(e);
                  }
              }
          }
      );
    });
    
    document.querySelector('#container').addEventListener('mousemove', function (e) {
      var chart, point, i, event
      console.log('Highcharts.charts.length', Highcharts.charts.length)
      for (i = 0; i < Highcharts.charts.length; i = i + 1) {
        chart = Highcharts.charts[i]
        event = chart.pointer.normalize(e.originalEvent) // Find coordinates within the chart
        point = chart.series[0].searchPoint(event, true) // Get the hovered point

        if (point) {
          point.highlight(e)
        }
      }
    })
    */
    /**
    * Override the reset function, we don't need to hide the tooltips and
    * crosshairs.
    */

//    Highcharts.Pointer.prototype.reset = function () {
//      return undefined;
//    };

    /**
    * Highlight a point by showing tooltip, setting hover state and draw crosshair
    */
   /*
    Highcharts.Point.prototype.highlight = function (event) {
      event = this.series.chart.pointer.normalize(event);
      this.onMouseOver(); // Show the hover marker
      this.series.chart.tooltip.refresh(this); // Show the tooltip
      this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
    };
    */

  }
  setChartData(options, index, key){
//    console.log('index, key', index, key)
    const loadData = this.state.loadData.map(l => l);
    if(loadData[index] === undefined) loadData[index] = {};
    loadData[index][key] = options;
    // yAxis Max check
//    const checkYaxis = loadData.filter(l => l[key]);
//    console.log('checkYaxis', checkYaxis)
    this.setState({
      loadData : loadData
    });
  }
  getDateRange(){
    fetch(`http://localhost:5000/getDateRange`)
    .then(function(response) {
      return response.json();
    })
    .then((json) => {
      //const json = JSON.parse(text);
      const range = json.rows[0];
      if(range){
          this.setState({
            minDate : range.MIN,
            maxDate : range.MAX
          })
      }
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .then(()=>{
        this.getWaitClassParams();
    })
  }
  getWaitClassParams(){
    fetch(`http://localhost:5000/getWaitClassParams`)
    .then(function(response) {
      return response.json();
    })
    .then((json) => {
      //const json = JSON.parse(text);
      const rows = json.rows;
      const waitClassNames = [];
      rows.forEach(r => {
        const waitClassName     = r.WAIT_CLASS;
        const eventName         = r.DISPLAY_NAME;
        let waitClass           = waitClassNames.filter(w => w.name === waitClassName);
//        const waitClassSelected = (setting && setting.waitClassNames) ? Boolean(setting.waitClassNames.indexOf(waitClassName) > -1) : Boolean(waitClassName !== 'Idle');
        const waitClassSelected = (setting && setting.waitClassNames && setting.waitClassNames[waitClassName]) ? setting.waitClassNames[waitClassName].selected : Boolean(waitClassName !== 'Idle');
        const eventSelected     = (setting && setting.waitClassNames && setting.waitClassNames[waitClassName] && setting.waitClassNames[waitClassName].events) ? setting.waitClassNames[waitClassName].events[eventName] : waitClassSelected;
        if(!waitClass.length){
          waitClassNames.push({
            name     : waitClassName,
            selected : waitClassSelected,
            events   : [],
            open     : false,
          });
          waitClass = waitClassNames.filter(w => w.name === waitClassName)
        }
        waitClass[0].events.push({
          name     : eventName,
          selected : eventSelected,
        });
      });
//      console.log('waitClassNames', waitClassNames);
      this.setState({
        waitClassNames : waitClassNames
      });
      
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .then(()=>{
        this.setState({
            loading : false,
            firstLoad : false,
        });
    })
  }
  getSummaryStats(){
    this.setState({
//        summaryChartOptions : {},
//        logs : [],
        loading : true,
        summaryChartTitle : 'Elapsed Time & Execution Count'
    })
    fetch(`http://localhost:5000/getSummaryStats/${moment(this.state.startDate).format('YYYY-MM-DD')}/${moment(this.state.endDate).format('YYYY-MM-DD')}`)
    .then(function(response) {
      return response.json();
    })
    .then((json) => {
      //const json = JSON.parse(text);
      this.createSummaryChartOptions(json.rows);
      //console.log('response', json.rows);
    })
    .catch(error => console.error('Error:', error));

  }
  getSelectRangeLogs(range){
    this.setState({
        loading : true,
    })
    let min = this.state.range.min;
    let max = this.state.range.max;
    let len = this.state.limitMenus.filter(l => l.selected)[0].value;
    const index = range.index;
    if(range !== undefined){
        min = range.min;
        max = range.max;
    }
    fetch(`http://localhost:5000/getSelectRangeLogs/${min}/${max}/${len}`)
    .then(function(response) {
      return response.json();
    })
    .then((json) => {
      //const json = JSON.parse(text);
      //console.log(json.rows);

//      this.setState({
//        logs    : json.rows
//      })
      this.setChartData(json.rows, index, 'logs')
    })
    .catch(error => console.error('Error:', error))
    .then(()=>{
//      this.setState({
//          loading : false
//      });
    })

  }
  callWaitEvents(){
    this.state.ranges.forEach((range, index) => {
      this.getWaitEvents(range, index);
    });
  }
  getWaitEvents(range, index){
    const summaryChartOptions = this.state.ranges.map(r => {
      return {};
    });
    const loadData            = this.state.loadData.map(r => {
      return {};
    });
    const state = {
      summaryChartOptions : summaryChartOptions,
      loadData : loadData,
      loading : true,
    };
    this.state.chartMenu.forEach(m => {
      state[m.data] = (m.data === 'SQL') ? [] : {};
    });
    this.setState(state);
    const min = new Date(range.startDate).getTime();
    const max = new Date(range.endDate).getTime();
    const exclusionsEvents = this.state.waitClassNames.filter(w => !w.selected);
    const inclusionsEvents = this.state.waitClassNames.filter(w => w.selected);
    let   exclusions       = true;
    let targetEvents       = exclusionsEvents;
    if(exclusionsEvents.length > inclusionsEvents.length){
      exclusions   = false;
      targetEvents = inclusionsEvents;
    }
    let waitEvents = [];
    targetEvents.forEach(e => {
      waitEvents = waitEvents.concat(e.events);
    });
    if(waitEvents.length > 1000) waitEvents = waitEvents.slice(0, 1000);
    const postData = {
      start      : min,
      end        : max,
      waitEvents : waitEvents,
      exclusions : exclusions,
    };
    fetch(`http://localhost:5000/getWaitEvents`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, same-origin, *omit
      headers: {
          "Content-Type": "application/json; charset=utf-8",
          // "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: JSON.stringify(postData), // 本文のデータ型は "Content-Type" ヘッダーと一致する必要があります
    })
    .then(function(response) {
      return response.json();
    })
    .then((json) => {
      //const json = JSON.parse(text);
      this.createWaitEventSummaryChartOptions(json.rows, range, index);
    })
    .catch(error => console.error('Error:', error));
  }/*
  getWaitEvents(){
    this.setState({
        summaryChartOptions : {},
        logs : [],
        loading : true,
        summaryChartTitle : 'Wait Event'
    })
    const min = new Date(this.state.startDate).getTime();
    const max = new Date(this.state.endDate).getTime();

    fetch(`http://localhost:5000/getWaitEvents/${min}/${max}`)
    .then(function(response) {
      return response.json();
    })
    .then((json) => {
      //const json = JSON.parse(text);
      this.createWaitEventSummaryChartOptions(json.rows);
      console.log(json.rows);
    })
    .catch(error => console.error('Error:', error));
  }
  */
  getLogons(range){
    const index = range.index;
    this.setState({
      logonsChartOptions : {},
//      loading : true
    })
    
    const min = new Date(range.min).getTime();
    const max = new Date(range.max).getTime();

    fetch(`http://localhost:5000/getLogons/${min}/${max}`)
    .then(function(response) {
      return response.json();
    })
    .then((json) => {
      //const json = JSON.parse(text);
//      console.log('json.rows', json.rows);
      const chartOptions = this.getDefaultChart();
      let data = json.rows.map(d => {
        const time = new Date(d.SNAP_TIME + ':00').getTime();
        return [time, d.VALUE];
      });
      data = data.sort((a, b)=>{
        return a[0] - b[0];
      })
      const series = [{
        type : 'line',
        name : 'Logons',
        data : data
      }];
      chartOptions.series = series;
      chartOptions.yAxis.title.text = 'Logon Count';
      chartOptions.key = 'logonsChartOptions';
//      this.setState({
//        logonsChartOptions : chartOptions
//      });
      this.setChartData(chartOptions, index, 'logonsChartOptions');
    })
    .catch(error => console.error('Error:', error))
    .then((json) => {
//      this.setState({
//          loading : false
//      });
    });
  }
  getOpenedCursorsCurrent(range){
    const index = range.index;
    this.setState({
      openedCursorsCurrentChartOptions : {},
//      loading : true
    })
    
    const min = new Date(range.min).getTime();
    const max = new Date(range.max).getTime();

    fetch(`http://localhost:5000/getOpenedCursorsCurrent/${min}/${max}`)
    .then(function(response) {
      return response.json();
    })
    .then((json) => {
      //const json = JSON.parse(text);
//      console.log('json.rows', json.rows);
      const chartOptions = this.getDefaultChart();
      let data = json.rows.map(d => {
        const time = new Date(d.SNAP_TIME + ':00').getTime();
        return [time, d.VALUE];
      });
      data = data.sort((a, b)=>{
        return a[0] - b[0];
      })
      const series = [{
        type : 'line',
        name : 'Opened Cursors Current',
        data : data
      }];
      chartOptions.series = series;
      chartOptions.yAxis.title.text = 'Count';
      chartOptions.key = 'openedCursorsCurrentChartOptions';
//      this.setState({
//        openedCursorsCurrentChartOptions : chartOptions
//      });
      this.setChartData(chartOptions, index, 'openedCursorsCurrentChartOptions');
    })
    .catch(error => console.error('Error:', error))
    .then((json) => {
//      this.setState({
//          loading : false
//      });
    });
  }
  getMemoryUsage(range){
    const index = range.index;
    this.setState({
      memoryUsageChartOptions : {},
      memorySwapChartOptions  : {},
//      loading : true
    })
    
    const min = new Date(range.min).getTime();
    const max = new Date(range.max).getTime();

    fetch(`http://localhost:5000/getMemoryUsage/${min}/${max}`)
    .then(function(response) {
      return response.json();
    })
    .then((json) => {
      //const json = JSON.parse(text);
//      console.log('json.rows', json.rows);
      
      const chartUsageOptions = this.getDefaultChart();
      const chartSwapOptions  = this.getDefaultChart();
      let PHYSICAL_MEMORY_MB  = null;
      let FREE_MEMORY_MB      = [];
      let INACTIVE_MEMORY_MB  = [];
      let SWAP_FREE_MB        = [];
      json.rows.forEach(row => {
        if(PHYSICAL_MEMORY_MB === null) PHYSICAL_MEMORY_MB = row.PHYSICAL_MEMORY_MB;
        const time = new Date(row.SNAP_TIME + ':00').getTime();
        FREE_MEMORY_MB.push([time, row.FREE_MEMORY_MB]);
        INACTIVE_MEMORY_MB.push([time, row.INACTIVE_MEMORY_MB]);
        SWAP_FREE_MB.push([time, row.SWAP_FREE_MB]);
      })

      FREE_MEMORY_MB = FREE_MEMORY_MB.sort((a, b)=>{
        return a[0] - b[0];
      });
      INACTIVE_MEMORY_MB = INACTIVE_MEMORY_MB.sort((a, b)=>{
        return a[0] - b[0];
      });
      SWAP_FREE_MB = SWAP_FREE_MB.sort((a, b)=>{
        return a[0] - b[0];
      });
      const usageSeries = [{
        type : 'areaspline',
        name : 'Free(MB)',
        stacking : true,
        data : FREE_MEMORY_MB
      },{
        type : 'areaspline',
        name : 'Inactive(MB)',
        stacking : true,
        data : INACTIVE_MEMORY_MB
      }];
      chartUsageOptions.series = usageSeries;
      chartUsageOptions.yAxis.max = PHYSICAL_MEMORY_MB;
      chartUsageOptions.yAxis.title.text = 'MB';
      chartUsageOptions.yAxis.endOnTick = false;
      chartUsageOptions.yAxis.plotLines = [{
        color : '#e74c3c',
        value : PHYSICAL_MEMORY_MB,
        width : 1,
        zIndex: 4,
        
        label : {
          align : 'right',
          y : 18,
          x : -8,
          text : `Physical Memory - ${(PHYSICAL_MEMORY_MB).toLocaleString()} MB`,
          style: {
            color : '#e74c3c'
          }
        }
      }];
//      console.log('PHYSICAL_MEMORY_MB', PHYSICAL_MEMORY_MB);

      const swapSeries = [{
        type : 'line',
        name : 'Free(MB)',
        data : SWAP_FREE_MB
      }];
      chartSwapOptions.series = swapSeries;
      chartSwapOptions.yAxis.title.text = 'MB';
      chartSwapOptions.yAxis.max = PHYSICAL_MEMORY_MB;
      chartSwapOptions.yAxis.title.text = 'MB';
      chartSwapOptions.yAxis.endOnTick = false;
      chartSwapOptions.yAxis.plotLines = [{
        color : '#e74c3c',
        value : PHYSICAL_MEMORY_MB,
        width : 1,
        zIndex: 4,
        
        label : {
          align : 'right',
          y : 18,
          x : -8,
          text : `Physical Memory - ${(PHYSICAL_MEMORY_MB).toLocaleString()} MB`,
          style: {
            color : '#e74c3c'
          }
        }
      }];

      chartUsageOptions.key = 'memoryUsageChartOptions';
      chartSwapOptions.key = 'memorySwapChartOptions';

//      this.setState({
//        memoryUsageChartOptions : chartUsageOptions,
//        memorySwapChartOptions  : chartSwapOptions,
//      });
      this.setChartData(chartUsageOptions, index, 'memoryUsageChartOptions');
      this.setChartData(chartSwapOptions, index, 'memorySwapChartOptions');
    })
    .catch(error => console.error('Error:', error))
    .then((json) => {
//      this.setState({
//          loading : false
//      });
    });
  }
  getPageInOut(range){
    const index = range.index;
    this.setState({
      pageInOutChartOptions : {},
//      loading : true
    })
    
    const min = new Date(range.min).getTime();
    const max = new Date(range.max).getTime();

    fetch(`http://localhost:5000/getPageInOut/${min}/${max}`)
    .then(function(response) {
      return response.json();
    })
    .then((json) => {
      //const json = JSON.parse(text);
//      console.log('json.rows', json.rows);
      const chartOptions = this.getDefaultChart();
      let VM_IN_MB  = [];
      let VM_OUT_MB = [];
      json.rows.forEach(row => {
        const time = new Date(row.SNAP_TIME + ':00').getTime();
        VM_IN_MB.push([time, row.VM_IN_MB]);
        VM_OUT_MB.push([time, row.VM_OUT_MB]);
      });

      VM_IN_MB = VM_IN_MB.sort((a, b)=>{
        return a[0] - b[0];
      })
      VM_OUT_MB = VM_OUT_MB.sort((a, b)=>{
        return a[0] - b[0];
      })
      const series = [{
        type : 'line',
        name : 'IN',
        data : VM_IN_MB
      },{
        type : 'line',
        name : 'OUT',
        data : VM_OUT_MB
      }];
      chartOptions.series = series;
      chartOptions.yAxis.title.text = 'MB';
      chartOptions.key = 'pageInOutChartOptions';
//      this.setState({
//        pageInOutChartOptions : chartOptions
//      });
      this.setChartData(chartOptions, index, 'pageInOutChartOptions');
    })
    .catch(error => console.error('Error:', error))
    .then((json) => {
//      this.setState({
//          loading : false
//      });
    });
  }
  getCpuUsage(range){
    /*
    this.setState({
      cpuUsageChartOptions : {},
//      loading : true
    })
    */
    
    const index = range.index;
    const min = new Date(range.min).getTime();
    const max = new Date(range.max).getTime();

    fetch(`http://localhost:5000/getCpuUsage/${min}/${max}`)
    .then(function(response) {
      return response.json();
    })
    .then((json) => {
      //const json = JSON.parse(text);
//      console.log('json.rows', json.rows);
      const chartOptions = this.getDefaultChart();
      let user   = [];
      let system = [];
      let waitIO = [];
      let busy   = [];
      let cWait  = [];
      json.rows.forEach(row => {
        const time = new Date(row.SNAP_TIME + ':00').getTime();
        user.push([time, Number(row.PCT_USER)]);
        system.push([time, Number(row.PCT_SYS)]);
        waitIO.push([time, Number(row.PCT_IOWT)]);
        busy.push([time, Number(row.PCT_BUSY)]);
        cWait.push([time, Number(row.PCT_CPUWT)]);
      });
      /*
      VM_IN_MB = VM_IN_MB.sort((a, b)=>{
        return a[0] - b[0];
      })*/
      const series = [{
        type : 'area',
        name : 'User',
        stacking : 'normal',
        data : user
      },{
        type : 'area',
        name : 'System',
        stacking : 'normal',
        data : system
      },{
        type : 'area',
        name : 'Wait I/O',
        stacking : 'normal',
        data : waitIO
      },{
        type : 'line',
        name : 'Busy',
        data : busy
      },{
        type : 'line',
        name : 'CPU Wait',
        data : cWait
      }];
      chartOptions.series = series;
      chartOptions.yAxis.title.text = '%';
      chartOptions.key = 'cpuUsageChartOptions';
      this.setChartData(chartOptions, index, 'cpuUsageChartOptions');
      //console.log(chartOptions);
      /*
      this.setState({
        cpuUsageChartOptions : chartOptions
      });
      */      
    })
    .catch(error => console.error('Error:', error))
    .then((json) => {
//      this.setState({
//          loading : false
//      });
    });
  }
  getExecutions(range){
    const index = range.index;
    this.setState({
      executionsChartOptions : {},
//      loading : true
    })
    
    const min = new Date(range.min).getTime();
    const max = new Date(range.max).getTime();

    fetch(`http://localhost:5000/getExecutions/${min}/${max}`)
    .then(function(response) {
      return response.json();
    })
    .then((json) => {
      //const json = JSON.parse(text);
//      console.log('json.rows', json.rows);
      const chartOptions = this.getDefaultChart();
      let DIFF_VALUE   = [];
      let EXEC_PER_SEC = [];

      json.rows.forEach(row => {
        const time = new Date(row.SNAP_TIME + ':00').getTime();
        DIFF_VALUE.push([time, Number(row.DIFF_VALUE)]);
        EXEC_PER_SEC.push([time, Number(row.EXEC_PER_SEC)]);
      });
      /*
      VM_IN_MB = VM_IN_MB.sort((a, b)=>{
        return a[0] - b[0];
      })*/
      const series = [/*{
        type : 'line',
        name : 'Diff',
        data : DIFF_VALUE
      },*/{
        type : 'line',
        name : 'Execution',
        data : EXEC_PER_SEC
      }];
      chartOptions.series = series;
      chartOptions.yAxis.title.text = 'Exec/Sec';
      chartOptions.key = 'executionsChartOptions';
      /*
      chartOptions.yAxis = [{
        title : {
          text : 'Exec/Sec'
        }
      },{
        title : {
          text : ''
        }
      }]
      */
//      console.log('getExecutions', chartOptions);
//      this.setState({
//        executionsChartOptions : chartOptions
//      });
      this.setChartData(chartOptions, index, 'executionsChartOptions');
      
    })
    .catch(error => console.error('Error:', error))
    .then((json) => {
//      this.setState({
//          loading : false
//      });
    });
  }
  getPhysicalReads(range){
    const index = range.index;
    this.setState({
      physicalReadsChartOptions : {},
//      loading : true
    })
    
    const min = new Date(range.min).getTime();
    const max = new Date(range.max).getTime();

    fetch(`http://localhost:5000/getPhysicalReads/${min}/${max}`)
    .then(function(response) {
      return response.json();
    })
    .then((json) => {
      //const json = JSON.parse(text);
//      console.log('json.rows', json.rows);
      const chartOptions = this.getDefaultChart();
      let DIFF_VALUE   = [];
      let VALUE_PER_SEC = [];

      json.rows.forEach(row => {
        const time = new Date(row.SNAP_TIME + ':00').getTime();
        DIFF_VALUE.push([time, Number(row.DIFF_VALUE)]);
        VALUE_PER_SEC.push([time, Number(row.VALUE_PER_SEC)]);
      });
      /*
      VM_IN_MB = VM_IN_MB.sort((a, b)=>{
        return a[0] - b[0];
      })*/
      const series = [/*{
        type : 'line',
        name : 'Diff',
        data : DIFF_VALUE
      },*/{
        type : 'line',
        name : 'Physical Read',
        data : VALUE_PER_SEC
      }];
      chartOptions.series = series;
      chartOptions.yAxis.title.text = 'Value/Sec';
      chartOptions.key = 'physicalReadsChartOptions';
      /*
      chartOptions.yAxis = [{
        title : {
          text : 'Exec/Sec'
        }
      },{
        title : {
          text : ''
        }
      }]
      */
//      console.log('getExecutions', chartOptions);
//      this.setState({
//        physicalReadsChartOptions : chartOptions
//      });
      this.setChartData(chartOptions, index, 'physicalReadsChartOptions');
    })
    .catch(error => console.error('Error:', error))
    .then((json) => {
//      this.setState({
//          loading : false
//      });
    });
  }
  getPhysicalWrites(range){
    const index = range.index;
    this.setState({
      physicalWritesChartOptions : {},
//      loading : true
    })
    
    const min = new Date(range.min).getTime();
    const max = new Date(range.max).getTime();

    fetch(`http://localhost:5000/getPhysicalWrites/${min}/${max}`)
    .then(function(response) {
      return response.json();
    })
    .then((json) => {
      //const json = JSON.parse(text);
//      console.log('json.rows', json.rows);
      const chartOptions = this.getDefaultChart();
      let DIFF_VALUE   = [];
      let VALUE_PER_SEC = [];

      json.rows.forEach(row => {
        const time = new Date(row.SNAP_TIME + ':00').getTime();
        DIFF_VALUE.push([time, Number(row.DIFF_VALUE)]);
        VALUE_PER_SEC.push([time, Number(row.VALUE_PER_SEC)]);
      });
      /*
      VM_IN_MB = VM_IN_MB.sort((a, b)=>{
        return a[0] - b[0];
      })*/
      const series = [/*{
        type : 'line',
        name : 'Diff',
        data : DIFF_VALUE
      },*/{
        type : 'line',
        name : 'Physical Write',
        data : VALUE_PER_SEC
      }];
      chartOptions.series = series;
      chartOptions.yAxis.title.text = 'Value/Sec';
      chartOptions.key = 'physicalWritesChartOptions';
      /*
      chartOptions.yAxis = [{
        title : {
          text : 'Exec/Sec'
        }
      },{
        title : {
          text : ''
        }
      }]
      */
//      console.log('physicalWritesChartOptions', chartOptions);
//      this.setState({
//        physicalWritesChartOptions : chartOptions
//      });
      this.setChartData(chartOptions, index, 'physicalWritesChartOptions');
    })
    .catch(error => console.error('Error:', error))
    .then((json) => {
//      this.setState({
//          loading : false
//      });
    });
  }
  getPhysicalReadsDirect(range){
    const index = range.index;
    this.setState({
      physicalReadsDirectChartOptions : {},
//      loading : true
    })
    
    const min = new Date(range.min).getTime();
    const max = new Date(range.max).getTime();

    fetch(`http://localhost:5000/getPhysicalReadsDirect/${min}/${max}`)
    .then(function(response) {
      return response.json();
    })
    .then((json) => {
      //const json = JSON.parse(text);
//      console.log('json.rows', json.rows);
      const chartOptions = this.getDefaultChart();
      let DIFF_VALUE   = [];
      let VALUE_PER_SEC = [];

      json.rows.forEach(row => {
        const time = new Date(row.SNAP_TIME + ':00').getTime();
        DIFF_VALUE.push([time, Number(row.DIFF_VALUE)]);
        VALUE_PER_SEC.push([time, Number(row.VALUE_PER_SEC)]);
      });
      const series = [{
        type : 'line',
        name : 'Physical Read Direct',
        data : VALUE_PER_SEC
      }];
      chartOptions.series = series;
      chartOptions.yAxis.title.text = 'Value/Sec';
      chartOptions.key = 'physicalReadsDirectChartOptions';

//      this.setState({
//        physicalReadsDirectChartOptions : chartOptions
//      });
      this.setChartData(chartOptions, index, 'physicalReadsDirectChartOptions');
    })
    .catch(error => console.error('Error:', error))
    .then((json) => {
//      this.setState({
//          loading : false
//      });
    });
  }
  getPhysicalWritesDirect(range){
    const index = range.index;
    this.setState({
      physicalWritesDirectChartOptions : {},
//      loading : true
    })
    
    const min = new Date(range.min).getTime();
    const max = new Date(range.max).getTime();

    fetch(`http://localhost:5000/getPhysicalWritesDirect/${min}/${max}`)
    .then(function(response) {
      return response.json();
    })
    .then((json) => {
      //const json = JSON.parse(text);
//      console.log('json.rows', json.rows);
      const chartOptions = this.getDefaultChart();
      let DIFF_VALUE   = [];
      let VALUE_PER_SEC = [];

      json.rows.forEach(row => {
        const time = new Date(row.SNAP_TIME + ':00').getTime();
        DIFF_VALUE.push([time, Number(row.DIFF_VALUE)]);
        VALUE_PER_SEC.push([time, Number(row.VALUE_PER_SEC)]);
      });
      const series = [{
        type : 'line',
        name : 'Physical Write Direct',
        data : VALUE_PER_SEC
      }];
      chartOptions.series = series;
      chartOptions.yAxis.title.text = 'Value/Sec';
      chartOptions.key = 'physicalWritesDirectChartOptions';

//      this.setState({
//        physicalWritesDirectChartOptions : chartOptions
//      });
      this.setChartData(chartOptions, index, 'physicalWritesDirectChartOptions');
    })
    .catch(error => console.error('Error:', error))
    .then((json) => {
//      this.setState({
//          loading : false
//      });
    });
  }
  getRedoSize(range){
    const index = range.index;
    this.setState({
      redoSizeChartOptions : {},
//      loading : true
    })
    
    const min = new Date(range.min).getTime();
    const max = new Date(range.max).getTime();

    fetch(`http://localhost:5000/getRedoSize/${min}/${max}`)
    .then(function(response) {
      return response.json();
    })
    .then((json) => {
      //const json = JSON.parse(text);
//      console.log('json.rows', json.rows);
      const chartOptions = this.getDefaultChart();
      let DIFF_VALUE   = [];
      let VALUE_PER_SEC = [];

      json.rows.forEach(row => {
        const time = new Date(row.SNAP_TIME + ':00').getTime();
        DIFF_VALUE.push([time, Number(row.DIFF_VALUE)]);
        VALUE_PER_SEC.push([time, Number(row.VALUE_PER_SEC)]);
      });
      const series = [{
        type : 'line',
        name : 'Redo Size',
        data : VALUE_PER_SEC
      }];
      chartOptions.series = series;
      chartOptions.yAxis.title.text = 'Value/Sec';
      chartOptions.key = 'redoSizeChartOptions';

//      this.setState({
//        redoSizeChartOptions : chartOptions
//      });
      this.setChartData(chartOptions, index, 'redoSizeChartOptions');
    })
    .catch(error => console.error('Error:', error))
    .then((json) => {
//      this.setState({
//          loading : false
//      });
    });
  }
  getBufferHit(range){
    const index = range.index;
    this.setState({
      bufferHitChartOptions : {},
//      loading : true
    })
    
    const min = new Date(range.min).getTime();
    const max = new Date(range.max).getTime();

    fetch(`http://localhost:5000/getBufferHit/${min}/${max}`)
    .then(function(response) {
      return response.json();
    })
    .then((json) => {
      //const json = JSON.parse(text);
//      console.log('json.rows', json.rows);
      const chartOptions = this.getDefaultChart();
      let BUFFER_HIT   = [];

      json.rows.forEach(row => {
        const time = new Date(row.SNAP_TIME + ':00').getTime();
        BUFFER_HIT.push([time, Number(row.BUFFER_HIT)]);
      });
      const series = [{
        type : 'line',
        name : 'Buffer Hit',
        data : BUFFER_HIT
      }];
      chartOptions.series = series;
      chartOptions.yAxis.title.text = '%';
      chartOptions.yAxis.min = 0;
      chartOptions.yAxis.max = 100;
      chartOptions.key = 'bufferHitChartOptions';
//      console.log('getBufferHit', chartOptions);
//      this.setState({
//        bufferHitChartOptions : chartOptions
//      });
      this.setChartData(chartOptions, index, 'bufferHitChartOptions');
    })
    .catch(error => console.error('Error:', error))
    .then((json) => {
//      this.setState({
//          loading : false
//      });
    });
  }
  getLibraryHit(range){
    const index = range.index;
    this.setState({
      libraryHitChartOptions : {},
//      loading : true
    })
    
    const min = new Date(range.min).getTime();
    const max = new Date(range.max).getTime();

    fetch(`http://localhost:5000/getLibraryHit/${min}/${max}`)
    .then(function(response) {
      return response.json();
    })
    .then((json) => {
      //const json = JSON.parse(text);
//      console.log('json.rows', json.rows);

      const chartOptions = this.getDefaultChart();
      let GETHITRATE     = [];
      let PINHITRATE     = [];

      json.rows.forEach(row => {
        const time = new Date(row.SNAP_TIME + ':00').getTime();
        GETHITRATE.push([time, Number(row.GETHITRATE)]);
        PINHITRATE.push([time, Number(row.PINHITRATE)]);
      });
      const series = [{
        type : 'line',
        name : 'Get Hit Rate',
        data : GETHITRATE
      },{
        type : 'line',
        name : 'Pin Hit Rate',
        data : PINHITRATE
      }];
      chartOptions.series = series;
      chartOptions.yAxis.title.text = '%';
      chartOptions.yAxis.min = 0;
      chartOptions.yAxis.max = 100;
      chartOptions.key = 'libraryHitChartOptions';
//      console.log('getLibraryHit', chartOptions);
//      this.setState({
//        libraryHitChartOptions : chartOptions
//      });
      this.setChartData(chartOptions, index, 'libraryHitChartOptions');
    })
    .catch(error => console.error('Error:', error))
    .then((json) => {
//      this.setState({
//          loading : false
//      });
    });
  }
  getCpuUtilization(range){
    const index = range.index;
    this.setState({
      cpuUtilizationChartOptions : {},
//      loading : true
    })
    
    const min = new Date(range.min).getTime();
    const max = new Date(range.max).getTime();

    fetch(`http://localhost:5000/getCpuUtilization/${min}/${max}`)
    .then(function(response) {
      return response.json();
    })
    .then((json) => {
      //const json = JSON.parse(text);
      //console.log('json.rows', json.rows);

      const chartOptions = this.getDefaultChart();
      let EXECUTION_TIME = [];
      let PARSE_TIME     = [];
      let RELOAD         = [];

      json.rows.forEach(row => {
        const time = new Date(row.SNAP_TIME + ':00').getTime();
        EXECUTION_TIME.push([time, Number(row.EXECUTION_TIME)]);
        PARSE_TIME.push([time, Number(row.PARSE_TIME)]);
        RELOAD.push([time, Number(row.RELOAD)]);
      });
      const series = [{
        type : 'areaspline',
        name : 'Execution Time',
        data : EXECUTION_TIME,
        stacking : 'normal',
      },{
        type : 'areaspline',
        name : 'Parse Time',
        data : PARSE_TIME,
        stacking : 'normal',
      },{
        type : 'areaspline',
        name : 'Reload',
        data : RELOAD,
        stacking : 'normal',
      }];
      chartOptions.series = series;
      chartOptions.yAxis.title.text = '%';
      chartOptions.yAxis.min = 0;
      chartOptions.yAxis.max = 100;
      chartOptions.key = 'cpuUtilizationChartOptions';
      //console.log('getLibraryHit', chartOptions);
//      this.setState({
//        cpuUtilizationChartOptions : chartOptions
//      });
      this.setChartData(chartOptions, index, 'cpuUtilizationChartOptions');
    })
    .catch(error => console.error('Error:', error))
    .then((json) => {
//      this.setState({
//          loading : false
//      });
    });
  }
  getLatchHit(range){
    const index = range.index;
    this.setState({
      latchHitChartOptions : {},
//      loading : true
    })
    
    const min = new Date(range.min).getTime();
    const max = new Date(range.max).getTime();

    fetch(`http://localhost:5000/getLatchHit/${min}/${max}`)
    .then(function(response) {
      return response.json();
    })
    .then((json) => {
      //const json = JSON.parse(text);
//      console.log('json.rows', json.rows);

      const chartOptions = this.getDefaultChart();
      let LATCH_HITRATE = [];

      json.rows.forEach(row => {
        const time = new Date(row.SNAP_TIME + ':00').getTime();
        LATCH_HITRATE.push([time, Number(row.LATCH_HITRATE)]);
      });
      const series = [{
        type : 'line',
        name : 'Latch Hit Rate',
        data : LATCH_HITRATE,
      }];
      chartOptions.series = series;
      chartOptions.yAxis.title.text = '%';
      chartOptions.yAxis.min = 0;
      chartOptions.yAxis.max = 100;
      chartOptions.key = 'latchHitChartOptions';
//      console.log('getLibraryHit', chartOptions);
//      this.setState({
//        latchHitChartOptions : chartOptions
//      });
      this.setChartData(chartOptions, index, 'latchHitChartOptions');
    })
    .catch(error => console.error('Error:', error))
    .then((json) => {
//      this.setState({
//          loading : false
//      });
    });
  }
  getMemoryAllocation(range){
    const index = range.index;
    this.setState({
      memoryAllocationChartOptions : {},
//      loading : true
    })
    
    const min = new Date(range.min).getTime();
    const max = new Date(range.max).getTime();

    fetch(`http://localhost:5000/getMemoryAllocation/${min}/${max}`)
    .then(function(response) {
      return response.json();
    })
    .then((json) => {
      //const json = JSON.parse(text);
//      console.log('json.rows', json.rows);

      const chartOptions = this.getDefaultChart();
      const components = {};

      json.rows.forEach(row => {
        const time      = new Date(row.SNAP_TIME + ':00').getTime();
        const component = row.COMPONENT;
        if(components[component] === undefined) components[component] = [];
        components[component].push([time, Number(row.MB)]);
      });
      const series = Object.keys(components).map(component => {
        return {
          type : 'areaspline',
          name : component,
          data : components[component],
          stacking : 'normal',
        };
      });

      chartOptions.series = series;
      chartOptions.yAxis.title.text = 'MB';
      chartOptions.key = 'memoryAllocationChartOptions';
//      chartOptions.yAxis.min = 0;
//      chartOptions.yAxis.max = 100;
//      console.log('getMemoryAllocation', chartOptions);
//      this.setState({
//        memoryAllocationChartOptions : chartOptions
//      });
      this.setChartData(chartOptions, index, 'memoryAllocationChartOptions');
    })
    .catch(error => console.error('Error:', error))
    .then((json) => {
//      this.setState({
//          loading : false
//      });
    });
  }
  setExtremes(extremes, index){
    if(isWindowResize) return;
//    console.log('extremes', extremes, index)
//    console.log(extremes.min, extremes.max);
    clearTimeout(extremesTimer[index]);
    const range = {
      min : extremes.min,
      max : extremes.max,
      index : index,
    };

    extremesTimer[index] = setTimeout(()=>{
      const loadData = this.state.loadData.map(l => l);
      loadData[index] = {};
      this.setState({
        loadData : loadData,
      })
      this.state.chartMenu.filter(menu => menu.enabled).forEach(menu => {
        if(menu.func){
          this[menu.func](range);
        }
      });
      this.checkChartDataLoaded();
    }, 1500);
  }
  checkChartDataLoaded(){
    const chartNames = this.state.chartMenu.filter(m => m.enabled).map(m => m.data);
    
    let loadCount = 0;
    const totalCount = chartNames.length * this.state.ranges.length;
    

    this.state.loadData.forEach(l => {
      loadCount += (l) ? Object.keys(l).length : 0;
    })

    const loading = !Boolean(totalCount === loadCount);
//    console.log('totalCount', totalCount, 'loadCount', loadCount);
//    console.log('this.state.loadData', this.state.loadData);

    if(loading){
      loadCheckTimer = setTimeout(()=> this.checkChartDataLoaded(), 500);
    }else{
      clearTimeout(loadCheckTimer);
    }
    this.setState({
      loading : loading
    });
  }
  createZeroSeries(range){
    const addMilliSecond = 60000 * this.state.chartDataInterval;
    let   start          = range.min;
    const end            = range.max + addMilliSecond;
    const series         = [];
    for(start; start<end; start+=addMilliSecond){
      series.push([start, 0]);
    }
    return series;
  }
  createSummaryChartOptions(rows){
    const elapsed = [];
    const count   = [];
    const root    = this;
    rows.forEach(row =>{
        const time      = row.UNIXTIME;
        
        elapsed.push([time, row.ELAPSED]);
        count.push([time, row.COUNT]);
    })
    const stockOptions = {
      chart : {
        height : 300,
        backgroundColor : 'transparent',
        events : {
            load : function(event){
                const chart = this;
                //console.log(chart.xAxis[0].getExtremes());
                root.setExtremes(chart.xAxis[0].getExtremes(), chart.userOptions.dataIndex);
            }
        }
      },
      rangeSelector: {
        enabled: false
      },

      title: {
          text: ''
      },
      xAxis: {
          events : {
            afterSetExtremes : function(event){
                const chart = this;
                //console.log(chart.getExtremes());
                root.setExtremes(chart.getExtremes(), chart.userOptions.dataIndex);
            }
          }
      },
      yAxis: [{
          labels: {
              align: 'right',
              x: -3
          },
          title: {
              text: 'Elapsed Time'
          },
          height: '60%',
          lineWidth: 2,
          resize: {
              enabled: true
          }
      }, {
          labels: {
              align: 'right',
              x: -3
          },
          title: {
              text: 'Query Count'
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2
      }],

      tooltip: {
          split: true
      },

      series: [{
          type: 'areaspline',
          name: 'Elapsed Time',
          data: elapsed
      }, {
          type: 'column',
          name: 'Query Count',
          data: count,
          yAxis: 1
      }]
    }
    this.setState({
      summaryChartOptions : stockOptions,
//      loading : false
    })
  }
  createWaitEventSummaryChartOptions(rows, ranges, index){
    const root    = this;
    const eventNames = [];
    const series  = [];
    const range   = {
      min : new Date(ranges.startDate.format('YYYY-MM-DD 00:00')).getTime(),
      max : new Date(ranges.endDate.format('YYYY-MM-DD 23:59')).getTime(),
    }
    rows.forEach(row =>{
        const eventName = row.EVENT; 
        const time      = new Date(row.SNAP_TIME + ':00').getTime();
        const data      = row.DIFF_VALUE;
        let index       = eventNames.indexOf(eventName);
        if(index === -1){
            index = eventNames.length;
            eventNames.push(eventName);
            series.push({
                name : eventName,
                type : 'areaspline',
                stacking : true,
//                data : [],
                data : (this.state.chartDataInterval === 0) ? [] : this.createZeroSeries(range),
            });
        }
        if(this.state.chartDataInterval === 0){
          series[index].data.push([time, data])
        }else{
          let dataPoint = series[index].data.filter(d => d[0] === time);
          if(!dataPoint.length){
            dataPoint = series[index].data.filter(d => d[0] > time);
            //console.log(dataPoint, time);
          }
          if(dataPoint.length){
            dataPoint[0][1] = data;
          }else{
            console.log('not found point')
          }
        }

        //series[index].data.push([time, data]);

        //elapsed.push([time, row.ELAPSED]);
        //count.push([time, row.COUNT]);
    });
//    console.log('series', series);
    const stockOptions = {
      chart : {
        height : this.state.waitClassChartHeight.filter(w => w.selected)[0].height,
        backgroundColor : 'transparent',
        events : {
            load : function(event){
                const chart = this;
                //console.log(chart.xAxis[0].getExtremes());
                root.setExtremes(chart.xAxis[0].getExtremes(), chart.userOptions.dataIndex);
            }
        }
      },
      rangeSelector: {
        buttons: [{
          type: 'day',
          count: 1,
          text: '1d'
        }, {
            type: 'week',
            count: 1,
            text: '1w'
        }, {
            type: 'month',
            count: 1,
            text: '1m'
        }, {
            type: 'ytd',
            text: 'YTD'
        }, {
            type: 'year',
            count: 1,
            text: '1y'
        }, {
            type: 'all',
            text: 'All'
        }],
        selected : 0,
      },

      title: {
          text: ''
      },
      xAxis: {
          events : {
            afterSetExtremes : function(event){
                const chart = this;
                //console.log(chart.getExtremes());
//                console.log('afterSetExtremes', chart)
                root.setExtremes(chart.getExtremes(), chart.chart.userOptions.dataIndex);
            }
          }
      },
      yAxis: {
          labels: {
              align: 'right',
              x: -3
          },
          title: {
              text: 'Wait Time'
          },
      },
      tooltip: {
          //split: true,
          pointFormat : `<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:,.2f}</b><br/>`
      },

      series: series,
      key : 'waitClassChart',
      dataIndex : index,
    }
    const summaryChartOptions = this.state.summaryChartOptions.map(s => s);
    summaryChartOptions[index] = stockOptions;
    this.setState({
      summaryChartOptions : summaryChartOptions
    });
    //this.setChartData(stockOptions, index, 'summaryChartOptions');
    /*
    this.setState({
      summaryChartOptions : stockOptions,
//      loading : false
    })
    */
  }
  syncChartHeight(event, chartThis){
    const chart = (chartThis === undefined) ? this : chartThis;
    const key   = chart.userOptions.key;
  }
  getDefaultChart(){
    const root = this;
    return {
      chart : {
        height : this.state.defaultChartHeight.filter(d => d.selected)[0].height,
        backgroundColor : 'transparent',
      },
      rangeSelector: {
        enabled: false
      },

      title: {
          text: ''
      },
      xAxis: {
        type : 'datetime',
        events: {
          //setExtremes: syncExtremes
        },
      },
      yAxis: {
          labels: {
              align: 'right',
              x: -3
          },
          title: {
              text: ''
          },
      },
      tooltip: {
          //split: true,
          outside : true,
          pointFormat : `<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:,.2f}</b><br/>`
      },
      series: [],
      navigator : {
        enabled : false
      },
      scrollbar : {
        enabled : false
      }
    }
  }
  handleStartDateChange(date, index){
//    console.log(date, index);
    const ranges = this.state.ranges.map((r,i) => {
      if(i === index){
        r.startDate = date;
      }
      return r;
    });
//    console.log('ranges', ranges)
    this.setState({
      ranges : ranges
    })
  }
  handleEndDateChange(date, index){
//    console.log('index', index)
    const ranges = this.state.ranges.map((r,i) => {
      if(i === index){
        r.endDate = date;
      }
      return r;
    });
//    console.log('ranges', ranges);
    this.setState({
      ranges : ranges
    })
  }
  onRangeChange(event, selection){
    console.log(event, selection);
  }
  onRangeDismiss(event, selection){
    console.log(event, selection);
  }
  handleResize(){
    isWindowResize = true;
    clearTimeout(windowResizeTimer);
    windowResizeTimer = setTimeout(()=>{
      isWindowResize = false;
    }, 1000);
  }
  handleChange(event, name){
    //console.log('chekbox',event, name)
    //const names = event.target.value;
    const waitClassNames = this.state.waitClassNames.map(w => {
      const selected = (name === w.name) ? !w.selected : w.selected;
      w.selected = selected;
      w.events   = w.events.map(e => {
        e.selected = selected;
        return e;
      });
      return w;
    });
    this.saveWaitClassParams(waitClassNames);
//    const saveWaitClassNames = waitClassNames.filter(w => w.selected).map(w => w.name);
//    this.saveLocalStorage('waitClassNames', saveWaitClassNames);
    this.setState({
      waitClassNames : waitClassNames
    })
  }
  handleColumnChange(event){
    const value = event.target.value;
    const columnMenus = this.state.columnMenus.map(c => {
      return {
        value    : c.value,
        selected : Boolean(value === c.value),
      }
    });
    this.saveLocalStorage('columnMenus', value);
    this.setState({
      columnMenus : columnMenus
    });
  }
  handleColumnOpen(event){
    this.setState({
      anchorColumnEl : event.currentTarget
    });    
  }
  handleColumnClose(event){
    const state = {
      anchorColumnEl : null,
    };
    const value = event.target.value;
    if(value){
      this.handleColumnChange(event);
      setTimeout(()=>{
        window.dispatchEvent(new Event('resize'));
      }, 100)
    }
    this.setState(state);
  }
  handleChartHeightChange(event, key){
    const value = event.target.value;
    const state = {};
    const heightMenu = this.state[key].map(c => {
      return {
        height    : c.height,
        selected : Boolean(value === c.height),
      }
    });
    this.saveLocalStorage(key, value);
    state[key] = heightMenu;
    this.handleResize();
    this.setState(state);
    /*
    console.log('this.internalChart', this.internalChart);
    if(this.internalChart){
      if(key === 'waitClassChartHeight' && this.internalChart.waitClassChart){
        this.internalChart.waitClassChart.update({
          chart : {
            height : value
          }
        })
      }else{
        this.state.chartMenu.forEach(c => {
          const name = c.data;
          if(this.internalChart[name]){
            this.internalChart[name].update({
              chart : {
                height : value
              }
            });
          }
        })
      }
    }
    */
  }
  handleChartHeightOpen(event, elem){
    const state = {};
    state[elem] = event.currentTarget;
    this.setState(state);
  }
  handleChartHeightClose(event, elem, key){
    const state = {}
    state[elem] = null;
    const value = event.target.value;
    if(value){
      this.handleChartHeightChange(event, key);
    }
    this.setState(state);
  }
  handleLimitChange(event){
    const value = event.target.value;
    const limitMenus = this.state.limitMenus.map(l => {
      return {
        value    : l.value,
        selected : Boolean(value === l.value),
      }
    });
    this.saveLocalStorage('limitMenus', value);
    this.setState({
      limitMenus : limitMenus
    });
  }
  handleLimitOpen(event){
    this.setState({
      anchorLimitEl : event.currentTarget
    });    
  }
  handleLimitClose(event){
    const state = {
      anchorLimitEl : null,
    };
    const value = event.target.value;
    if(value){
      this.handleLimitChange(event);
    }
    this.setState(state);
  }
  handleDrawerOpen(){
    this.setState({
      drawerOpen : true
    })
  }
  handleDrawerClose(event, isForceClose){
    if(isForceClose || (event && event.target && typeof(event.target.className) === 'string' && event.target.className.search(/Backdrop/) > -1)){
      this.setState({
        drawerOpen : false
      });
    }

  }
  handleChartToggle(title){
    
    const chartMenu = this.state.chartMenu.map(m => m);
    const menu      = chartMenu.filter(m => m.title === title);
    menu[0].enabled = !menu[0].enabled;
    if(menu[0].dependent){
      const dependent = chartMenu.filter(m => m.title === menu[0].dependent);
      dependent[0].enabled = !dependent[0].enabled;
    }
    const saveChartMenu = chartMenu.filter(c => c.enabled).map(c => c.title);
    this.setState({
      chartMenu : chartMenu
    });
    
    this.saveLocalStorage('chartMenu', saveChartMenu);
  }
  handleChartToggleAll(){
    const flag = !Boolean(this.state.chartMenu.length === this.state.chartMenu.filter(m => m.enabled).length);
//    console.log('handleChartToggleAll', flag);
    const chartMenu = this.state.chartMenu.map(c => {
      const chart = Object.assign({}, c);
      chart.enabled = flag;
      return chart;
    });
    const saveChartMenu = chartMenu.filter(c => c.enabled).map(c => c.title);
    this.setState({
      chartMenu : chartMenu
    });
    this.saveLocalStorage('chartMenu', saveChartMenu);
  }
  handleChangeAll(){
    const flag = !Boolean(this.state.waitClassNames.length === this.state.waitClassNames.filter(m => m.selected).length);
    const waitClassNames = this.state.waitClassNames.map(w => {
      const waitClassName = Object.assign({}, w);
      waitClassName.selected = flag;
      waitClassName.events = Object.assign([], waitClassName.events).map(e => {
        e.selected = flag;
        return e;
      })
      return waitClassName;
    });
    this.setState({
      waitClassNames : waitClassNames
    });
    this.saveWaitClassParams(waitClassNames);
//    this.saveLocalStorage('waitClassNames', waitClassNames);
  }
  handleSqlLimitChange(value){
    const limitMenus = this.state.limitMenus.map(l => l);
    const menu      = limitMenus.filter(m => m.value === value);
    menu[0].enabled = !menu[0].enabled;

    this.setState({
      limitMenus : limitMenus
    });
    
    this.saveLocalStorage('limitMenus', value);
  }
  loadLocalStorage(){
    setting = localStorage.getItem(settingName);
    if(setting) setting = JSON.parse(setting);
  }
  saveLocalStorage(key, val){
    if(setting === null) setting = {};
    setting[key] = val;
    localStorage.setItem(settingName, JSON.stringify(setting));
  }
  handleShowInfo(flag){
    this.setState({
      showInfo : flag
    });
  }
  handleExpandMenu(name){
    const waitClassNames = this.state.waitClassNames.map(w => {
      if(w.name === name){
        w.open = !w.open;
      }
      return w;
    });
    this.setState({
      waitClassNames : waitClassNames,
    })
  }
  handleWaitEventNameChange(event, waitClassName, waitEventName){
    const waitClassNames = Object.assign([], this.state.waitClassNames);
    const waitClass = waitClassNames.filter(w => w.name === waitClassName);
    waitClass[0].events.filter(e => e.name === waitEventName).map(e => {
      e.selected = !e.selected;
      return e;
    });
    waitClass[0].selected = !Boolean(waitClass[0].events.filter(e => !e.selected).length);
    this.saveWaitClassParams(waitClassNames);
    this.setState({
      waitClassNames : waitClassNames,
    });
//    console.log('handleWaitEventNameChange', event, waitClassName, waitEventName);
  }
  handleChangeChartDataInterval(event, value){
    this.saveLocalStorage('chartDataInterval', value);
    this.setState({
      chartDataInterval : value,
    });
  }
  handleCompareChange(event){
    const compare = event.target.checked;
    let ranges = this.state.ranges.map(r => r);
    if(compare){
      const date = moment(this.state.maxDate).add(-1, 'day');
      ranges.push({
        startDate : date,
        endDate : date,
      });
    }else{
      ranges.pop();
    }
//    console.log('ranges', ranges);
    this.setState({
      ranges  : ranges,
      compare : compare
    });
    setTimeout(()=>{
      window.dispatchEvent(new Event('resize'));
    }, 100);
  };
  afterChartCreated(chart){
    if(this.internalChart === undefined) this.internalChart = {};
    this.internalChart[chart.userOptions.key] = chart;
  }
  saveWaitClassParams(waitClassNames){
//    console.log('waitClassNames', waitClassNames);
    const saveParams = {};
    waitClassNames.forEach(w => {
      const events = {};
      w.events.forEach(e => {
        events[e.name] = e.selected;
      });
      saveParams[w.name] = {
        selected : w.selected,
        events   : events
      }
    });
//    console.log('saveParams', saveParams);
    this.saveLocalStorage('waitClassNames', saveParams);
  }
  setSyncHeight(key, min, max){
    const syncHeight = Object.assign({}, this.state.syncHeight);
    if(syncHeight[key] === undefined){
      syncHeight[key] = {
        min : min,
        max : max,
      }
    }else{
      const oldMin = syncHeight[key].min;
      const newMin = (oldMin > min) ? min : oldMin;
      const oldMax = syncHeight[key].max;
      const newMax = (oldMax < max) ? max : oldMax;
      syncHeight[key] = {
        min : newMin,
        max : newMax
      };
    }

    this.setState({
      syncHeight : syncHeight
    });
  }
  render() {
    const { classes } = this.props;
    const columnLength = this.state.columnMenus.filter(c => c.selected).map(c=>c.value)[0];
    const graphXs = 12/this.state.ranges.length;
//    const selectedWaitClass = this.state.waitClassNames.filter(w => w.selected).length;
    let selectedWaitClass = 0;
    this.state.waitClassNames.forEach(w => {
      selectedWaitClass += w.events.filter(e => e.selected).length;
    });
//    console.log('this.state.waitClassNames', this.state.waitClassNames);
    return (
      <MuiPickersUtilsProvider utils={MomentUtils} moment={moment}>
      <MuiThemeProvider theme={theme}>
      <div className={classes.root}>
        <EventListener target="window" onResize={this.handleResize} />
        <AppBar position="fixed" className={`${classes.appBar} airis-anim`}>
          <Toolbar style={{
            backgroundImage : 'url(./img/appBar_bg.png)',
            backgroundPosition : 'bottom left',
            backgroundRepeat : 'no-repeat',
            backgroundSize : 'auto 260px',
          }}>
            <IconButton 
              className={classes.menuButton} 
              color="inherit" 
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
            >
              <SettingsIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6" color="inherit" noWrap>
              <span style={{fontWeight: 700}}>StatsPack</span> Visualizer
            </Typography>
            <div className={classes.grow} />            
            {
              this.state.brandImage && <div className={classes.sectionDesktop}><img src="./img/brand.png" alt="" style={{height : 30}} /></div>
            }
          </Toolbar>
        </AppBar>
        <div style={{ padding: 20 }} id="container" className={classes.container}>
          <Grid container spacing={24}>
            <Grid item container justify="space-between" xs={12} className={classes.toolBox}>
              <div className="picker">
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.compare}
                    onChange={this.handleCompareChange}
                    value="compare"
                    color="primary"
                  />
                }
                label="Compare"
              />
              {
                this.state.ranges.map((range, index) => (
                <React.Fragment key={`date-range-${index}`}>
                  <InlineDatePicker
                    keyboard
                    clearable
                    onlyCalendar
                    variant="outlined"
                    label={`Start-${index+1}`}
                    value={range.startDate}
                    minDate={this.state.minDate}
                    maxDate={this.state.maxDate}
                    onChange={(date)=>this.handleStartDateChange(date, index)}
                    format="YYYY-MM-DD"
                    style={{marginRight:8, width:180}}
                  />
                  <InlineDatePicker
                    keyboard
                    clearable
                    onlyCalendar
                    variant="outlined"
                    label={`End-${index+1}`}
                    value={range.endDate}
                    minDate={this.state.startDate}
                    maxDate={this.state.maxDate}
                    onChange={(date)=>this.handleEndDateChange(date, index)}
                    format="YYYY-MM-DD"
                    style={{marginRight:8, width:180}}
                  />
                </React.Fragment>
                ))
              }
           


                <Button 
                  variant="contained" 
                  color="primary" 
                  className={classes.button} 
                  onClick={this.callWaitEvents}
                  style={{
                    padding    : 16,
                    marginLeft : 12,
                  }}
                  disabled={!Boolean(selectedWaitClass)}
                >
                  Connect
                </Button>
                {
                  !Object.keys(this.state.summaryChartOptions).length && (
                    <div style={{
                      fontFamily: `'Kalam', cursive`,
                      fontSize : 16,
                      textAlign : 'center',
                      color : '#1abc9c',
                      alignItems : 'center',
                      justifyContent : 'center',
                      lineHeight : '1.2em',
                      display : 'inline-block',
                      padding: 8,
                      verticalAlign: 'middle',
                      position: 'absolute',
                      left: 140,
                      top: 80,
                    }}>
                      <span>
                      {`^ Choose a period and try to visualize it :)`}
                      </span>
                    </div>
                  )
                }

              </div>
              <div>
                <Button
                  aria-owns={this.state.anchorWaitClassHeightEl ? 'waitClass-height-menu' : undefined}
                  aria-haspopup="true"
                  onClick={(event)=>this.handleChartHeightOpen(event, 'anchorWaitClassHeightEl')}
                  style={{padding : '12px 16px'}}
                >
                  <div style={{
                    lineHeight : '1em',
                    fontSize : 16,
                    textAlign : 'right',
                    paddingRight : 4
                  }}>
                  <div style={{
                    fontSize:12, 
                    color:'rgba(255,255,255,0.5)', 
                    textTransform : 'none'
                  }}>WaitEventChart</div>
                  {this.state.waitClassChartHeight.filter(w => w.selected)[0].height}
                  <span style={{
                    textTransform : 'none',
                    color : 'rgba(255,255,255,0.75)',
                    fontSize : 12,
                    paddingLeft : 2
                  }}>px</span>
                  </div>
                  <ArrowDropDownIcon />
                </Button>
                <Menu
                  id="waitClass-height-menu"
                  anchorEl={this.state.anchorWaitClassHeightEl}
                  open={Boolean(this.state.anchorWaitClassHeightEl)}
                  onClose={(event)=>this.handleChartHeightClose(event, 'anchorWaitClassHeightEl', 'waitClassChartHeight')}
                >
                  {this.state.waitClassChartHeight.map(c => (
                    <MenuItem 
                      onClick={(event)=>this.handleChartHeightClose(event, 'anchorWaitClassHeightEl', 'waitClassChartHeight')}
                      key={`waitClassChartHeight-${c.height}`} 
                      value={c.height} 
                      selected={c.selected}
                      classes={{
                      selected : classes.menuSelected
                    }}>
                      {c.height}
                    </MenuItem>
                  ))}
                </Menu>
                
                <Button
                  aria-owns={this.state.anchorWaitClassHeightEl ? 'chart-height-menu' : undefined}
                  aria-haspopup="true"
                  onClick={(event)=>this.handleChartHeightOpen(event, 'anchorChartHeightEl')}
                  style={{padding : '12px 16px'}}
                >
                  <div style={{
                    lineHeight : '1em',
                    fontSize : 16,
                    textAlign : 'right',
                    paddingRight : 4
                  }}>
                  <div style={{
                    fontSize:12, 
                    color:'rgba(255,255,255,0.5)', 
                    textTransform : 'none'
                  }}>OtherChart</div>
                  {this.state.defaultChartHeight.filter(w => w.selected)[0].height}
                  <span style={{
                    textTransform : 'none',
                    color : 'rgba(255,255,255,0.75)',
                    fontSize : 12,
                    paddingLeft : 2
                  }}>px</span>
                  </div>
                  <ArrowDropDownIcon />
                </Button>
                <Menu
                  id="chart-height-menu"
                  anchorEl={this.state.anchorChartHeightEl}
                  open={Boolean(this.state.anchorChartHeightEl)}
                  onClose={(event)=>this.handleChartHeightClose(event, 'anchorChartHeightEl', 'defaultChartHeight')}
                >
                  {this.state.defaultChartHeight.map(c => (
                    <MenuItem 
                      onClick={(event)=>this.handleChartHeightClose(event, 'anchorChartHeightEl', 'defaultChartHeight')}
                      key={`chartHeight-${c.height}`} 
                      value={c.height} 
                      selected={c.selected}
                      classes={{
                      selected : classes.menuSelected
                    }}>
                      {c.height}
                    </MenuItem>
                  ))}
                </Menu>

                <Button
                  aria-owns={this.state.anchorColumnEl ? 'column-menu' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleColumnOpen}
                  style={{padding : 16}}
                >
                  <ColumnIcon length={columnLength} classes={classes} />
                  <ArrowDropDownIcon />
                </Button>
                <Menu
                  id="column-menu"
                  anchorEl={this.state.anchorColumnEl}
                  open={Boolean(this.state.anchorColumnEl)}
                  onClose={this.handleColumnClose}
                >
                  {this.state.columnMenus.map(c => (
                    <MenuItem 
                      onClick={this.handleColumnClose}
                      key={`column-${c.value}`} 
                      value={c.value} 
                      selected={c.selected}
                      classes={{
                      selected : classes.menuSelected
                    }}>
                      Column {c.value}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            </Grid>
          </Grid>
        </div>
        <div style={{padding : 24}}>
        <Grid container spacing={24}>
        {
          this.state.ranges.map((r, index) => (
            <Grid key={`graph-${index}`} item xs={graphXs}>
              <Graph prop={this.state} index={index} />
            </Grid>
          ))
        }
        </Grid>
        </div>
      </div>

      <Drawer
          className={classes.drawer}
          anchor="left"
          open={this.state.drawerOpen}
          classes={{
            paper: classes.drawerPaper,
          }}
          onClick={this.handleDrawerClose}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={(event)=>this.handleDrawerClose(event, true)} style={{marginLeft:8}}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
            <Typography component="h4" style={{fontSize : 18,paddingRight:8}}>
              Settings
            </Typography>
          </div>
          <List 
            className={classes.root}
            style={{paddingTop:0}}>
            <ListItem 
              className={classes.listHeader}
              role={undefined} 
              dense 
              button 
              onClick={this.handleChangeAll}
            >
              <Checkbox
                checked={Boolean(this.state.waitClassNames.length === this.state.waitClassNames.filter(m => m.selected).length)}
                tabIndex={-1}
                style={{padding : 8}}
                disableRipple
              />
              <ListItemText primary={`WaitClass Display`} />
              <div>{
                  <div 
                    className={`${classes.customBadge} ${(selectedWaitClass) ? '' : classes.customBadgeWarning}`}
                    style={{marginRight:44}}
                  >
                    <Typography component="span" className={classes.customBadgeText}>
                      {
                        (selectedWaitClass) ? (
                          <React.Fragment>{selectedWaitClass}</React.Fragment>
                        ) : (
                          <React.Fragment>Please select one or more</React.Fragment>
                        )
                      }
                    </Typography>
                  </div>
                }</div>
            </ListItem>
            {
              this.state.waitClassNames.map(w => (
                <React.Fragment key={`list-menu-${w.name}`} >
                <ListItem 
                  role={undefined} 
                  dense 
                  button 
                  onClick={(event)=>this.handleChange(event, w.name)}
                >
                  <Checkbox
                    checked={w.selected}
                    tabIndex={-1}
                    style={{padding : 8}}
                    disableRipple
                  />
                  <ListItemText primary={w.name} />
                  <ListItemSecondaryAction style={{display:'flex',alignItems:'center'}}>
                    <div style={{paddingRight:8}}>
                      <div className={classes.customBadge}>
                        <Typography component="span" className={classes.customBadgeText}>
                          {w.events.filter(e => e.selected).length}
                        </Typography>
                      </div>
                    </div>
                    <IconButton onClick={()=>this.handleExpandMenu(w.name)}>
                    {w.open ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Collapse 
                  in={w.open} 
                  timeout="auto" 
                  unmountOnExit
                  style={{
                    backgroundColor:'rgba(0,0,0,0.25)',
                  }}
                >
                {
                  w.events.map(e => (
                    <ListItem 
                      key={`list-menu-${w.name}-${e.name}`} 
                      role={undefined} 
                      dense 
                      button 
                      onClick={(event)=>this.handleWaitEventNameChange(event, w.name, e.name)}
                    >
                      <Checkbox
                        checked={e.selected}
                        tabIndex={-1}
                        style={{padding : 8}}
                        disableRipple
                      />
                      <ListItemText primary={e.name} />
                    </ListItem>
                  ))
                }
                </Collapse>
                </React.Fragment>
              ))
            }
            <Divider />
            <ListSubheader
              disableSticky={true}
            >
              <div>WaitClass Settings</div>
            </ListSubheader>
            <ListItem 
              role={undefined} 
            >
              <i className="far fa-clock" style={{
                margin: 12,
                color: 'rgba(255,255,255,0.95)',
              }}></i>
              <div style={{
                width:280,
                display : 'flex',
              }}>
                <ListItemText 
                  primary="Data interval" 
                  classes={{
                    root : classes.listItemLineHeight
                  }}
                  style={{
                    paddingLeft:16,
                    lineHeight : '1.2em'
                  }}
                 />
                <div style={{
                  padding : '0 12px',
                  width: 200,
                  alignItems : 'center',
                }}>
                  <Slider
                    classes={{ 
                      container: classes.slider,
                      thumb : classes.sliderThumb,
                      trackBefore : classes.sliderTrackBefore,
                      trackAfter  : classes.sliderTrackAfter,
                      //activated   : classes.sliderActivated,
                    }}
                    value={this.state.chartDataInterval}
                    aria-labelledby="label"
                    onChange={this.handleChangeChartDataInterval}
                    min={0}
                    max={60}
                    step={5}
                  />
                </div>
                <Typography component="div" style={{
                  alignSelf : 'center'
                }}>
                  {this.state.chartDataInterval}
                  <span style={{
                    fontSize : 12,
                    color : 'rgba(255,255,255,0.5)'
                  }}>min</span>
                </Typography>
              </div>
            </ListItem>
            <Divider />
            <ListItem 
              className={classes.listHeader}
              role={undefined} 
              dense 
              button 
              onClick={this.handleChartToggleAll}
            >
              <Checkbox
                checked={Boolean(this.state.chartMenu.length === this.state.chartMenu.filter(m => m.enabled).length)}
                tabIndex={-1}
                style={{padding : 8}}
                disableRipple
              />
              <ListItemText primary={`SubCharts Display`} />
              <div>{
                <div className={classes.customBadge} style={{marginRight:44}}>
                  <Typography component="span" className={classes.customBadgeText}>{this.state.chartMenu.filter(w => w.enabled).length}</Typography>
                </div>
              }</div>
            </ListItem>
            {
              this.state.chartMenu.map(menu => (
                <React.Fragment key={`chartMenu-${menu.data}`}>
                  {
                    (menu.title === 'SQL') ? (<Divider />) : ('')
                  }
                  <ListItem 
                    role={undefined} 
                    dense 
                    button 
                    onClick={()=>this.handleChartToggle(menu.title)}
                  >
                    <Checkbox
                      checked={menu.enabled}
                      tabIndex={-1}
                      style={{padding : 8}}
                      disableRipple
                    />
                    <ListItemText primary={menu.title} />
                    {
                      (menu.title === 'SQL') ? (
                        <ListItemSecondaryAction>
                          <Button
                            aria-owns={this.state.anchorLimitEl ? 'limit-menu' : undefined}
                            aria-haspopup="true"
                            onClick={this.handleLimitOpen}
                            style={{padding : 8}}
                          >
                            {this.state.limitMenus.filter(l => l.selected)[0].value}
                            <ArrowDropDownIcon />
                          </Button>
                          <Menu
                            id="limit-menu"
                            anchorEl={this.state.anchorLimitEl}
                            open={Boolean(this.state.anchorLimitEl)}
                            onClose={this.handleLimitClose}
                          >
                            {
                              this.state.limitMenus.map(l => (
                                <MenuItem 
                                  onClick={this.handleLimitClose}
                                  key={`sql-limit-${l.value}`}
                                  value={l.value} 
                                  selected={l.selected}
                                  classes={{
                                    selected : classes.menuSelected
                                }}>
                                  {l.value}
                                </MenuItem>
                              ))
                            }
                          </Menu>
                        </ListItemSecondaryAction>
                      ) : ('')
                    }
                  </ListItem>
                </React.Fragment>
              ))
            }
            <Divider />
            <ListItem 
              role={undefined} 
              dense 
              button 
              onClick={()=>this.handleShowInfo(true)}
            >
              <i className="fas fa-info-circle" style={{
                margin: 12,
                color: 'rgba(255,255,255,0.95)',
              }}></i>
              <ListItemText primary="About StatsPack Visualizer" />
            </ListItem>
            
            
          </List>
        </Drawer>
        {
          (this.state.firstLoad || this.state.showInfo) && (
            <div className={classes.splashScreen}>
              <div className={classes.splashScreenBox}>
              <div className={classes.splashScreenBoxImage}>
                <Typography 
                  className={classes.title} 
                  variant="h6" 
                  style={{
                    color:'rgba(255,255,255,0.9)',
                    fontSize : 32,
                    lineHeight : '1em',
                    marginBottom : 12,
                    textShadow : '1px 0 2px rgba(0,0,0,0.25)',
                  }} 
                  noWrap
                >
                  <span style={{fontWeight: 700}}>StatsPack</span><br />Visualizer
                </Typography>
                <span className={classes.version}>version {pjson.version}</span>
                {
                  this.state.firstLoad && (
                      <div style={{width:'100%',display : 'flex', justifyContent:'center', paddingBottom : 8}}>
                      <CircularProgress className={classes.progress} style={{color:'rgba(255,255,255,0.8)'}} />
                      </div>
                  )
                }
                {
                  this.state.showInfo && (
                    <div className={classes.splashScreenBoxFoot}>
                      <Button 
                        onClick={()=>this.handleShowInfo(false)}
                        style={{textShadow : '0 0 2px rgba(0,0,0,0.5)'}}
                      >Close</Button>
                    </div>
                  )
                }
              </div>
              </div>
            </div>
          )
        }
        {
          this.state.loading && (
            <div className={classes.loadingMask}>
              <LinearProgress style={{width:'100%', height:2, backgroundColor : 'rgba(255,255,255,0.8)'}} />
            </div>
          )
        }

      </MuiThemeProvider>
      </MuiPickersUtilsProvider>
      
    );
  }
}


App.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(App);
//export default App;
