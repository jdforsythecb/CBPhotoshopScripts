#target photoshop

#include "/g/jdforsythe/Settings/Photoshop Scripts/lib/PS_JSX_Exec.jsx"
// bring in the program execution prototype library

// debug
//PNGFontArgs = { folder: 'A0101', jobType: "DoubleWide_CB" };


// this object should be created before executing this script
// of the form
// PNGFontArgs = {
//                  folder: 'A0101',
//                  jobType: 'DoubleWide_CB'
// }
// if PNGFontArgs doesn't have a folder and jobtype, it just opens PNG Font normally
// but the object must be defined
if (typeof PNGFontArgs !== 'undefined') {

    // create and run an instance of the Exec object for PNG font
    var PNGFont = new Exec(new File("/c/pngfont/pngfont2.exe"));

    PNGFont.logEnabled = true;
    PNGFont.setLogFileName("pngFontExec.log");

    // create a go method, with optional arguments
    // for now this is just going to be asynchronous
   
    if ((typeof PNGFontArgs.folder === 'undefined') || (typeof PNGFontArgs.jobType === 'undefined')) {
        args = [];
    }

    else {
        args = ["/o=" + PNGFontArgs.folder, "/t=" + PNGFontArgs.jobType];
    }

    PNGFont.Go = function() {
        this.executeAsynch(args);
    };

    // now it's time to execute the script
    PNGFont.Go();
}