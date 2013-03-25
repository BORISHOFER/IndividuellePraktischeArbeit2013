/**
 * Autor: Boris Hofer
 * Datei: infoBoxTool.js
 * Datum: 05.03.2013
 *
 * Tool um alerts durch customtextbox zu ersetzen
 */

// deklariere Variabeln
var infobox;

/**
 * Funktion alert
 * Ueberschreibt alert Funktion.
 * Gibt formatierte Anweisung an den Benutzer aus.
 * @params text String
 */
alert = function displayInfo(text) {
    // gebe alert-text an infobox
    infobox.innerHTML = text;
    // mache infobox sichtbar
    infobox.style.display = "inline";
}

/**
 * Funktion ready
 * Initialisiert alle Variabeln mit Menu-Buttons, 
 * sowie einem Div für die Benutzer-Anleitung.
 */
function ready() {
    // initialisiere Infobox
    infobox = document.getElementById('infobox');
}

/**
 * Rufe EventListener um abzuwarten, 
 * bis die Seite geladen wurde.
 * Sind alle Seitenelemente geladen, 
 * wird ready aufgerufen.
 */
document.addEventListener('deviceready', ready, false);
