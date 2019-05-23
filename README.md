StatsPack Visualizer
==========================
![image](https://github.com/JPMUG-KK/ora-stats/blob/master/public/img/screenshot.png)
## Description
Directly reference and visualize the Oracle statspack table.

## Requirement
* node 8.11.3+
* npm 6.4.1+ or similar package manager
* React 16.4+
* Python 2.7+
* Oracle 18, 12, or 11.2 client libraries

### node-oracledb requirement
[Quick Start Node-oracledb Installation](https://oracle.github.io/node-oracledb/INSTALL.html#quickstart)

## Quick Start
### Node Module acquisition
1. `cd /ora-stats`
1. `npm install`

### Database connection config file editing
1. `cd /ora-stats`
1. Open the `/src/dbconfig.js`
1. edit `password` & `connectString`
```
module.exports = {
    user          : "sys",
    password      : "pasword",
    connectString : "ip address:1521/orcl"
};
```

### API server start
1. `cd /ora-stats`
1. `npm run api-start`

### Application start
1. Open another terminal
1. `cd /ora-stats`
1. `npm start`

## Usage

### Acquisition of visualization data

1. Target period selection
1. click `CONNECT` button

### SQL Deatail
Click the log record to view details.
![image](https://github.com/JPMUG-KK/ora-stats/blob/master/public/img/screenshot_sql.png)

### filtering

`Gear icon` click

#### Chart selection
* Wait Class
* Resource
* SQL log 

![image](https://github.com/JPMUG-KK/ora-stats/blob/master/public/img/screenshot_setting.png)

#### Chart data interval adjustment
Please adjust to the statspack acquisition interval.

## Licence

This software is released under the MIT License, see LICENSE.txt.