//---------------------------------------------------------
//Neuen Test erstellen, hinzu.html -> testerstellen.html
//NewTest() -> showSchuelerNewTest() -> SaveNewTest()
//---------------------------------------------------------
let neuerTest = {
    bezeichnung: "",
    fach:   " ",
    klasse: " ",
    art:    " ",
    date:   " "
};

function NewTest(){ 
    console.log("NewTest()")
    neuerTest.bezeichnung = document.getElementById("Bezeichnung").value
    neuerTest.klasse = document.getElementById("Klassenauswahl").value
    neuerTest.fach   = document.getElementById("Fachauswahl").value
    neuerTest.art    = document.getElementById("Artauswahl").value
    neuerTest.date   = document.getElementById("Datumsauswahl").value

    console.log("Bezeichnung:"+neuerTest.bezeichnung+", Klasse: " + neuerTest.klasse + ", Fach: " + neuerTest.fach + ", Art: "+neuerTest.art + ",DAtum: " + neuerTest.date)

    //neuen Test anlegen - Schüler anfordern vom Server
    let httpReq = new XMLHttpRequest();
    let text    = "/api/getalleSchueler/" + JSON.stringify(neuerTest);
    console.log(text);
    httpReq.open("GET",text); 
    httpReq.onload = function(){
        console.log("onload if")
        if(this.status==200){
            console.log(this.responseText)
            console.log("Yesssss its working!")
            SchuelerNewTest=JOSN.parse(this.responseText)
            showSchuelerNewTest(SchuelerNewTest)
        }
        else{
            console.log("Schade :( --- Response code:"+this.status)
        }
    };
    httpReq.onerror = function(){
        console.log("Error!")
    };
    httpReq.send()

}
var anzahl = 0
//-------Tabelle ausgeben mit Schülern und Eingabefeldern für die Note----------
function showSchuelerNewTest(SchuelerNewTest){
    console.log("showSchülerNewTest")
    let str =' <table class="table table-dark"><thead>'
    str += '<tr><th scope="col">Vorname</th><th scope="col">Nachname</th><th scope="col">Note</th></tr></thead><tbody>'
    for(let i=0; i<SchuelerNewTest.length; i++){
        str += '<tr><td>'+ SchuelerNewTest[i].vorname +'</td><td>'+ SchuelerNewTest[i].nachname +'</td>'
        str += '<td><select class="custom-select" id=Grade#'+(i+1)+'"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="5">Fehlend</option></select></td></tr>'
        //Über for-Schleife Grade#i+1 können die Noten wieder ausgelesen werden
        anzahl=anzahl+1
    }
    str += '</tbody></table>'

    document.getElementById('EingabeNewTest').innerHTML = str;
}

//--------------------------------------------
function SaveNewTest(){
    console.log("SaveNewTest()")

    let httpReq = new XMLHttpRequest();
    httpReq.open("POST","/api/saveTest/")
    httpReq.onload(function(){
        var testergebnis = '['
        if(this.status==200){
            console.log("Gespeichert")
            for(let j=0;j<anzahl;j++){
                var note = document.querySelector("Grade#"+(i+1)).value
                testergebnis += '{Sid:'+(i+1)+'Note:'+note+'}'
            }
        }
        else{
            console.log("Nächstes mal vielleicht :( --- Response code:"+this.status)
        }
    })
}

//-----------------------------------------------------------------------
//Für Datums-Auswahl
$(document).ready(function(){
    var date_input=$('input[name="date"]'); 
    var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
    var options={
        format: 'dd/mm/yyyy',
        container: container, //?
        todayHighlight: true,
        autoclose: true,
    };
    date_input.datepicker(options);  
})

//---------------------------------------------------------
//Übersicht aller Tests, tests.html -> testsAusgabe.html ->testansicht.html/testaendern.html
//Tests einer Klasse eines Faches
//Testanzeige() -> showTest() -> doShow() / doChange() / deleteTest()
//---------------------------------------------------------
let Test = {
    fach:   " ",
    klasse: " "
};
function Testanzeige(){
    console.log("Testanzeige()")
    Test.klasse = document.getElementById("Klassenauswahl").value
    Test.fach   = document.getElementById("Fachauswahl").value
 
    console.log("Klasse: " + Test.klasse + ", Fach: ")

    //für Test-Anzeige Schüler anfordern vom Server
    let httpReq = new XMLHttpRequest();
    let text    = "/api/getKlasseFachTests/" + JSON.stringify(Test);
    console.log(text);
    httpReq.open("GET",text); 
    httpReq.onload = function(){
        console.log("onload if")
        if(this.status==200){
            console.log(this.responseText)
            console.log("Funzt! :)")
            tests=JOSN.parse(this.responseText)
            showTest(tests)
        }
        else{
            console.log("Nächstes mal vielleicht :( --- Response code:"+this.status)
        }
    };
    httpReq.onerror = function(){
        console.log("Error!")
    };
    httpReq.send()

}

