/**
 * Autor: Boris Hofer
 * Datei: editor.js
 * Datum: 04.03.2013
 *
 * Logik hinter View 3 (editorView)
 */
 
// deklariere Variabeln
var scannbutton;
var addLinkButton;
var backButton;
var textField;
var wichtelText;
var timer;
var payloadModus;

/**
 * Funktion backToMainmenu
 * Wechselt in die Mainmenu-View
 */
function backToMainmenu() {
    // gehe zurueck zur ersten View
    window.location = "file:///android_asset/www/index.html";
}

/**
 * Funktion autoClean
 * Entfernt unerwuenschte Zeichen aus einem Wichteltext
 * @params wichteltext String
 * @return cleanWichteltext String
 */
function autoClean(wichteltext) {
    var cleanWichteltext = wichteltext;
    // ersetzte Sonderzeichen mit Platzhaltern
    cleanWichteltext = cleanWichteltext.replace("Ö", "Oe");
    cleanWichteltext = cleanWichteltext.replace("Ü", "Ae");
    cleanWichteltext = cleanWichteltext.replace("Ä", "Ue");
    cleanWichteltext = cleanWichteltext.replace("ö", "oe");
    cleanWichteltext = cleanWichteltext.replace("ä", "ae");
    cleanWichteltext = cleanWichteltext.replace("ü", "ue");
    cleanWichteltext = cleanWichteltext.replace("{", "");
    cleanWichteltext = cleanWichteltext.replace("}", "");
    cleanWichteltext = cleanWichteltext.replace("[", "");
    cleanWichteltext = cleanWichteltext.replace("]", "");
    cleanWichteltext = cleanWichteltext.replace('"', "");
    cleanWichteltext = cleanWichteltext.replace("'", "");
    cleanWichteltext = cleanWichteltext.replace(":", "=");
    cleanWichteltext = cleanWichteltext.replace(";", "");
    cleanWichteltext = cleanWichteltext.replace(",", "");
    // gebe sauberen Wichteltext zurueck
    return cleanWichteltext;
}

/**
 * Funktion getDevPayload
 * Gibt Testdaten-Payload zurueck
 * @return stringtext String
 */
function getDevPayload() {
    // Objekt mit Wichteltexten als Array
    var wichteltexte = { "wichtelnachrichten": 
                         ["Lorem ipsum dolor sit amet consectetuer adipiscing elit. Aenea\
commodo ligula eget dolor",
                          "Lorem ipsum dolor sit amet consectetuer adipiscing elit. Aenea\
commodo ligula eget dolor",
                          "Lorem ipsum dolor sit amet consectetuer adipiscing elit. Aenea\
commodo ligula eget dolor",
                          "Lorem ipsum dolor sit amet consectetuer adipiscing elit. Aenea\
commodo ligula eget dolor", ]};
    // Wichteltexte-Objekt in String umwandeln
    var stringtext = JSON.stringify(wichteltexte); 
    // Wichteltexte als Payload zurueckgeben
    return stringtext; 
}

/**
 * Funktion WichteltextToWichtelTag
 * Schreibt record auf NFC-Tag
 * @params record
 */ 
function WichteltextToWichtelTag(record) {
    nfc.write(
        [record], 
        function() {
            // informiere User ueber erfolgreichen Schreibvorgang
            alert("Ihr Wichteltext wurde erfolgreich versendet.");
            navigator.notification.vibrate(500);
            // initialisiere einen counter
            var counter = 0;
            // setze Interval um das wechseln ins Hauptmenu zu timen
            // Wechsel ins Hauptmenu automatisch nach 2 Sekunden.
            timer = setInterval(function() {
                // wenn der counter den Wert 2 enthaelt
                if (1 === counter) {
                    // loesche Timer
                    timer = null;
                    // wechsle in die erste View
                    window.location = "file:///android_asset/www/index.html";
                } else {
                    // zaehle counter = counter + 1
                    counter++;
                }
            }, 2000);
        },
        function () {
            alert("Leider ist ein Fehler aufgetreten, bitte lesen Sie sorgfältig die \
Benutzeranleitung");
        }
    );
}

