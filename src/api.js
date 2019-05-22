process.env.ORA_SDTZ = 'UTC';

const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');
const moment  = require('moment');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const server = app.listen(5000, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);
});
app.get("/getDateRange", function(req, res, next){
    const params = req.params;
    const start  = params.start;
    const end    = params.end;
    const sTime  = new Date().getTime();
    async function run() {
        let connection;

        try {
    
        let sql, binds, options, result;
    
        connection = await oracledb.getConnection(  {
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString,
            privilege     : oracledb.SYSDBA
        });

        sql = `select 
            min(LAST_ACTIVE_TIME) as min, 
            max(LAST_ACTIVE_TIME) as max
        from 
            stats$sql_summary`;
//        console.log('sql', sql);
        binds = {};
    
        // For a complete list of options see the documentation.
        options = {
            outFormat: oracledb.OBJECT,   // query result format
            extendedMetaData: true,   // get extra metadata
            fetchArraySize: 100       // internal buffer allocation size for tuning
        };
    
        result = await connection.execute(sql, binds, options);
//        console.log(result.rows);
        const rTime  = new Date().getTime() - sTime;
        result.executionTime = rTime;
        res.send(result);

        } catch (err) {
            console.error(err);
        } finally {
        if (connection) {
            try {
            await connection.close();
            } catch (err) {
            console.error(err);
            }
        }
        }
    }
    run();
});
app.get("/getSummaryStats/:start/:end", function(req, res, next){
    const params = req.params;
    const start  = params.start;
    const end    = params.end;

    async function run() {
        let connection;

        try {
    
        let sql, binds, options, result;
    
        connection = await oracledb.getConnection(  {
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString,
            privilege     : oracledb.SYSDBA
        });

        sql = `select 
            trunc(
                to_number(
                    to_date(SUBSTR(TO_CHAR(LAST_ACTIVE_TIME ,'yyyy/mm/dd hh24:mi:ss'), 1, 16), 'YYYY/MM/DD HH24:MI:SS')
                    - to_date('1970/01/01 00:00:00', 'YYYY/MM/DD HH24:MI:SS')
                ) * (24 * 60 * 60 * 1000)
            ) unixtime, 
            count(EXECUTIONS) count,
            sum(ELAPSED_TIME) elapsed 
        from 
            stats$sql_summary 
        where 
            LAST_ACTIVE_TIME >= to_date('${start} 00:00:00', 'yyyy/mm/dd hh24:mi:ss') 
            and LAST_ACTIVE_TIME <=  to_date('${end} 23:59:59', 'yyyy/mm/dd hh24:mi:ss') 
        GROUP BY SUBSTR(TO_CHAR(LAST_ACTIVE_TIME ,'yyyy/mm/dd hh24:mi:ss'), 1, 16) 
        order by SUBSTR(TO_CHAR(LAST_ACTIVE_TIME ,'yyyy/mm/dd hh24:mi:ss'), 1, 16)
        `;
//        console.log('sql', sql);
        binds = {};
    
        // For a complete list of options see the documentation.
        options = {
            outFormat: oracledb.OBJECT,   // query result format
            extendedMetaData: true,   // get extra metadata
            fetchArraySize: 100       // internal buffer allocation size for tuning
        };
    
        result = await connection.execute(sql, binds, options);
    
//        console.log("Column metadata: ", result.metaData);
//        console.log("Query results: ");
//        console.log(result.rows);
        res.send(result);

        } catch (err) {
        console.error(err);
        } finally {
        if (connection) {
            try {
            await connection.close();
            } catch (err) {
            console.error(err);
            }
        }
        }
    }
    run();
});

