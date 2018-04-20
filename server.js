const express=require('express')
const bodyParser=require('body-parser')

const app=express()

app.use(express.static('public'))
app.use(bodyParser.json())


//-------Verbinden mit Datenbank-------
var mySQL = require('mysql');
var connection = mySQL.createConnection({
    host: "jdbc:mysql://localhost:3306/Datastorage",
    user: "root",
    password : "root"
    
});

console.log('before connect mysql')
connection.connect(function(err){
    if(err){
        console.log("SQL Connection error:" + err)
        return
    }
})
console.log('after connect mysql')


// curl localhost:3000/api/hello
app.listen(3000,function(){
    console.log('Server running & listening - Port: 3000')
})

app.get('/api/getalleSchueler/:kid', function (req, res) { //Alle Schüler einer Klasse
    let query = 'select st.sid, Schueler.vn ,Schueler.nn, kl.kid, kl.Name from Schueler as st join Klasse as kl on kl.kid = st.kid where kl.kid = ' + req.params.kid

    //console.log("kid: " + req.params.kid)
    connection.query(query, req.params.kid, function (error, results, fields) {
        if (error) {
            res.status(404).send()
        } else {
            console.log(results)
            let re = JSON.stringify(results)
            let sendjson = JSON.parse(re)

            console.log(sendjson)

            res.send(sendjson)
        }
    })
});

app.get('/api/getKlasseFachTests/:kid/:fid', function (req, res) { //Alle Tests einer Klasse eines Faches
    let query = 'select te.tid, te.Name, date_format(te.datum,"%d-%m-%Y") as datum, fa.fid, fa.Name, kl.kid, kl.klasse ' +
        'from checks as te join Fach as fa join Klasse as kl ' +
        'on te.kid = kl.kid and te.fid = fa.fid ' +
        'where kl.kid = ? and fa.fid = ' + req.params.fid

    //console.log("kid: " + req.params.kid + "\nfid: "+ req.params.fid)
    connection.query(query, req.params.kid, function (error, results, fields) {
        if (error) {
            res.status(404).send()
        } else {
            console.log(results)
            let re = JSON.stringify(results)
            let sendjson = JSON.parse(re)
            console.log(sendjson)

            res.send(sendjson)
        }
    })
});

app.get('/api/get_results/:tid', function (req, res) {
    let query = 'select st.sid,st.vn,st.nn, kl.kid, kl.Name, re.Note, re.Anmerkung, te.tid, te.Name, date_format(te.datum,"%d-%m-%Y") as datum, fa.fid, fa.Name ' +
        'from Schueler as st join Testentry as re join Test as te join Klasse as kl join Fach as fa ' +
        'on re.sid = st.sid and re.tid = te.tid and st.kid = te.kid ' +
        'and kl.kid = st.kid and fa.fid = te.fid where te.tid = ' + req.params.tid

    console.log("tid: " + req.params.tid)
    connection.query(query, req.params.kid, function (error, results, fields) {
        if (error) {
            res.status(404).send()
        } else {
            console.log(results)
            let re = JSON.stringify(results)
            let sendjson = JSON.parse(re)
            console.log(sendjson)

            res.send(sendjson)
        }
    })
});


app.post('/api/saveTest', function (req, res) {

    // Für Test Post
    let kid = req.body[0].kid
    let typ = req.body[0].typ
    let bezeichnung = req.body[0].bezeichnung
    let dat = req.body[0].datum
    let fach = req.body[0].fach
    let fid

    // Für Ergebnisse Post
    let tid
    let sid = req.body.sid

    let query = "SELECT fid FROM Fach WHERE fach LIKE " + "'" + fach + "'"
    connection.query(query, fach, function (error, results, fields) {
        if (error) {
            res.status(404).send()
        } else {
            console.log(results)
            let re = JSON.stringify(results)
            let sendjson = JSON.parse(re)
            fid = sendjson[0].fid

            let query_1 = "insert into Test values (null," + kid + "," + fid + "," + "'" + typ + "'" + ",'" + bezeichnung + "','" + dat + "'" + ")"
            
            connection.query(query_1, function (err, results, fields) {
                if (err) {
                    console.log("post test Fehler: " + err)
                    res.status(404).send()
                } else {
                    console.log(results)
                    let re = JSON.stringify(results)
                    let sendjson = JSON.parse(re)
                    

                    let query_2 = "select tid from Test where kid like " + kid + " and fid like " + fid + " and typ like " + "'" + typ + "'" + " and Name like " + "'" + bezeichnung + "'" + " and datum like " + "'" + dat + "'"
 
                    connection.query(query2, function (error, results, fields) {
                        if (error) {
                            res.status(404).send()
                        } else {
                            console.log(results)
                            let re = JSON.stringify(results)
                            let sendjson = JSON.parse(re)
                            console.log(sendjson)

                            tid = sendjson[0].tid
                            console.log(tid)

                            var query_3 = "insert into Testentry values "
                            for (let i = 0; i < req.body.length; i++) {
                                bemerkung = (req.body[i].bemerkung == "null") ? "null" : ("'" + req.body[i].bemerkung + "'")
                                query_3 += "(" + req.body[i].sid + "," + tid + "," + req.body[i].note + ",'" + req.body[i].punkte + "'," + bemerkung + "),"
                            }

                            query3 = query3.substring(0, query3.length - 1);
                            query3 += ';'

                            console.log(query3)

                            connection.query(query3, function (error, results, fields) {
                                if (error) {
                                    console.log("postErgebnisse Fehler: " + err)
                                    res.status(404).send()
                                } else {
                                    console.log(results)
                                    let re = JSON.stringify(results)
                                    let sendjson = JSON.parse(re)
                                    console.log(sendjson)

                                }
                            })

                        }
                    })
                }
            })
        }
    })
});