/**
 * Funktion tagFound
 * Liest Daten des Wichteltags aus und 
 * fuegt aktuellen Wichteltext hinzu.
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
        
        // fuege neue Textnachricht hinzu und 
        // loesche aelteste Textnachricht
        
        // neue nachricht hinzufuegen
        textMessages.push(autoClean(textField.value));
        // drehe Array um
        textMessages.reverse();
        // loesche Eintrag mit groesstem Index
        textMessages.pop();
        // drehe Array um
        textMessages.reverse();
        
        // definiere Datentyp
        var mimeType = 'text/plain';
        // deklariere payload;
        var payload = '';
        
        // pruefe modus (entwickler modus oder standart modus)
        if ("dev" === payloadModus) {
            payload = getDevPayload();
        } else {
            // gebe neuangeordnete Textnachrichten als String Payload an
            payload = JSON.stringify({"wichtelnachrichten": textMessages});
        }
        // setze record (endgueltige NFC-Daten) zusammen
        var record = ndef.mimeMediaRecord(mimeType, nfc.stringToBytes(payload));
    
        // schreibe auf NFC-Tag
        WichteltextToWichtelTag(record);
    } else {
        // ausgelsener nfcTag ist kein Wichteltag
        // reagiere nicht und warte auf kompatiblen NFC-Tag
    }
}

/**
 * Funktion writeMessage
 * Sucht nach NFC-Tag und ruft anschliessend 
 * tagFound Funktion auf.
 */
function writeMessage() {
    // suche nach NFC-Tag
    nfc.addNdefListener(tagFound, function () {
        // weise User auf den Scan Vorgang hin
        alert("Bitte berühren Sie den WichtelTag, welchen Sie beschreiben wollen.");
    }, function () {
        alert("Leider ist ein Fehler aufgetreten, \
bitte lesen Sie sorgfältig die Benutzeranleitung");
        window.location = "file:///android_asset/www/index.html";
    });
}

/**
 * Funktion appendLink
 * Fuegt vorhandenem textFeld-Text einen 
 * vom User angegebenen Link an.
 */
function appendLink() {
    // zwischenspeichere Text aus Textfeld
    wichtelText = textField.value;
    // frage User nach Link-Bezeichnung
    var linkDescription = prompt("Bitte geben sie den Link-Titel an:", "");
    // frage User nach Link
    var linkUrl = prompt("Bitte geben sie die komplette Url an:", "http://www.");
    linkUrl = linkUrl.replace(":", "=");
    // fuege link zum Text hinzu
    wichtelText += '<button onclick=$linkClicked(%' + linkUrl + '%)$>' + linkDescription + 
    '</button>';
    // schreibe Text wieder in das Textfeld
    textField.value = wichtelText;
}


/**
 * Funktion ready
 * Initialisiert alle Variabeln mit Menu-Buttons, 
 * sowie einem Div für die Benutzer-Anleitung.
 */
function ready() {
    // setze playModus auf "dev" um Testdaten auf einen NFC-Tag 
    // schreiben zu koennen.
    payloadModus = "std";
    
    // initialisiere Menubuttons
    scannbutton   = document.getElementById('scannButton2');
    addLinkButton = document.getElementById('addLinkButton');
    backButton    = document.getElementById('backButton');
    // initialisiere Wichteltextfeld
    textField = document.getElementById('wichteltextField');
  	
    // starte EventListeners für Menubuttons
    scannbutton.addEventListener('click', writeMessage, false);
    addLinkButton.addEventListener('click', appendLink, false); 
    backButton.addEventListener('click', backToMainmenu , false); 
}

/**
 * Rufe EventListener um abzuwarten, 
 * bis die Seite geladen wurde.
 * Sind alle Seitenelemente geladen, 
 * wird ready aufgerufen.
 */
document.addEventListener('deviceready', ready, false);