app.get("/getSelectRangeLogs/:start/:end/:limit", function(req, res, next){
    const params = req.params;
    const start  = moment(parseFloat(params.start)).format('YYYY-MM-DD HH:mm:ss');
    const end    = moment(parseFloat(params.end)).format('YYYY-MM-DD HH:mm:ss');
    const limit  = params.limit;
    //console.log(start, end);
    const sTime  = new Date().getTime();
    async function run() {
        let connection;

        try {
    
        let sql, binds, options, result;
    
        connection = await oracledb.getConnection(  {
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString,
            privilege     : oracledb.SYSDBA
        });
/*
        sql = `select * from (
            select
                LAST_ACTIVE_TIME,
                SQL_ID,
                TEXT_SUBSET,
                EXECUTIONS,
                APPLICATION_WAIT_TIME,
                CONCURRENCY_WAIT_TIME,
                CLUSTER_WAIT_TIME,
                USER_IO_WAIT_TIME,
                ELAPSED_TIME,
                SNAP_ID,
                ELAPSED_TIME/EXECUTIONS as "ELAPSED_TIME/EXECUTIONS" 
            from
                stats$sql_summary
            where
                LAST_ACTIVE_TIME >= to_date('${start}', 'yyyy/mm/dd hh24:mi:ss')
                and LAST_ACTIVE_TIME <=  to_date('${end}', 'yyyy/mm/dd hh24:mi:ss')
                and EXECUTIONS > 0 
                and ELAPSED_TIME > 0 
            order by "ELAPSED_TIME/EXECUTIONS" desc
        ) where rownum <=${limit}
        `;
*/
sql = `select
        LAST_ACTIVE_TIME,
        SQL_ID,
        TEXT_SUBSET,
        EXECUTIONS,
        APPLICATION_WAIT_TIME,
        CONCURRENCY_WAIT_TIME,
        CLUSTER_WAIT_TIME,
        USER_IO_WAIT_TIME,
        ELAPSED_TIME,
        SNAP_ID,
        ELAPSED_TIME/EXECUTIONS as "ELAPSED_TIME/EXECUTIONS" 
    from
        stats$sql_summary
    where
        LAST_ACTIVE_TIME >= to_date('${start}', 'yyyy/mm/dd hh24:mi:ss')
        and LAST_ACTIVE_TIME <=  to_date('${end}', 'yyyy/mm/dd hh24:mi:ss')
        and EXECUTIONS > 0 
        and ELAPSED_TIME > 0 
        and rownum <=${limit} 
    order by "ELAPSED_TIME/EXECUTIONS" desc
`;
        //        console.log('sql', sql);
        binds = {};
    
        // For a complete list of options see the documentation.
        options = {
            outFormat: oracledb.OBJECT,   // query result format
            extendedMetaData: true,   // get extra metadata
            fetchArraySize: 100       // internal buffer allocation size for tuning
        };
    
        result = await connection.execute(sql, binds, options);
    
//        console.log("Column metadata: ", result.metaData);
//        console.log("Query results: ");
//        console.log(result.rows);
            const rTime  = new Date().getTime() - sTime;
            result.executionTime = rTime;
            res.send(result);

        } catch (err) {
        console.error(err);
        } finally {
        if (connection) {
            try {
            await connection.close();
            } catch (err) {
            console.error(err);
            }
        }
        }
    }
    run();
});
app.get("/getWaitClassParams", function(req, res, next){

    const sTime  = new Date().getTime();
    async function run() {
        let connection;

        try {
    
        let sql, binds, options, result;
    
        connection = await oracledb.getConnection(  {
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString,
            privilege     : oracledb.SYSDBA
        });

        sql = `select wait_class, display_name from v$event_name order by wait_class`;
//        console.log('sql', sql);
        binds = {};
    
        // For a complete list of options see the documentation.
        options = {
            outFormat: oracledb.OBJECT,   // query result format
            extendedMetaData: true,   // get extra metadata
            fetchArraySize: 100       // internal buffer allocation size for tuning
        };
    
        result = await connection.execute(sql, binds, options);
    
//        console.log("Column metadata: ", result.metaData);
//        console.log("Query results: ");
//        console.log(result.rows);
            const rTime  = new Date().getTime() - sTime;
            result.executionTime = rTime;
            res.send(result);

        } catch (err) {
        console.error(err);
        } finally {
        if (connection) {
            try {
            await connection.close();
            } catch (err) {
            console.error(err);
            }
        }
        }
    }
    run();
});
app.post("/getWaitEvents", function(req, res, next){
    const params = req.body;
    const start  = moment(parseFloat(params.start)).format('YYYY-MM-DD 00:00');
    const end    = moment(parseFloat(params.end)).format('YYYY-MM-DD 23:59');
    const waitEvents = params.waitEvents.join(`','`);
    const conditions = (params.exclusions) ? 'not in' : 'in';
//    console.log(start, end, waitEvents);
    const sTime  = new Date().getTime();
    async function run() {
        let connection;

        try {
    
        let sql, binds, options, result;
    
        connection = await oracledb.getConnection(  {
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString,
            privilege     : oracledb.SYSDBA
        });

        sql = `select snap_time,event,round((value - pre_value)/1000000,2) diff_value
        from (
        select to_char(snap.snap_time, 'YYYY/MM/DD HH24:MI') snap_time,
               event,event.TIME_WAITED_MICRO value,
        lag( event.TIME_WAITED_MICRO ) over ( partition by snap.dbid,snap.instance_number,event.event order by snap.snap_id ) as pre_value
               from stats$system_event event,stats$snapshot snap
               where event.snap_id= snap.snap_id
               and event.dbid   = snap.dbid
               and event.instance_number = snap.instance_number
               and snap.snap_time between to_date('${start}','YYYY/MM/DD HH24:MI') and to_date('${end}','YYYY/MM/DD HH24:MI')
               and not exists (select 1 from v$event_name idle where idle.event_id = event.event_id and wait_class = 'Idle' )
               and not exists (select 1 from stats$idle_event idle where idle.event = event.event )`
        if(waitEvents != '') sql += ` and event ${conditions} ('${waitEvents}') `
        sql += `union all 
        select to_char(snap.snap_time, 'YYYY/MM/DD HH24:MI') snap_time
              ,'CPU time' event
              ,sys.value/100*1000000 value,
              (lag( sys.value ) over ( partition by snap.dbid,snap.instance_number,snap.startup_time order by snap.snap_id ))/100*1000000 pre_value
                from stats$sysstat sys,stats$snapshot snap
               where sys.name            = 'CPU used by this session'
               and sys.snap_id= snap.snap_id
               and sys.dbid   = snap.dbid
               and sys.instance_number = snap.instance_number
               and snap.snap_time between to_date('${start}','YYYY/MM/DD HH24:MI') and to_date('${end}','YYYY/MM/DD HH24:MI')
        )
        where ((value - pre_value ) > 1000000
               or event = 'CPU time')
        and pre_value is not null
        order by snap_time,event
        `;
//        console.log('sql', sql);
        binds = {};
    
        // For a complete list of options see the documentation.
        options = {
            outFormat: oracledb.OBJECT,   // query result format
            extendedMetaData: true,   // get extra metadata
            fetchArraySize: 100       // internal buffer allocation size for tuning
        };
    
        result = await connection.execute(sql, binds, options);
    
//        console.log("Column metadata: ", result.metaData);
//        console.log("Query results: ");
//        console.log(result.rows);
            const rTime  = new Date().getTime() - sTime;
            result.executionTime = rTime;
            res.send(result);

        } catch (err) {
        console.error(err);
        } finally {
        if (connection) {
            try {
            await connection.close();
            } catch (err) {
            console.error(err);
            }
        }
        }
    }
    run();
});

app.get("/getLogDetail/:SNAP_ID/:SQL_ID", function(req, res, next){
    const params  = req.params;
    const SNAP_ID = params.SNAP_ID;
    const SQL_ID  = params.SQL_ID;
    const sTime  = new Date().getTime();
    async function run() {
        let connection;

        try {
    
        let sql, binds, options, result;
    
        connection = await oracledb.getConnection(  {
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString,
            privilege     : oracledb.SYSDBA
        });

        sql = `select 
            * 
        from 
        stats$sql_summary sqls 
        JOIN 
            stats$sqltext sqlt ON sqls.SQL_ID = sqlt.SQL_ID
        where 
            sqls.SNAP_ID = '${SNAP_ID}' 
            and sqls.SQL_ID = '${SQL_ID}'`;
        console.log('sql', sql);
        binds = {};
    
        // For a complete list of options see the documentation.
        options = {
            outFormat: oracledb.OBJECT,   // query result format
            extendedMetaData: true,   // get extra metadata
            fetchArraySize: 100       // internal buffer allocation size for tuning
        };
    
        result = await connection.execute(sql, binds, options);
//        console.log(result.rows);
        const rTime  = new Date().getTime() - sTime;
        result.executionTime = rTime;
        res.send(result);

        } catch (err) {
        console.error(err);
        } finally {
        if (connection) {
            try {
            await connection.close();
            } catch (err) {
            console.error(err);
            }
        }
        }
    }
    run();
});