//-------Tests ausgeben-------
function showTest(tests){
    console.log("showSchüler")
    let str =' <table class="table"><thead class="thead-dark"><tr><th scope="col">Beschreibung</th><th scope="col">Ansicht</th><th scope="col">Ändern</th><th scope="col">Löschen</th></tr></thead><tbody>'
    for(let i=0; i<tests.length; i++){
        str += '<tr><td>'+ tests[i].thema +'</td><td>'+ tests[i].durchschnitt +'</td>'
        str += '<td><input class="btn btn-primary"><button href="testansicht.html" onClick="doShow('+tests[i].id+')">Ansicht</td>'
        str += '<td><input class="btn btn-primary"><button href="testaendern.html" onClick="doChange('+tests[i].id+')">Ändern</td>'
        str += '<td><input class="btn btn-primary"><button onClick="deleteTest('+tests[i].id+')">Löschen</td>'    
    }
    str += '</tbody></table>'

    document.getElementById('AusgabeSchueler').innerHTML = str;
}

//------------------doShow---------------------------------------------
function doShow(tid){ //Zeigt ausgewählten Test genauer 
    // testansicht.html
    console.log("doShow")
    let httpReq = new XMLHttpRequest();
    let text    = "/api/geTalleSchueler/" + JSON.stringify(tid);
    console.log(text);
    httpReq.open("GET",text); 
    httpReq.onload = function(){
        console.log("onload if")
        if(this.status==200){
            console.log(this.responseText)
            console.log("Funzt! :)")
            list=JOSN.parse(this.responseText)
            showSchuelerList(list)
        }
        else{
            console.log("Nächstes mal vielleicht :( --- Response code:"+this.status)
        }
    };
    httpReq.onerror = function(){
        console.log("Error!")
    };
    httpReq.send()

}

function showSchuelerList(list){
    console.log("showSchülerNewTest")
    let str =' <table class="table table-dark"><thead>'
    str += '<tr><th scope="col">Vorname</th><th scope="col">Nachname</th><th scope="col">Note</th></tr></thead><tbody>'
    
    for(let i=0; i<list.length; i++){
        str += '<tr><td>'+ list[i].vorname +'</td><td>'+ list[i].nachname +'</td><td>'+ list[i].grade +'</td>'
    }
    str += '</tbody></table>'

    document.getElementById('TestUebersichtAnsicht').innerHTML = str;
}

//------------------doChange---------------------------------------------
function doChange(tid){ //Änderungsmöglichkeiten der Bezeichnung & Note kann geändert werden (wieder Liste von Schülern)
    //testaendern.html
    console.log("doChange")
    let httpReq = new XMLHttpRequest();
    let text    = "/api/geTalleSchueler/" + JSON.stringify(tid);
    console.log(text);
    httpReq.open("GET",text); 
    httpReq.onload = function(){
        console.log("onload if")
        if(this.status==200){
            console.log(this.responseText)
            console.log("Funzt! :)")
            liste=JOSN.parse(this.responseText)
            showSchuelerListchange(liste)
        }
        else{
            console.log("Nächstes mal vielleicht :( --- Response code:"+this.status)
        }
    };
    httpReq.onerror = function(){
        console.log("Error!")
    };
    httpReq.send()

}

function showSchuelerListchange(liste){
    console.log("showSchülerNewTest")
    let str =' <table class="table table-dark"><thead>'
    str += '<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">Bezeichnung</span></div><textarea class="form-control" id="Bezeichnung" aria-label="With textarea"></textarea></div>'
    str += '<tr><th scope="col">Vorname</th><th scope="col">Nachname</th><th scope="col">Note</th></tr></thead><tbody>'
    
    for(let i=0; i<liste.length; i++){
        str += '<tr><td>'+ liste[i].vorname +'</td><td>'+ liste[i].nachname +'</td><td>'+ liste[i].grade +'</td>'
        str += '<td><select class="custom-select" id="Grade"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="5">Fehlend</option></select></td></tr>'
    }
    str += '</tbody></table>'

    document.getElementById('TestUebersichtAendern').innerHTML = str;
}

