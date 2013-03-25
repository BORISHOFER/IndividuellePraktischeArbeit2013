/**
 *  Autor: Boris Hofer
 *  Datei: WichtelAppActivity
 *  Datum: 27.02.2013
 *  
 *  Von Android-Eclipse-Plugin generierter Code, 
 *  welcher unter Anwendung von PhoneGap erweitert  
 *  wurde.
 */

package borishofer.wichtelapp;

import org.apache.cordova.DroidGap;
import android.os.Bundle;

/**
 * Class WichtelAppActivity
 * 
 * Erste aufgerufene Klasse, welche den User 
 * zum Hauptmenu der App führt und Cordova PhoneGap 
 * Bereitstellt.
 * 
 * @author borishofer
 * @extends DroidGap
 */
public class WichtelAppActivity extends DroidGap {
    /** Wird aufgerufen sobald diese Aktivitaet das erste mal aufgerufen wird */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Lade Hauptmenu
        super.loadUrl("file:///android_asset/www/index.html");
    }
}