app.get("/getLogons/:start/:end", function(req, res, next){
    const params = req.params;
    const start  = moment(parseFloat(params.start)).format('YYYY-MM-DD HH:mm');
    const end    = moment(parseFloat(params.end)).format('YYYY-MM-DD HH:mm');

    const sTime  = new Date().getTime();
    async function run() {
        let connection;

        try {
    
        let sql, binds, options, result;
    
        connection = await oracledb.getConnection(  {
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString,
            privilege     : oracledb.SYSDBA
        });

        sql = `select 
            to_char(snap.snap_time, 'YYYY/MM/DD HH24:MI') snap_time,
            sys.value
        from 
            stats$sysstat sys,
            stats$snapshot snap
        where 
            sys.name            = 'logons current'
            and sys.snap_id= snap.snap_id
            and sys.dbid   = snap.dbid
            and sys.instance_number = snap.instance_number
            and snap.snap_time between to_date('${start}','YYYY/MM/DD HH24:MI') and to_date('${end}','YYYY/MM/DD HH24:MI')
        `;
//        console.log('sql', sql);
        binds = {};
    
        // For a complete list of options see the documentation.
        options = {
            outFormat: oracledb.OBJECT,   // query result format
            extendedMetaData: true,   // get extra metadata
            fetchArraySize: 100       // internal buffer allocation size for tuning
        };
    
        result = await connection.execute(sql, binds, options);
    
//        console.log("Column metadata: ", result.metaData);
//        console.log("Query results: ");
//        console.log(result.rows);
        const rTime  = new Date().getTime() - sTime;
        result.executionTime = rTime;
        res.send(result);

        } catch (err) {
        console.error(err);
        } finally {
        if (connection) {
            try {
            await connection.close();
            } catch (err) {
            console.error(err);
            }
        }
        }
    }
    run();
});

app.get("/getOpenedCursorsCurrent/:start/:end", function(req, res, next){
    const params = req.params;
    const start  = moment(parseFloat(params.start)).format('YYYY-MM-DD HH:mm');
    const end    = moment(parseFloat(params.end)).format('YYYY-MM-DD HH:mm');

    const sTime  = new Date().getTime();
    async function run() {
        let connection;

        try {
    
        let sql, binds, options, result;
    
        connection = await oracledb.getConnection(  {
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString,
            privilege     : oracledb.SYSDBA
        });

        sql = `select 
        to_char(snap.snap_time, 'YYYY/MM/DD HH24:MI') snap_time,
        sys.value
    from 
        stats$sysstat sys,
        stats$snapshot snap
    where 
        sys.name            = 'opened cursors current'
        and sys.snap_id= snap.snap_id
        and sys.dbid   = snap.dbid
        and sys.instance_number = snap.instance_number
        and snap.snap_time between to_date('${start}','YYYY/MM/DD HH24:MI') and to_date('${end}','YYYY/MM/DD HH24:MI')
        `;
//        console.log('sql', sql);
        binds = {};
    
        // For a complete list of options see the documentation.
        options = {
            outFormat: oracledb.OBJECT,   // query result format
            extendedMetaData: true,   // get extra metadata
            fetchArraySize: 100       // internal buffer allocation size for tuning
        };
    
        result = await connection.execute(sql, binds, options);
    
//        console.log("Column metadata: ", result.metaData);
//        console.log("Query results: ");
//        console.log(result.rows);
        const rTime  = new Date().getTime() - sTime;
        result.executionTime = rTime;
        res.send(result);

        } catch (err) {
        console.error(err);
        } finally {
        if (connection) {
            try {
            await connection.close();
            } catch (err) {
            console.error(err);
            }
        }
        }
    }
    run();
});

app.get("/getMemoryUsage/:start/:end", function(req, res, next){
    const params = req.params;
    const start  = moment(parseFloat(params.start)).format('YYYY-MM-DD HH:mm');
    const end    = moment(parseFloat(params.end)).format('YYYY-MM-DD HH:mm');

    const sTime  = new Date().getTime();
    async function run() {
        let connection;

        try {
    
        let sql, binds, options, result;
    
        connection = await oracledb.getConnection(  {
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString,
            privilege     : oracledb.SYSDBA
        });

        sql = `select 
            snap_time
            ,round(PHYSICAL_MEMORY_BYTES/1024/1024,2)  as PHYSICAL_MEMORY_MB
            ,round(FREE_MEMORY_BYTES/1024/1024,2)      as FREE_MEMORY_MB
            ,round(INACTIVE_MEMORY_BYTES/1024/1024,2)  as INACTIVE_MEMORY_MB
            ,round(SWAP_FREE_BYTES/1024/1024,2)        as SWAP_FREE_MB
        from
        (select s.snap_id
            , sn.stat_name
            , to_char(ss.snap_time, 'YYYY/MM/DD HH24:MI') snap_time
            ,s.value
        from stats$osstat s
            , stats$osstatname sn
            , stats$snapshot ss
        where sn.osstat_id          = s.osstat_id
        and sn.stat_name         in
                ('PHYSICAL_MEMORY_BYTES'
                ,'FREE_MEMORY_BYTES'
                ,'INACTIVE_MEMORY_BYTES'
                ,'SWAP_FREE_BYTES'
                )
        and ss.snap_id            = s.snap_id
        and ss.dbid               = s.dbid
        and ss.instance_number    = ss.instance_number
        and ss.snap_time between to_date('${start}','YYYY/MM/DD HH24:MI') and to_date('${end}','YYYY/MM/DD HH24:MI')
        )
        pivot(max(value)
        for stat_name in (
            'PHYSICAL_MEMORY_BYTES' as PHYSICAL_MEMORY_BYTES
            ,'FREE_MEMORY_BYTES'     as FREE_MEMORY_BYTES
            ,'INACTIVE_MEMORY_BYTES' as INACTIVE_MEMORY_BYTES
            ,'SWAP_FREE_BYTES'       as SWAP_FREE_BYTES
        ))
        `;
//        console.log('sql', sql);
        binds = {};
    
        // For a complete list of options see the documentation.
        options = {
            outFormat: oracledb.OBJECT,   // query result format
            extendedMetaData: true,   // get extra metadata
            fetchArraySize: 100       // internal buffer allocation size for tuning
        };
    
        result = await connection.execute(sql, binds, options);
    
//        console.log("Column metadata: ", result.metaData);
//        console.log("Query results: ");
//        console.log(result.rows);
        const rTime  = new Date().getTime() - sTime;
        result.executionTime = rTime;
        res.send(result);

        } catch (err) {
        console.error(err);
        } finally {
        if (connection) {
            try {
            await connection.close();
            } catch (err) {
            console.error(err);
            }
        }
        }
    }
    run();
});