//------------------deleteTest---------------------------------------------
function deleteTest(tid){ 
    console.log("deleteTest")

    let httpReq = new XMLHttpRequest();
    let text    = "/api/deleteTest/" + JSON.stringify(tid);
    httpReq.open("POST",text)+
    httpReq.onload(function(){
        if(this.status==200){
            console.log("Gelöscht!")
        }
        else{
            console.log("Nächstes mal vielleicht :( --- Response code:"+this.status) 
        }
    })
}

//---------------------------------------------------------
//Schüler Notenstand, notenstaende.html -> schuelerAusgabe.html
//
//---------------------------------------------------------
let SchuelerGrade = {
    fach:   " ",
    klasse: " "
};
function SchuelerNotenstaende(){
    console.log("SchuelerNotenstaende")
    
    SchuelerGrade.klasse = document.getElementById("Klassenauswahl").value
    SchuelerGrade.fach   = document.getElementById("Fachauswahl").value
 
    console.log("Klasse: " + SchuelerGrade.klasse + ", Fach: " + SchuelerGrade.fach)
    
    let httpReq = new XMLHttpRequest();
    let text    = "/api/geTSchuelerDurchschnNote/" + JSON.stringify(SchuelerGrade);
    console.log(text);
    httpReq.open("GET",text); 
    httpReq.onload = function(){
        console.log("onload if")
        if(this.status==200){
            console.log(this.responseText)
            console.log("Funzt! :)")
            grade=JOSN.parse(this.responseText)
            showSchuelerListchange(grade)
        }
        else{
            console.log("Nächstes mal vielleicht :( --- Response code:"+this.status)
        }
    };
    httpReq.onerror = function(){
        console.log("Error!")
    };
    httpReq.send()
}

function showSchuelerList(grade){
    console.log("showSchülerNewTest")
    let str =' <table class="table table-dark"><thead>'
    str += '<tr><th scope="col">Vorname</th><th scope="col">Nachname</th><th scope="col">Note</th></tr></thead><tbody>'
    
    for(let i=0; i<grade.length; i++){
        str += '<tr><td>'+ grade[i].vorname +'</td><td>'+ grade[i].nachname +'</td><td>'+ grade[i].Dgrade +'</td>'
    }
    str += '</tbody></table>'

    document.getElementById('SchuelerNotenAusgabe').innerHTML = str;
}
//---------------------------------------------------------
//Home, index.html
//
//---------------------------------------------------------
function LastTests(){
    console.log("LastTests")
    
    let httpReq = new XMLHttpRequest();
    let text    = "/api/getLastTests/";
    console.log(text);
    httpReq.open("GET",text); 
    httpReq.onload = function(){
        console.log("onload if")
        if(this.status==200){
            console.log(this.responseText)
            console.log("Funzt! :)")
            last=JOSN.parse(this.responseText)
            showHome(last)
        }
        else{
            console.log("Nächstes mal vielleicht :( --- Response code:"+this.status)
        }
    };
    httpReq.onerror = function(){
        console.log("Error!")
    };
    httpReq.send()
}

function showSchuelerList(last){
    console.log("showSchülerNewTest")
    let str ='<div class="jumbotron text-center"<h1>Neueste Einträge:</h1></div><div class="container"><div class="row">'
    str += ' <div class="col-sm-4"><h3>'+last[0].bezeichnung+'</h3><p>'+last[0].Dgrade+'</p></div>'
    str += ' <div class="col-sm-4"><h3>'+last[1].bezeichnung+'</h3><p>'+last[1].Dgrade+'</p></div>'
    str += ' <div class="col-sm-4"><h3>'+last[2].bezeichnung+'</h3><p>'+last[2].Dgrade+'</p></div>'
    str += '</div></div>'
    document.getElementById('SchuelerNotenAusgabe').innerHTML = str;
}
/*---------------------------------------------------------
//Notes:
Schüler Notenstände, je klasse mit durchschnittsnote
Titelseite 3 letzte testeinträge mit durchschnittsnote
---------------------------------------------------------*/