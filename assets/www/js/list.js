/**
 * Autor: Boris Hofer
 * Datei: list.js
 * Datum: 04.03.2013
 *
 * Logik hinter View 3 (editorView)
 */
 
// deklariere Variabeln
var nfcMessages;
var nfcList;
var backButton;
var listOutput;

/**
 * Funktion backToMainmenu
 * Wechselt in die Mainmenu-View
 */
function backToMainmenu() {
    // gehe zurueck zur ersten View
    window.location = "file:///android_asset/www/index.html";
}

/**
 * Funktion formatText
 * Entfernt unerwuenschte Zeichen aus einem Wichteltext
 * @params wichteltext String
 * @return cleanWichteltext String
 */
function formatText(wichteltext) {
    var cleanWichteltext = wichteltext;
    // tausche Platzhalter fuer Umlaute aus
    cleanWichteltext = cleanWichteltext.replace("Oe", "&Ouml;");
    cleanWichteltext = cleanWichteltext.replace("Ue", "&Uuml;");
    cleanWichteltext = cleanWichteltext.replace("Ae", "&Auml;");
    cleanWichteltext = cleanWichteltext.replace("oe", "&ouml;");
    cleanWichteltext = cleanWichteltext.replace("ue", "&uuml;");
    cleanWichteltext = cleanWichteltext.replace("ae", "&auml;");
    // Platzhaltersymbole fuer 3 Links werden umgetauscht
    cleanWichteltext = cleanWichteltext.replace("$", '"');
    cleanWichteltext = cleanWichteltext.replace("$", '"');
    cleanWichteltext = cleanWichteltext.replace("$", '"');
    cleanWichteltext = cleanWichteltext.replace("$", '"');
    cleanWichteltext = cleanWichteltext.replace("$", '"');
    cleanWichteltext = cleanWichteltext.replace("$", '"');
    cleanWichteltext = cleanWichteltext.replace("%", "'");
    cleanWichteltext = cleanWichteltext.replace("%", "'");
    cleanWichteltext = cleanWichteltext.replace("%", "'");
    cleanWichteltext = cleanWichteltext.replace("%", "'");
    cleanWichteltext = cleanWichteltext.replace("%", "'");
    cleanWichteltext = cleanWichteltext.replace("%", "'");
    
    // gebe sauberen Wichteltext zurueck
    return cleanWichteltext;
}

/**
 * Funktion linkClicked
 * Wird aufgerufen, wenn ein Benutzer auf 
 * einen Link klickt
 * @params link String
 */
function linkClicked(link) {
    // ersetzte =-Smybol durch :-Symbol
    link = link.replace("=", ":");
    // rufe Link auf
    navigator.app.loadUrl(link, { openExternal:false });
}

/**
 * Funktion tagFound
 * Liest Daten des Wichteltags aus und 
 * speichert sie in localStorage
 * @params nfcEvent NFC-Data-Object
 */
function tagFound(nfcEvent) {
    // lese NFC-Tag aus
    var nfcTag = nfcEvent.tag;
    // lese sich auf NFC-Tag befindende Daten aus
    var nfcDaten = nfcTag.ndefMessage[0];
    // wandle nfcDaten in String um
    var nfcDatenString =  nfc.bytesToString(nfcDaten.payload);
    // wandle nfcDaten in Objekt um
    var nfcDatenObject = JSON.parse(nfcDatenString);
    
    // wenn es sich bei den ausgelesenen Daten um 
    // Wichtelnachrichten handelt
    if (nfcDatenObject.wichtelnachrichten) {
    
        // initialisiere Array mit allen sich auf dem
        // Wichteltag befindenden Textnachrichten
        var textMessages = nfcDatenObject.wichtelnachrichten;
        
        // zwischenspeichere ausgelesene Daten
        localStorage.setItem("wichtelMessages", textMessages);
        // wechsle Zwischenspeicher-Status
        localStorage.setItem("displayList", "yes");
        
        // informiere Benutzer über erfolgreiche Datentransaktion
        navigator.notification.vibrate(500);
        
        // aktualisiere Fenster
        window.location = "file:///android_asset/www/listView.html";
    } else {
        // ausgelsener nfcTag ist kein Wichteltag
        // reagiere nicht und warte auf kompatiblen NFC-Tag
    }
}

/**
 * Funktion readMessages
 * Sucht nach NFC-Tag und ruft anschliessend 
 * tagFound Funktion auf.
 */
function readMessages() {
    // suche nach NFC-Tag
    nfc.addNdefListener(tagFound, function () {
        // weise User auf den Scan Vorgang hin
        alert("Bitte berühren Sie den WichtelTag, welchen Sie auslesen wollen.");
    }, function () {
        alert("Leider ist ein Fehler aufgetreten, bitte lesen Sie sorgfältig die \
Benutzeranleitung");
        window.location = "file:///android_asset/www/index.html";
    });
}

/**
 * Funktion showWichteltexts
 * gibt Wichteltexte als Liste aus
 */
function showWichteltexts() {
    // aendere Datenabfolge
    nfcList.reverse();
    // lese Wichteltexte einzeln aus
    for (var i in nfcList) {
        // fuege formatierter Eintrag listOutput hinzu
        listOutput.innerHTML += '<p>' + formatText(nfcList[i]) + '</p><hr>';
    }
}

/**
 * Funktion ready
 * Initialisiert alle Variabeln mit Menu-Buttons, 
 * sowie einem Div für die Benutzer-Anleitung.
 */
function ready() {
    // initialisiere Menubuttons
  	backButton    = document.getElementById('backButton');
  	
  	// initialisiere Ausgabe-Div
  	listOutput    = document.getElementById('listOutput');
  	
  	// starte EventListeners für backButton
  	backButton.addEventListener('click', backToMainmenu , false); 
  	
  	// prüfe localStorage auf "displayList" (Zwischenspeicher-Status)
  	var status = localStorage.getItem("displayList");
  	if ("no" === status) {
        // suche nach NFC-Tag
        readMessages();
  	} else {
  	    // initialisiere zwischengespeicherte Wichteltexte
  	    nfcMessages = localStorage.getItem("wichtelMessages");
  	    
  	    // wandle nfcMessages in ObjektArray um
  	    nfcList = nfcMessages.split(",");
  	    
  	    // gebe zwischengespeicherte Nachrichten aus
  	    showWichteltexts();
  	}
}

/**
 * Rufe EventListener um abzuwarten, 
 * bis die Seite geladen wurde.
 * Sind alle Seitenelemente geladen, 
 * wird ready aufgerufen.
 */
document.addEventListener('deviceready', ready, false);