app.get("/getPageInOut/:start/:end", function(req, res, next){
    const params = req.params;
    const start  = moment(parseFloat(params.start)).format('YYYY-MM-DD HH:mm');
    const end    = moment(parseFloat(params.end)).format('YYYY-MM-DD HH:mm');

    const sTime  = new Date().getTime();
    async function run() {
        let connection;

        try {
    
        let sql, binds, options, result;
    
        connection = await oracledb.getConnection(  {
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString,
            privilege     : oracledb.SYSDBA
        });

        sql = `select snap_time,
            ROUND(VM_IN_BYTES/1024/1024,0) VM_IN_MB,
            ROUND(VM_OUT_BYTES/1024/1024,0) VM_OUT_MB from
        (
            select 
                to_char(snap.snap_time, 'YYYY/MM/DD HH24:MI') snap_time,
                sn.stat_name,os.value,
                (lag( os.value ) over ( partition by snap.dbid,snap.instance_number,snap.startup_time,sn.stat_name order by snap.snap_id )) prev_value
            from 
                stats$osstat os,stats$snapshot snap, stats$osstatname sn
            where 
                sn.osstat_id          = os.osstat_id
                and sn.stat_name            in ('VM_IN_BYTES','VM_OUT_BYTES')
                and os.snap_id= snap.snap_id
                and os.dbid   = snap.dbid
                and os.instance_number = snap.instance_number
                and snap.snap_time between to_date('${start}','YYYY/MM/DD HH24:MI') and to_date('${end}','YYYY/MM/DD HH24:MI')
        )
        pivot(max(value - prev_value)
        for stat_name in ('VM_IN_BYTES' VM_IN_BYTES
                        ,'VM_OUT_BYTES' VM_OUT_BYTES))
        order by snap_time
        `;
//        console.log('sql', sql);
        binds = {};
    
        // For a complete list of options see the documentation.
        options = {
            outFormat: oracledb.OBJECT,   // query result format
            extendedMetaData: true,   // get extra metadata
            fetchArraySize: 100       // internal buffer allocation size for tuning
        };
    
        result = await connection.execute(sql, binds, options);
    
//        console.log("Column metadata: ", result.metaData);
//        console.log("Query results: ");
//        console.log(result.rows);
        const rTime  = new Date().getTime() - sTime;
        result.executionTime = rTime;
        res.send(result);

        } catch (err) {
        console.error(err);
        } finally {
        if (connection) {
            try {
            await connection.close();
            } catch (err) {
            console.error(err);
            }
        }
        }
    }
    run();
});

app.get("/getCpuUsage/:start/:end", function(req, res, next){
    const params = req.params;
    const start  = moment(parseFloat(params.start)).format('YYYY-MM-DD HH:mm');
    const end    = moment(parseFloat(params.end)).format('YYYY-MM-DD HH:mm');

    const sTime  = new Date().getTime();
    async function run() {
        let connection;

        try {
    
        let sql, binds, options, result;
    
        connection = await oracledb.getConnection(  {
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString,
            privilege     : oracledb.SYSDBA
        });

        sql = `select snap_id
        , snap_time
        , to_char(ROUND(load), '990.0') load
        , to_char(ROUND(100*busy_time/(busy_time+idle_time) ,1), '990.0') pct_busy
        , to_char(ROUND(100*user_time/(busy_time+idle_time) ,1), '990.0') pct_user
        , to_char(ROUND(100*sys_time /(busy_time+idle_time) ,1), '990.0') pct_sys
        , to_char(ROUND(100*iowt_time/(busy_time+idle_time) ,1), '990.0') pct_iowt
        , to_char(ROUND(100*cpuwt_time/(busy_time+idle_time),1), '990.0') pct_cpuwt
     from (
       select snap_id
            , snap_time
            , load
            , decode( prev_busyt, -1, to_number(null), busyt-prev_busyt ) busy_time
            , decode( prev_idlet, -1, to_number(null), idlet-prev_idlet ) idle_time
            , decode( prev_usert, -1, to_number(null), usert-prev_usert ) user_time
            , decode( prev_syst,  -1, to_number(null), syst -prev_syst  ) sys_time
            , decode( prev_iowt,  -1, to_number(null), iowt -prev_iowt  ) iowt_time
            , decode( prev_cpuwt, -1, to_number(null), cpuwt-prev_cpuwt ) cpuwt_time
         from (
           select -- lag
                  snap_id
                , load
                , snap_time
                , busyt
                , ( lag (busyt, 1, -1) over (order by snap_id asc) ) prev_busyt
                , idlet
                , ( lag (idlet, 1, -1) over (order by snap_id asc) ) prev_idlet
                , usert
                , ( lag (usert, 1, -1) over (order by snap_id asc) ) prev_usert
                , syst
                , ( lag (syst, 1, -1)  over (order by snap_id asc) ) prev_syst
                , iowt
                , ( lag (iowt, 1, -1)  over (order by snap_id asc) ) prev_iowt
                , cpuwt
                , ( lag (cpuwt, 1, -1)  over (order by snap_id asc) ) prev_cpuwt
             from (  (
                      select s.snap_id
                            , sn.stat_name
                            , to_char(ss.snap_time, 'YYYY/MM/DD HH24:MI') snap_time
                            , s.value
                         from stats$osstat s
                            , stats$osstatname sn
                            , stats$snapshot ss
                        where sn.osstat_id          = s.osstat_id
                          and sn.stat_name         in
                                  ('LOAD','IDLE_TIME','BUSY_TIME','USER_TIME'
                                  ,'SYS_TIME','IOWAIT_TIME','CPU_WAIT_TIME')
                          and ss.snap_id            = s.snap_id
                          and ss.dbid               = s.dbid
                          and ss.instance_number    = ss.instance_number
                          and ss.snap_time between to_date('${start}','YYYY/MM/DD HH24:MI') and to_date('${end}','YYYY/MM/DD HH24:MI')
                     )
                     pivot
                     ( sum(value) for stat_name in
                         ( 'LOAD'          load
                          ,'IDLE_TIME'     idlet
                          ,'BUSY_TIME'     busyt
                          ,'USER_TIME'     usert
                          ,'SYS_TIME'      syst
                          ,'IOWAIT_TIME'   iowt
                          ,'CPU_WAIT_TIME' cpuwt
                         )
                     )
                  )
              )
         )
     order by snap_id
        `;
//        console.log('sql', sql);
        binds = {};
    
        // For a complete list of options see the documentation.
        options = {
            outFormat: oracledb.OBJECT,   // query result format
            extendedMetaData: true,   // get extra metadata
            fetchArraySize: 100       // internal buffer allocation size for tuning
        };
    
        result = await connection.execute(sql, binds, options);
    
//        console.log("Column metadata: ", result.metaData);
//        console.log("Query results: ");
//        console.log(result.rows);
        const rTime  = new Date().getTime() - sTime;
        result.executionTime = rTime;
        res.send(result);

        } catch (err) {
        console.error(err);
        } finally {
        if (connection) {
            try {
            await connection.close();
            } catch (err) {
            console.error(err);
            }
        }
        }
    }
    run();
});


