#target photoshop

#include "/g/jdforsythe/Settings/Photoshop Scripts/lib/PS_JSX_Exec.jsx"
// bring in the program execution prototype library

// debug
// FontToolsArgs = { folder: 'A0101' };

// this object should be created before executing this script
// of the form
// FontToolsArgs = {
//                      folder: 'A0101'
// };
// if FontToolsArgs doesn't have a folder, it just opens Font Tools normally
// but the object must be defined

if (typeof FontToolsArgs !== 'undefined') {
    
    // create and run an instance of the Exec object for PNG font
    var FontTool = new Exec(new File("/c/FontTool/fnttool3.exe"));

    FontTool.logEnabled = true;
    FontTool.setLogFileName("FontToolExec.log");


    if (typeof FontToolsArgs.folder === 'undefined') {
        args = [];
    }

    else {
        args = ["/o=" + FontToolsArgs.folder];
    }

    // create a go method, with optional arguments
    // for now this is just going to be asynchronous
    FontTool.go = function() {
        this.executeAsynch(args);
    }

    // now it's time to execute the script
    FontTool.go();
    
}