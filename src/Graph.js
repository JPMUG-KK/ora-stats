import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Grid from '@material-ui/core/Grid';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import CircularProgress from '@material-ui/core/CircularProgress';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Tooltip from '@material-ui/core/Tooltip';

import Divider from '@material-ui/core/Divider';

import MomentUtils from '@date-io/moment';
import moment from "moment";

import Highcharts from 'highcharts';
import HighStock from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official';

//let extremesTimer = null;
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
  toolBox : {
    position: 'sticky',
    top: 64,
    zIndex: 4,
    backgroundColor: '#333',
    borderBottom: 'solid 1px rgba(0,0,0,0.15)',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    overflowX : 'hidden'
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
    zIndex : 2,
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
    marginTop : 12,
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
  TableCell : {
    padding : 8
  }
});
const theme = createMuiTheme({
  palette: {
      type: 'dark',
  },
  typography: { useNextVariants: true },
});

const WaitGraph = (prop) => {
  
  const {waits, classes} = prop;
  const colors = ['#3498db', '#9b59b6', '#34495e', '#e67e22', '#f1c40f'];
  return (
    
    <div className={classes.waitGraphBox}>
      {
        waits.data.map((d, index) => (
          <React.Fragment key={`wait-graph-${d.name} - ${d.value}`}>
          <Tooltip title={`${d.name} - ${d.value}`} placement="bottom-start">
            <div 
              className={classes.waitGraphBar} 
              style={{width:`${d.percent}%`, backgroundColor:colors[index]}}
            ></div>
          </Tooltip>
          </React.Fragment>
        ))
      }
      <Tooltip title={`Elapsed Time - ${waits.total.value}`} placement="bottom-start">
        <div 
          className={classes.waitGraphBar} 
          style={{
            width:`${waits.total.percent}%`
          }} 
          data-width={waits.total.percent}></div>
      </Tooltip>
    </div>
    
  );
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
class Graph extends Component {
  constructor(props) {
    super(props);
    //console.log('Graph-props', props)
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
    this.state={
        openDialog : false,
        chartMenu : chartMenu,
        waitClassChartHeight : waitClassChartHeight,
        defaultChartHeight : chartHeight,
        anchorWaitClassHeightEl : null,
        anchorChartHeightEl : null,
    };
    this.autoBind();
  }
  autoBind() {
    Object.getOwnPropertyNames(this.constructor.prototype)
      .filter(prop => typeof this[prop] === 'function')
      .forEach(method => {
        this[method] = this[method].bind(this);
      });
  }
  componentWillMount(){

  }

  componentDidMount(){

  }
  getLogDetail(SNAP_ID, SQL_ID){
    //console.log('graph.js -getLogDetail')
    this.setState({
      queryParams : [],
      waitGraph : {}
    });
    fetch(`http://localhost:5000/getLogDetail/${SNAP_ID}/${SQL_ID}`)
    .then(function(response) {
      return response.json();
    })
    .then((json) => {
      //const json = JSON.parse(text);
      const log = json.rows[0];
      const queryParams = [];
      const waitTimes = ['APPLICATION_WAIT_TIME', 'CONCURRENCY_WAIT_TIME', 'CLUSTER_WAIT_TIME', 'USER_IO_WAIT_TIME', 'CPU_TIME'];
      const waitGraph = [];
      let elapsed = 0;
      Object.keys(log).forEach(key => {
        let value = log[key];
        if(key === 'ADDRESS'){
          value = value.data.join(' , ');
        }
        if(waitTimes.indexOf(key) > -1){
          waitGraph.push({
            name : key,
            value : value
          });
        }
        if(key === 'ELAPSED_TIME'){
          elapsed = value;
        }
        queryParams.push({
          name  : key,
          value : value === null ? '' : value,
          isNum : !isNaN(value) && value !== ''
        });
      });
      let totalPercent = 100;
      const waitData = waitGraph.map(data => {
        let percent = Math.floor(data.value / elapsed * 100);
        if(percent === 0 && data.value > 0) percent = 1;
        totalPercent -= percent;
        return {
          name    : data.name,
          value   : data.value,
          percent : percent
        }
      });
      
      this.setState({
        queryParams : queryParams,
        waitGraph : {
          data : waitData,
          total : {
            value : elapsed,
            percent : totalPercent
          }
        }
      });
      
    })
    .catch(error => console.error('Error:', error));
  }
  handleDialogOpen(event){
    let row       = event.target;
    while(row.tagName !== 'TR' && row.parentElement){
      row = row.parentElement;
    }
    const dataset = row.dataset;
    const SNAP_ID = dataset.snap_id;
    const SQL_ID  = dataset.sql_id;
    this.setState({
        openDialog : true,
    });
    this.getLogDetail(SNAP_ID, SQL_ID);
  }
  handleDialogClose(){
      this.setState({
        openDialog : false
      });
  }
  componentDidUpdate(prevProps, prevState){
//    console.log('componentDidUpdate');
    const prevWaitClassChartHeight = this.props.prop.waitClassChartHeight.filter(w => w.selected)[0].height;
    const currWaitClassChartHeight = prevProps.prop.waitClassChartHeight.filter(w => w.selected)[0].height;
    const prevDefaultChartHeight = this.props.prop.defaultChartHeight.filter(w => w.selected)[0].height;
    const currDefaultChartHeight = prevProps.prop.defaultChartHeight.filter(w => w.selected)[0].height;
    if(this.props.prop) console.log('this.props.prop.loadData', this.props.prop.loadData)
    if(prevWaitClassChartHeight !== currWaitClassChartHeight){
      this.handleChartHeightChange('waitClassChartHeight');
//      console.log(prevWaitClassChartHeight, currWaitClassChartHeight);
    }
    if(prevDefaultChartHeight !== currDefaultChartHeight){
      this.handleChartHeightChange('defaultChartHeight');
//      console.log(prevDefaultChartHeight, currDefaultChartHeight);
    }
    console.log('this.props.prop.syncHeight=>', this.props.prop.syncHeight);
    
    Object.keys(this.props.prop.syncHeight).map(key => {
      if(this.internalChart && this.internalChart[key] && this.internalChart[key].yAxis){
        const newMin = this.props.prop.syncHeight[key].min;
        const oldMin = this.internalChart[key].yAxis[0].min;
        const newMax = this.props.prop.syncHeight[key].max;
        const oldMax = this.internalChart[key].yAxis[0].min;
        if(newMin != oldMin || newMax != oldMax){
          this.internalChart[key].update({
            yAxis : [{
              min : newMin,
              max : newMax
            }]
          });
        }
      }
    });
   console.log('this.internalChart=>', this.internalChart);

  }

  handleChartHeightChange(key){
    console.log('handleChartHeightChange()', this.prop.loadData);
    
    if(this.internalChart){
      const heightMenu = this.props.prop[key].filter(c => c.selected);
      const value      = heightMenu[0].height;
      if(key === 'waitClassChartHeight' && this.internalChart.waitClassChart){
        this.internalChart.waitClassChart.update({
          chart : {
            height : value
          }
        });
      }else if(this.state.chartMenu && this.state.chartMenu.length){
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
  afterChartCreated(chart){
    const key = chart.userOptions.key;
    if(this.internalChart === undefined) this.internalChart = {};
    this.internalChart[key] = chart;
    console.log(this.props)
    this.props.prop.setSyncHeight(key, chart.yAxis[0].min, chart.yAxis[0].max);
  }
  parseNumber(elapsed, execution){
    const num = String((elapsed/execution).toFixed(2)).split('.');
    return Number(num[0]).toLocaleString() + '.' + num[1];
  }
  render() {
    const { classes, prop, index } = this.props;

    const loadData = (prop.loadData && prop.loadData[index]) ? prop.loadData[index] : {};
    //console.log('loadData', loadData);
    const options = (prop.summaryChartOptions && prop.summaryChartOptions[index] !== undefined) ? prop.summaryChartOptions[index]  : {};
    const columnLength = prop.columnMenus.filter(c => c.selected).map(c=>c.value)[0];
    const xs = 12/columnLength;
    //console.log('options', options);
    return (
      <MuiPickersUtilsProvider utils={MomentUtils} moment={moment}>
      <MuiThemeProvider theme={theme}>
      <div className={classes.root}>
          <Grid container spacing={24}>
            {
              (Object.keys(options).length) ? (
                <Grid item xs={12}>
                  <Typography component="h2" variant="h5">{prop.summaryChartTitle}</Typography>
                  <HighchartsReact
                    highcharts={HighStock}
                    constructorType={'stockChart'}
                    options={options}
                    callback={ this.afterChartCreated }
                  />
                </Grid>
              ) : (
                <div style={{
                  position : 'absolute',
                  top : 160,
                  left :0,
                  right : 0,
                  bottom : 0,
                  display : 'flex',
                  justifyContent : 'center',
                  alignItems : 'center',
                  color : 'rgba(255,255,255,0.1)',
                  fontSize : 24
                }}>
                  <i style={{
                    border: 'solid 1px rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    padding: 20,
                    backgroundColor: 'rgba(0,0,0,0.15)',
                  }} className="fas fa-chart-area"></i>
                </div>
              )
            }
            {
              prop.chartMenu.filter(m => m.title !== 'SQL' && m.enabled && loadData[m.data] !== undefined && Object.keys(loadData[m.data]).length).map(m => (
                  <Grid 
                    item 
                    xs={xs} 
                    className={classes.chartBox}
                    key={`chart-box-${m.data}`}
                  >
                    <Typography 
                      component="h3" 
                      variant="h6" 
                      className={classes.chartTitle}
                    >
                      {m.title}
                    </Typography>
                    <HighchartsReact
                      highcharts={HighStock}
                      constructorType={'stockChart'}
                      options={loadData[m.data]}
                      callback={ this.afterChartCreated }
                    />
                  </Grid>
              ))

            }
            
            {
                (prop.chartMenu.filter(m => m.title === 'SQL')[0].enabled && loadData.logs !== undefined && loadData.logs.length) ? (
                    <Grid item xs={12} style={{overflowX:'auto'}}>
                      <Divider />
                      <Typography 
                        component="h3" 
                        variant="h6" 
                        style={{textAlign : 'center', paddingTop : 12}}
                      >
                        SQL Top {prop.limitMenus.filter(l => l.selected)[0].value}
                      </Typography>
                        <Table className={classes.table}>
                            <TableHead>
                            <TableRow>
                                <TableCell className={classes.TableCell}>SNAP_ID</TableCell>
                                <TableCell className={classes.TableCell}>SQL_ID</TableCell>
                                <TableCell className={classes.TableCell}>TEXT_SUBSET</TableCell>
                                <TableCell className={classes.TableCell} align="right">EXECUTIONS</TableCell>
                                <TableCell className={classes.TableCell} align="right">ELAPSED TIME</TableCell>
                                <TableCell className={classes.TableCell} align="right">ELAPSED / EXECUTIONS</TableCell>
                                <TableCell className={classes.TableCell} align="right">LAST ACTIVE_TIME</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {
                                loadData.logs.map(log => (
                                    <TableRow 
                                        key={`${log.LAST_ACTIVE_TIME}-${log.SQL_ID}-${log.SNAP_ID}`}
                                        onClick={this.handleDialogOpen}
                                        data-sql_id={log.SQL_ID}
                                        data-snap_id={log.SNAP_ID}
                                        className={classes.selectRow}
                                    >
                                        <TableCell className={classes.TableCell}>{log.SNAP_ID}</TableCell>
                                        <TableCell className={classes.TableCell}>{log.SQL_ID}</TableCell>
                                        <TableCell className={classes.TableCell} style={{wordBreak : 'break-all'}}>{log.TEXT_SUBSET}</TableCell>
                                        <TableCell className={classes.TableCell} align="right">{(log.EXECUTIONS).toLocaleString()}</TableCell>
                                        <TableCell className={classes.TableCell} align="right">{(log.ELAPSED_TIME).toLocaleString()}</TableCell>
                                        <TableCell className={classes.TableCell} align="right">{this.parseNumber(log.ELAPSED_TIME,log.EXECUTIONS)}</TableCell>
                                        <TableCell className={classes.TableCell} align="right">{moment(log.LAST_ACTIVE_TIME).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                                    </TableRow>
                                ))
                            }
                            </TableBody>
                        </Table>
                        
                    </Grid>
                ) : ('')
            }
          </Grid>

        {
            this.state.openDialog && <Dialog
            open={this.state.openDialog}
            onClose={this.handleDialogClose}
            aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                <i className="far fa-file-alt"></i> Log Detail
                {
                    Object.keys(this.state.waitGraph).length && <WaitGraph waits={this.state.waitGraph} classes={classes} />
                }
                </DialogTitle>
                <DialogContent style={{textAlign : 'center'}}>

                  {
                    (this.state.queryParams.length) ? (
                      <Table className={classes.table}>
                      <TableBody>
                        {
                          this.state.queryParams.map(data => (
                            <TableRow key={`${data.name}`}>
                              <TableCell component="th">
                                {data.name}
                              </TableCell>
                              <TableCell align={(data.isNum) ? 'right' : 'inherit'}>
                                {data.value}
                              </TableCell>
                            </TableRow>
                          ))
                        }
                      </TableBody>
                      </Table>
                    ) : (
                      <CircularProgress className={classes.progress} />
                    )
                  }
                </DialogContent>
                <DialogActions>
                <Button onClick={this.handleDialogClose} color="secondary">
                    Close
                </Button>
                </DialogActions>
            </Dialog>
        }
      </div>
      </MuiThemeProvider>
      </MuiPickersUtilsProvider>
      
    );
  }
}


Graph.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Graph);
//export default App;