app.get("/getExecutions/:start/:end", function(req, res, next){
    const params = req.params;
    const start  = moment(parseFloat(params.start)).format('YYYY-MM-DD HH:mm');
    const end    = moment(parseFloat(params.end)).format('YYYY-MM-DD HH:mm');

    const sTime  = new Date().getTime();
    async function run() {
        let connection;

        try {
    
        let sql, binds, options, result;
    
        connection = await oracledb.getConnection(  {
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString,
            privilege     : oracledb.SYSDBA
        });

        sql = `select snap_time,diff_value,to_char(round(diff_value/diff_sec,2),'9999999999999990.99') exec_per_sec
        from
        (
        select to_char(snap.snap_time, 'YYYY/MM/DD HH24:MI') snap_time
        , sys.value - (lag( sys.value ) over ( partition by snap.dbid,snap.instance_number,snap.startup_time order by snap.snap_id )) diff_value
        ,(snap.snap_time - (lag( snap.snap_time ) over ( partition by snap.dbid,snap.instance_number,snap.startup_time order by snap.snap_id ))) * 24 * 60 * 60 diff_sec
        from stats$sysstat sys,stats$snapshot snap
        where sys.name            = 'execute count'
        and sys.snap_id= snap.snap_id
        and sys.dbid   = snap.dbid
        and sys.instance_number = snap.instance_number
        and snap.snap_time between to_date('${start}','YYYY/MM/DD HH24:MI') and to_date('${end}','YYYY/MM/DD HH24:MI')
        )
        order by snap_time
        `;
//        console.log('sql', sql);
        binds = {};
    
        // For a complete list of options see the documentation.
        options = {
            outFormat: oracledb.OBJECT,   // query result format
            extendedMetaData: true,   // get extra metadata
            fetchArraySize: 100       // internal buffer allocation size for tuning
        };
    
        result = await connection.execute(sql, binds, options);
    
//        console.log("Column metadata: ", result.metaData);
//        console.log("Query results: ");
//        console.log(result.rows);
        const rTime  = new Date().getTime() - sTime;
        result.executionTime = rTime;
        res.send(result);

        } catch (err) {
        console.error(err);
        } finally {
        if (connection) {
            try {
            await connection.close();
            } catch (err) {
            console.error(err);
            }
        }
        }
    }
    run();
});

app.get("/getPhysicalReads/:start/:end", function(req, res, next){
    const params = req.params;
    const start  = moment(parseFloat(params.start)).format('YYYY-MM-DD HH:mm');
    const end    = moment(parseFloat(params.end)).format('YYYY-MM-DD HH:mm');

    const sTime  = new Date().getTime();
    async function run() {
        let connection;

        try {
    
        let sql, binds, options, result;
    
        connection = await oracledb.getConnection(  {
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString,
            privilege     : oracledb.SYSDBA
        });

        sql = `select snap_time,diff_value,to_char(round(diff_value/diff_sec,2),'9999999999999990.99') value_per_sec
        from
        (
        select to_char(snap.snap_time, 'YYYY/MM/DD HH24:MI') snap_time
        , sys.value - (lag( sys.value ) over ( partition by snap.dbid,snap.instance_number,snap.startup_time order by snap.snap_id )) diff_value
        ,(snap.snap_time - (lag( snap.snap_time ) over ( partition by snap.dbid,snap.instance_number,snap.startup_time order by snap.snap_id ))) * 24 * 60 * 60 diff_sec
        from stats$sysstat sys,stats$snapshot snap
        where sys.name            = 'physical reads'
        and sys.snap_id= snap.snap_id
        and sys.dbid   = snap.dbid
        and sys.instance_number = snap.instance_number
        and snap.snap_time between to_date('${start}','YYYY/MM/DD HH24:MI') and to_date('${end}','YYYY/MM/DD HH24:MI')
        )
        order by snap_time
        `;
//        console.log('sql', sql);
        binds = {};
    
        // For a complete list of options see the documentation.
        options = {
            outFormat: oracledb.OBJECT,   // query result format
            extendedMetaData: true,   // get extra metadata
            fetchArraySize: 100       // internal buffer allocation size for tuning
        };
    
        result = await connection.execute(sql, binds, options);
    
//        console.log("Column metadata: ", result.metaData);
//        console.log("Query results: ");
//        console.log(result.rows);
        const rTime  = new Date().getTime() - sTime;
        result.executionTime = rTime;
        res.send(result);

        } catch (err) {
        console.error(err);
        } finally {
        if (connection) {
            try {
            await connection.close();
            } catch (err) {
            console.error(err);
            }
        }
        }
    }
    run();
});
app.get("/getPhysicalWrites/:start/:end", function(req, res, next){
    const params = req.params;
    const start  = moment(parseFloat(params.start)).format('YYYY-MM-DD HH:mm');
    const end    = moment(parseFloat(params.end)).format('YYYY-MM-DD HH:mm');

    const sTime  = new Date().getTime();
    async function run() {
        let connection;

        try {
    
        let sql, binds, options, result;
    
        connection = await oracledb.getConnection(  {
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString,
            privilege     : oracledb.SYSDBA
        });

        sql = `select snap_time,diff_value,to_char(round(diff_value/diff_sec,2),'9999999999999990.99') value_per_sec
        from
        (
        select to_char(snap.snap_time, 'YYYY/MM/DD HH24:MI') snap_time
        , sys.value - (lag( sys.value ) over ( partition by snap.dbid,snap.instance_number,snap.startup_time order by snap.snap_id )) diff_value
        ,(snap.snap_time - (lag( snap.snap_time ) over ( partition by snap.dbid,snap.instance_number,snap.startup_time order by snap.snap_id ))) * 24 * 60 * 60 diff_sec
        from stats$sysstat sys,stats$snapshot snap
        where sys.name            = 'physical writes'
        and sys.snap_id= snap.snap_id
        and sys.dbid   = snap.dbid
        and sys.instance_number = snap.instance_number
        and snap.snap_time between to_date('${start}','YYYY/MM/DD HH24:MI') and to_date('${end}','YYYY/MM/DD HH24:MI')
        )
        order by snap_time
        `;
//        console.log('sql', sql);
        binds = {};
    
        // For a complete list of options see the documentation.
        options = {
            outFormat: oracledb.OBJECT,   // query result format
            extendedMetaData: true,   // get extra metadata
            fetchArraySize: 100       // internal buffer allocation size for tuning
        };
    
        result = await connection.execute(sql, binds, options);
    
//        console.log("Column metadata: ", result.metaData);
//        console.log("Query results: ");
//        console.log(result.rows);
        const rTime  = new Date().getTime() - sTime;
        result.executionTime = rTime;
        res.send(result);

        } catch (err) {
        console.error(err);
        } finally {
        if (connection) {
            try {
            await connection.close();
            } catch (err) {
            console.error(err);
            }
        }
        }
    }
    run();
});

