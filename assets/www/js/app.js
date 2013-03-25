/**
 * Autor: Boris Hofer
 * Datei: app.js
 * Datum: 27.02.2013
 *
 * Logik hinter View 1 (Hauptmenu-Logik)
 */
 
// deklariere Variabeln
var manualButton;
var listButton;
var editorButton;
var exitButton;
var manualField;

/**
 * Funktion checkManualState
 * Prueft ob Anleitung angezeigt werden muss oder nicht 
 * und handelt entsprechend
 */
function checkManualState () {
    // wenn manualField unsichtbar ist
    if ("?" === manualButton.innerHTML) {
        // mache manualField sichtbar
        manualField.style.display = 'inline';
        // wechsle Button Inhalt
        manualButton.innerHTML = "x";
    } else { 
        // wenn manualField sichtbar
        // mache es unsichtbar
        manualField.style.display = 'none';
        // wechsle Button Inhalt
        manualButton.innerHTML = "?";
    }
}
  
/**
 * Funktion exitApp
 * Beendet die Applikation.
 */
function exitApp () {
    // cordova Funktion zum beenden der Applikation
    navigator.app.exitApp();
}
  
/**
 * Funktion switchToList
 * Wechselt auf die listView
 */
function switchToList () {
    window.location = "file:///android_asset/www/listView.html";
}
  
/**
 * Funktion switchToEditor
 * Wechselt auf die editorView
 */
function switchToEditor () {
    window.location = "file:///android_asset/www/editorView.html";
}

/**
 * Funktion ready
 * Initialisiert alle Variabeln mit Menu-Buttons, 
 * sowie einem Div für die Benutzer-Anleitung.
 */
function ready () {
    // zwischenspeichere listenStatus in localStorage
    localStorage.setItem("displayList", "no");
    
    // initialisiere Menubuttons
    manualButton = document.getElementById('manualButton');
    listButton   = document.getElementById('listButton');
    editorButton = document.getElementById('editorButton');
    exitButton   = document.getElementById('exitButton');
    // initialisiere Benutzeranleitugsfeld
    manualField  = document.getElementById('manualField');
  	
    // starte EventListeners für Menubuttons
    manualButton.addEventListener('click', checkManualState, false);
    listButton.addEventListener('click', switchToList, false); 
    editorButton.addEventListener('click', switchToEditor , false); 
    exitButton.addEventListener('click', exitApp, false); 
}

/**
 * Rufe EventListener um abzuwarten, 
 * bis die Seite geladen wurde.
 * Sind alle Seitenelemente geladen, 
 * wird ready aufgerufen.
 */
document.addEventListener('deviceready', ready, false);
