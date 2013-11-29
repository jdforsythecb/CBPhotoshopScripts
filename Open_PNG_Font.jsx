#target photoshop

#include "/g/jdforsythe/Settings/Photoshop Scripts/lib/PS_JSX_Exec.jsx"
// bring in the program execution prototype library

// create and run an instance of the Exec object for PNG font
var PNGFont = new Exec(new File("/c/pngfont/pngfont2.exe"));

PNGFont.logEnabled = true;
PNGFont.setLogFileName("pngFontExec.log");

// create a go method, with optional arguments
// for now this is just going to be asynchronous
PNGFont.go = function() {
    this.executeAsynch();
}

// now it's time to execute the script
PNGFont.go();