app.get("/getPhysicalReadsDirect/:start/:end", function(req, res, next){
    const params = req.params;
    const start  = moment(parseFloat(params.start)).format('YYYY-MM-DD HH:mm');
    const end    = moment(parseFloat(params.end)).format('YYYY-MM-DD HH:mm');

    const sTime  = new Date().getTime();
    async function run() {
        let connection;

        try {
    
        let sql, binds, options, result;
    
        connection = await oracledb.getConnection(  {
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString,
            privilege     : oracledb.SYSDBA
        });

        sql = `select snap_time,diff_value,to_char(round(diff_value/diff_sec,2),'9999999999999990.99') value_per_sec
        from
        (
        select to_char(snap.snap_time, 'YYYY/MM/DD HH24:MI') snap_time
        , sys.value - (lag( sys.value ) over ( partition by snap.dbid,snap.instance_number,snap.startup_time order by snap.snap_id )) diff_value
        ,(snap.snap_time - (lag( snap.snap_time ) over ( partition by snap.dbid,snap.instance_number,snap.startup_time order by snap.snap_id ))) * 24 * 60 * 60 diff_sec
        from stats$sysstat sys,stats$snapshot snap
        where sys.name            = 'physical writes'
        and sys.snap_id= snap.snap_id
        and sys.dbid   = snap.dbid
        and sys.instance_number = snap.instance_number
        and snap.snap_time between to_date('${start}','YYYY/MM/DD HH24:MI') and to_date('${end}','YYYY/MM/DD HH24:MI')
        )
        order by snap_time
        `;
//        console.log('sql', sql);
        binds = {};
    
        // For a complete list of options see the documentation.
        options = {
            outFormat: oracledb.OBJECT,   // query result format
            extendedMetaData: true,   // get extra metadata
            fetchArraySize: 100       // internal buffer allocation size for tuning
        };
    
        result = await connection.execute(sql, binds, options);
    
//        console.log("Column metadata: ", result.metaData);
//        console.log("Query results: ");
//        console.log(result.rows);
        const rTime  = new Date().getTime() - sTime;
        result.executionTime = rTime;
        res.send(result);

        } catch (err) {
        console.error(err);
        } finally {
        if (connection) {
            try {
            await connection.close();
            } catch (err) {
            console.error(err);
            }
        }
        }
    }
    run();
});
app.get("/getPhysicalWritesDirect/:start/:end", function(req, res, next){
    const params = req.params;
    const start  = moment(parseFloat(params.start)).format('YYYY-MM-DD HH:mm');
    const end    = moment(parseFloat(params.end)).format('YYYY-MM-DD HH:mm');

    const sTime  = new Date().getTime();
    async function run() {
        let connection;

        try {
    
        let sql, binds, options, result;
    
        connection = await oracledb.getConnection(  {
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString,
            privilege     : oracledb.SYSDBA
        });

        sql = `select snap_time,diff_value,to_char(round(diff_value/diff_sec,2),'9999999999999990.99') value_per_sec
        from
        (
        select to_char(snap.snap_time, 'YYYY/MM/DD HH24:MI') snap_time
        , sys.value - (lag( sys.value ) over ( partition by snap.dbid,snap.instance_number,snap.startup_time order by snap.snap_id )) diff_value
        ,(snap.snap_time - (lag( snap.snap_time ) over ( partition by snap.dbid,snap.instance_number,snap.startup_time order by snap.snap_id ))) * 24 * 60 * 60 diff_sec
        from stats$sysstat sys,stats$snapshot snap
        where sys.name            = 'physical writes direct'
        and sys.snap_id= snap.snap_id
        and sys.dbid   = snap.dbid
        and sys.instance_number = snap.instance_number
        and snap.snap_time between to_date('${start}','YYYY/MM/DD HH24:MI') and to_date('${end}','YYYY/MM/DD HH24:MI')
        )
        order by snap_time
        `;
//        console.log('sql', sql);
        binds = {};
    
        // For a complete list of options see the documentation.
        options = {
            outFormat: oracledb.OBJECT,   // query result format
            extendedMetaData: true,   // get extra metadata
            fetchArraySize: 100       // internal buffer allocation size for tuning
        };
    
        result = await connection.execute(sql, binds, options);
    
//        console.log("Column metadata: ", result.metaData);
//        console.log("Query results: ");
//        console.log(result.rows);
        const rTime  = new Date().getTime() - sTime;
        result.executionTime = rTime;
        res.send(result);

        } catch (err) {
        console.error(err);
        } finally {
        if (connection) {
            try {
            await connection.close();
            } catch (err) {
            console.error(err);
            }
        }
        }
    }
    run();
});
app.get("/getRedoSize/:start/:end", function(req, res, next){
    const params = req.params;
    const start  = moment(parseFloat(params.start)).format('YYYY-MM-DD HH:mm');
    const end    = moment(parseFloat(params.end)).format('YYYY-MM-DD HH:mm');

    const sTime  = new Date().getTime();
    async function run() {
        let connection;

        try {
    
        let sql, binds, options, result;
    
        connection = await oracledb.getConnection(  {
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString,
            privilege     : oracledb.SYSDBA
        });

        sql = `select snap_time,diff_value,to_char(round(diff_value/1024/1024/diff_sec,2),'9999999999999990.99') value_per_sec
        from
        (
        select to_char(snap.snap_time, 'YYYY/MM/DD HH24:MI') snap_time
        , sys.value - (lag( sys.value ) over ( partition by snap.dbid,snap.instance_number,snap.startup_time order by snap.snap_id )) diff_value
        ,(snap.snap_time - (lag( snap.snap_time ) over ( partition by snap.dbid,snap.instance_number,snap.startup_time order by snap.snap_id ))) * 24 * 60 * 60 diff_sec
        from stats$sysstat sys,stats$snapshot snap
        where sys.name            = 'redo size'
        and sys.snap_id= snap.snap_id
        and sys.dbid   = snap.dbid
        and sys.instance_number = snap.instance_number
        and snap.snap_time between to_date('${start}','YYYY/MM/DD HH24:MI') and to_date('${end}','YYYY/MM/DD HH24:MI')
        )
        order by snap_time
        `;
//        console.log('sql', sql);
        binds = {};
    
        // For a complete list of options see the documentation.
        options = {
            outFormat: oracledb.OBJECT,   // query result format
            extendedMetaData: true,   // get extra metadata
            fetchArraySize: 100       // internal buffer allocation size for tuning
        };
    
        result = await connection.execute(sql, binds, options);
    
//        console.log("Column metadata: ", result.metaData);
//        console.log("Query results: ");
//        console.log(result.rows);
        const rTime  = new Date().getTime() - sTime;
        result.executionTime = rTime;
        res.send(result);

        } catch (err) {
        console.error(err);
        } finally {
        if (connection) {
            try {
            await connection.close();
            } catch (err) {
            console.error(err);
            }
        }
        }
    }
    run();
});
app.get("/getBufferHit/:start/:end", function(req, res, next){
    const params = req.params;
    const start  = moment(parseFloat(params.start)).format('YYYY-MM-DD HH:mm');
    const end    = moment(parseFloat(params.end)).format('YYYY-MM-DD HH:mm');

    const sTime  = new Date().getTime();
    async function run() {
        let connection;

        try {
    
        let sql, binds, options, result;
    
        connection = await oracledb.getConnection(  {
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString,
            privilege     : oracledb.SYSDBA
        });

        sql = `select snap_time,TO_CHAR(1-(physical_reads_cache/(consistent_gets_from_cache + db_block_gets_from_cache + recovery_block_gets_from_cache)),'0.000') buffer_hit from
        (
        select to_char(snap.snap_time, 'YYYY/MM/DD HH24:MI') snap_time ,sys.name
        , sys.value - (lag( sys.value ) over ( partition by snap.dbid,snap.instance_number,snap.startup_time,sys.name order by snap.snap_id )) diff_value
        from stats$sysstat sys,stats$snapshot snap
        where sys.snap_id= snap.snap_id
        and sys.dbid   = snap.dbid
        and sys.instance_number = snap.instance_number
        and sys.name in ('physical reads cache','consistent gets from cache','db block gets from cache', 'recovery block gets from cache')
        and snap.snap_time between to_date('${start}','YYYY/MM/DD HH24:MI') and to_date('${end}','YYYY/MM/DD HH24:MI')
        )
        pivot (max(diff_value) for name in ('physical reads cache'             physical_reads_cache
                                            ,'consistent gets from cache'      consistent_gets_from_cache
                                            ,'db block gets from cache'        db_block_gets_from_cache
                                            , 'recovery block gets from cache' recovery_block_gets_from_cache
                                           )
        )
        order by snap_time
        `;
//        console.log('sql', sql);
        binds = {};
    
        // For a complete list of options see the documentation.
        options = {
            outFormat: oracledb.OBJECT,   // query result format
            extendedMetaData: true,   // get extra metadata
            fetchArraySize: 100       // internal buffer allocation size for tuning
        };
    
        result = await connection.execute(sql, binds, options);
    
//        console.log("Column metadata: ", result.metaData);
//        console.log("Query results: ");
//        console.log(result.rows);
        const rTime  = new Date().getTime() - sTime;
        result.executionTime = rTime;
        res.send(result);

        } catch (err) {
        console.error(err);
        } finally {
        if (connection) {
            try {
            await connection.close();
            } catch (err) {
            console.error(err);
            }
        }
        }
    }
    run();
});

