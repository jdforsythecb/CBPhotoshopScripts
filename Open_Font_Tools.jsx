#target photoshop

#include "/g/jdforsythe/Settings/Photoshop Scripts/lib/PS_JSX_Exec.jsx"
// bring in the program execution prototype library

// create and run an instance of the Exec object for PNG font
var FntTool = new Exec(new File("/c/FontTool/fnttool3.exe"));

FntTool.logEnabled = true;
FntTool.setLogFileName("FontToolExec.log");

// create a go method, with optional arguments
// for now this is just going to be asynchronous
FontTool.go = function() {
    this.executeAsynch();
}

// now it's time to execute the script
FontTool.go();