app.get("/getLibraryHit/:start/:end", function(req, res, next){
    const params = req.params;
    const start  = moment(parseFloat(params.start)).format('YYYY-MM-DD HH:mm');
    const end    = moment(parseFloat(params.end)).format('YYYY-MM-DD HH:mm');

    const sTime  = new Date().getTime();
    async function run() {
        let connection;

        try {
    
        let sql, binds, options, result;
    
        connection = await oracledb.getConnection(  {
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString,
            privilege     : oracledb.SYSDBA
        });

        sql = `select snap_time,to_char(diff_pinhits/diff_pins,'0.999') pinhitrate,to_char(diff_gethits/diff_gets,'0.999') gethitrate
        from
        (
        select to_char(snap.snap_time, 'YYYY/MM/DD HH24:MI') snap_time
        , lc.pinssum - (lag( lc.pinssum ) over ( partition by snap.dbid,snap.instance_number,snap.startup_time order by snap.snap_id )) diff_pins
        , lc.pnhitssum - (lag( lc.pnhitssum ) over ( partition by snap.dbid,snap.instance_number,snap.startup_time order by snap.snap_id )) diff_pinhits
        , lc.getsum - (lag( lc.getsum ) over ( partition by snap.dbid,snap.instance_number,snap.startup_time order by snap.snap_id )) diff_gets
        , lc.gethitssum - (lag( lc.gethitssum ) over ( partition by snap.dbid,snap.instance_number,snap.startup_time order by snap.snap_id )) diff_gethits
        from
        (select snap_id,dbid,instance_number,sum(pins) pinssum,sum(pinhits) pnhitssum,sum(gets) getsum,sum(gethits) gethitssum from stats$librarycache group by snap_id,dbid,instance_number)
        lc,stats$snapshot snap
        where lc.snap_id= snap.snap_id
        and lc.dbid   = snap.dbid
        and lc.instance_number = snap.instance_number
        and snap.snap_time between to_date('${start}','YYYY/MM/DD HH24:MI') and to_date('${end}','YYYY/MM/DD HH24:MI')
        )
        order by snap_time
        `;
//        console.log('sql', sql);
        binds = {};
    
        // For a complete list of options see the documentation.
        options = {
            outFormat: oracledb.OBJECT,   // query result format
            extendedMetaData: true,   // get extra metadata
            fetchArraySize: 100       // internal buffer allocation size for tuning
        };
    
        result = await connection.execute(sql, binds, options);
    
//        console.log("Column metadata: ", result.metaData);
//        console.log("Query results: ");
//        console.log(result.rows);
        const rTime  = new Date().getTime() - sTime;
        result.executionTime = rTime;
        res.send(result);

        } catch (err) {
        console.error(err);
        } finally {
        if (connection) {
            try {
            await connection.close();
            } catch (err) {
            console.error(err);
            }
        }
        }
    }
    run();
});

app.get("/getCpuUtilization/:start/:end", function(req, res, next){
    const params = req.params;
    const start  = moment(parseFloat(params.start)).format('YYYY-MM-DD HH:mm');
    const end    = moment(parseFloat(params.end)).format('YYYY-MM-DD HH:mm');

    const sTime  = new Date().getTime();
    async function run() {
        let connection;

        try {
    
        let sql, binds, options, result;
    
        connection = await oracledb.getConnection(  {
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString,
            privilege     : oracledb.SYSDBA
        });

        sql = `select snap_time
        ,to_char(CPU_used_by_this_session,'9999999999999990.99') execution_time
        ,to_char(parse_time_cpu,'9999999999999990.99') parse_time
        ,to_char(case when (parse_time_elapsed - parse_time_cpu) < 0 then 0 else (parse_time_elapsed - parse_time_cpu) end,'9999999999999990.99') reload
  from
  (
  select to_char(snap.snap_time, 'YYYY/MM/DD HH24:MI') snap_time ,sys.name
  , ROUND((sys.value - (lag( sys.value ) over ( partition by snap.dbid,snap.instance_number,snap.startup_time,sys.name order by snap.snap_id )))/100
  /((snap.snap_time - (lag( snap.snap_time ) over ( partition by snap.dbid,snap.instance_number,snap.startup_time,sys.name order by snap.snap_id ))) * 24 * 60 * 60) *60,2) diff_value
  from stats$sysstat sys,stats$snapshot snap
  where sys.snap_id= snap.snap_id
  and sys.dbid   = snap.dbid
  and sys.instance_number = snap.instance_number
  and sys.name in ('parse time elapsed','parse time cpu','CPU used by this session')
  and snap.snap_time between to_date('${start}','YYYY/MM/DD HH24:MI') and to_date('${end}','YYYY/MM/DD HH24:MI')
  )
  pivot (max(diff_value) for name in ('parse time elapsed'             parse_time_elapsed
                                      ,'parse time cpu'      parse_time_cpu
                                      ,'CPU used by this session'  CPU_used_by_this_session
                                     )
  )
  order by snap_time
        `;
//        console.log('sql', sql);
        binds = {};
    
        // For a complete list of options see the documentation.
        options = {
            outFormat: oracledb.OBJECT,   // query result format
            extendedMetaData: true,   // get extra metadata
            fetchArraySize: 100       // internal buffer allocation size for tuning
        };
    
        result = await connection.execute(sql, binds, options);
    
//        console.log("Column metadata: ", result.metaData);
//        console.log("Query results: ");
//        console.log(result.rows);
        const rTime  = new Date().getTime() - sTime;
        result.executionTime = rTime;
        res.send(result);

        } catch (err) {
        console.error(err);
        } finally {
        if (connection) {
            try {
            await connection.close();
            } catch (err) {
            console.error(err);
            }
        }
        }
    }
    run();
});

app.get("/getLatchHit/:start/:end", function(req, res, next){
    const params = req.params;
    const start  = moment(parseFloat(params.start)).format('YYYY-MM-DD HH:mm');
    const end    = moment(parseFloat(params.end)).format('YYYY-MM-DD HH:mm');

    const sTime  = new Date().getTime();
    async function run() {
        let connection;

        try {
    
        let sql, binds, options, result;
    
        connection = await oracledb.getConnection(  {
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString,
            privilege     : oracledb.SYSDBA
        });

        sql = `select snap_time,to_char(1 - (diff_misses/diff_gets),'0.999') latch_hitrate
        from
        (
        select to_char(snap.snap_time, 'YYYY/MM/DD HH24:MI') snap_time
        , latch.getssum - (lag( latch.getssum ) over ( partition by snap.dbid,snap.instance_number,snap.startup_time order by snap.snap_id )) diff_gets
        , latch.missessum - (lag( latch.missessum ) over ( partition by snap.dbid,snap.instance_number,snap.startup_time order by snap.snap_id )) diff_misses
        from
        (select snap_id,dbid,instance_number,sum(gets) getssum,sum(misses) missessum from stats$latch group by snap_id,dbid,instance_number) latch,stats$snapshot snap
        where latch.snap_id= snap.snap_id
        and latch.dbid   = snap.dbid
        and latch.instance_number = snap.instance_number
        and snap.snap_time between to_date('${start}','YYYY/MM/DD HH24:MI') and to_date('${end}','YYYY/MM/DD HH24:MI')
        )
        order by snap_time
        `;
        console.log('sql', sql);
        binds = {};
    
        // For a complete list of options see the documentation.
        options = {
            outFormat: oracledb.OBJECT,   // query result format
            extendedMetaData: true,   // get extra metadata
            fetchArraySize: 100       // internal buffer allocation size for tuning
        };
    
        result = await connection.execute(sql, binds, options);
    
//        console.log("Column metadata: ", result.metaData);
//        console.log("Query results: ");
//        console.log(result.rows);
        const rTime  = new Date().getTime() - sTime;
        result.executionTime = rTime;
        res.send(result);

        } catch (err) {
        console.error(err);
        } finally {
        if (connection) {
            try {
            await connection.close();
            } catch (err) {
            console.error(err);
            }
        }
        }
    }
    run();
});


app.get("/getMemoryAllocation/:start/:end", function(req, res, next){
    const params = req.params;
    const start  = moment(parseFloat(params.start)).format('YYYY-MM-DD HH:mm');
    const end    = moment(parseFloat(params.end)).format('YYYY-MM-DD HH:mm');

    const sTime  = new Date().getTime();
    async function run() {
        let connection;

        try {
    
        let sql, binds, options, result;
    
        connection = await oracledb.getConnection(  {
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString,
            privilege     : oracledb.SYSDBA
        });

        sql = `select to_char(snap.snap_time, 'YYYY/MM/DD HH24:MI') snap_time
        ,mdc.component
        ,mdc.current_size/1024/1024 MB
  from
  stats$memory_dynamic_comps mdc,stats$snapshot snap
  where mdc.snap_id= snap.snap_id
  and mdc.dbid   = snap.dbid
  and mdc.instance_number = snap.instance_number
  and snap.snap_time between to_date('${start}','YYYY/MM/DD HH24:MI') and to_date('${end}','YYYY/MM/DD HH24:MI')
  and mdc.current_size > 0
  and mdc.component != 'SGA Target'
  order by snap_time
        `;
        console.log('sql', sql);
        binds = {};
    
        // For a complete list of options see the documentation.
        options = {
            outFormat: oracledb.OBJECT,   // query result format
            extendedMetaData: true,   // get extra metadata
            fetchArraySize: 100       // internal buffer allocation size for tuning
        };
    
        result = await connection.execute(sql, binds, options);
    
//        console.log("Column metadata: ", result.metaData);
//        console.log("Query results: ");
//        console.log(result.rows);
        const rTime  = new Date().getTime() - sTime;
        result.executionTime = rTime;
        res.send(result);

        } catch (err) {
        console.error(err);
        } finally {
        if (connection) {
            try {
            await connection.close();
            } catch (err) {
            console.error(err);
            }
        }
        }
    }
    run();
});