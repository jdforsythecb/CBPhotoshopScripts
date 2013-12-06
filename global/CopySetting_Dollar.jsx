// chooses which script(s) to run to complete the copy process for dollar size envelopes
#target photoshop

// top-most script in the Copy setting hierarchy - creates the global object
// and initializes with the needed properties

// create the universal global object if it doesn't exist
var CB = CB || {};

///////////////////////////////////////////////////////////////////////////////////////
// ENUMS //////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

// an enum-like object listing all programs
CB.Programs = {
    QUARK: 0,
    PAGEMAKER: 1,
    INDESIGN: 2,
    PHOTOSHOP: 3,
    PNGFONT: 4,
    FONTTOOLS: 5
};

// an enum-like object listing the job sizes
CB.JobSizes = {
    DOLLAR: 0,
    PREMIER: 1,
    BOOKLET: 2,
    CARTON: 3,
    COVER: 4,
    MAILBACK: 5,
    NUM10: 6
};

// an enum-like object listing the job color types
CB.ColorTypes = {
    FULLCOLOR: 0,
    MONOCHROME: 1
};

// an enum-like object listing all formats a document could be in
CB.Formats = {
    QUARKCOLORTIFFPRINTER: 0,
    QUARKBWTIFFPRINTER: 1,
    PMPORTRAITCOLORTIFFPRINTER: 2,
    PMPORTRAITBWTIFFPRINTER: 3,
    PMLANDSCAPECOLORTIFFPRINTER: 4,
    PMLANDSCAPEBWTIFFPRINTER: 5
};

// an enum-like object listing job sides (face/flap)
CB.JobSides = {
    FACE: 0,
    FLAP: 1
};


// and we're always going to need an instance of the swiss knife to do manipulations on the documents
#include "/g/jdforsythe/Settings/Photoshop Scripts/lib/ChurchBudgetSwissKnife.jsx"

// create an instance of the swiss knife object
CB.swissKnife = new ChurchBudgetSwissKnife();




/*********************************************************************************** FUNCTION DEFINITIONS
    ********************************************************************************************************/



// the main execution of the color job type
function doCopySettingColor() {
    
    CB.isFace = (CB.jobSide == CB.JobSides.FACE);
    CB.isFlap = !CB.isFace;
    
    CB.isQuark = (CB.fromProgram == CB.Programs.QUARK);
    CB.isPageMaker = !CB.isQuark;

    // resize to 300dpi since the tiff printer is 600dpi
    CB.swissKnife.resizeToDPI(300);
    
    // select all, copy
    CB.swissKnife.selectAll();
    CB.swissKnife.clipboardCopy();
    
    // undo the resize to 300dpi to get the original document (from TIFF printer) in its original state
    CB.swissKnife.Document().activeHistoryState = CB.swissKnife.Document().historyStates[0];
    
    // open the PNG Template
    CB.swissKnife.openPNGTemplate();
    
    // paste in place
    CB.swissKnife.pasteInPlace();
    
    
    // for face side, move the layer into the proper position, and get rid of the folder number
    if (CB.isFace) {
        // move layer
        if (CB.isQuark) CB.swissKnife.moveQuarkColorFaceOnPNG();
        else CB.swissKnife.movePMColorFaceOnPNG();
        
        // janky way to get rid of folder number from Quark
        if (CB.isQuark) CB.swissKnife.clearQuarkFolderNumber();
        // janky way to get rid of any extra pixels from PageMaker
        // selects a rectangle about halfway into the border and clears pixels around it
        else CB.swissKnife.clearPMFolderNumber();
    }

    // for flap side, rotate the layer 180 degrees, move into the proper place, and flip the flap to the top
    else if (CB.isFlap) {
        CB.swissKnife.rotateByDegrees(180);
        
        if (CB.isQuark) CB.swissKnife.moveQuarkColorFlapOnPNG();
        else CB.swissKnife.movePMColorFlapOnPNG();
        
        CB.swissKnife.flipFlapOnPNG();
    }


    // flatten and save to clipboard.png
    CB.swissKnife.flattenImage();
    CB.swissKnife.saveToClipboardPNG();
    
    // copy the folder number to the clipboard
    #include "/g/jdforsythe/Settings/Photoshop Scripts/lib/copyTextToClipboard.jsx"
    clip = copyTextToClipboard(CB.folder);
    if (clip.status == 1) {
        CB.swissKnife.informationDialog("Warning: Failed to copy the folder number to the clipboard! Error: " + clip.message);
    }


    // open PNG Font
    // need command-line arguments here!!!
    #include "/g/jdforsythe/Settings/Photoshop Scripts/Open_PNG_Font.jsx"

    message = "When PNG Font opens, press CTRL+V to paste in the folder number.\n \
               \"Load from clipboard\" and create or overwrite font code \"" + CB.fontCode + "\" \n\n \
               Then come back and press \"Ok\"";

    CB.swissKnife.informationDialog(message);
    
    // we're done with the PNG Template, so close it, leaving the original document open
    CB.swissKnife.closeWithoutSaving();
}



// the main execution of the monochrome job type
function doCopySettingMonochrome() {

    // booleans for jobSide
    CB.isFace = (CB.jobSide == CB.JobSides.FACE);
    CB.isFlap = !CB.isFace;
    
    CB.isQuark = (CB.fromProgram == CB.Programs.QUARK);
    CB.isPageMaker = !CB.isQuark;
    
    // set the image to 300dpi since the bw tiff printer is now 600dpi
    CB.swissKnife.resizeToDPI(300);

    // select all, copy
    CB.swissKnife.selectAll();
    CB.swissKnife.clipboardCopy();
    
    // undo the resize to 300dpi to get the original document (from TIFF printer) in its original state
    CB.swissKnife.Document().activeHistoryState = CB.swissKnife.Document().historyStates[0];

    // open Font Tools Template and paste into place, move and flatten
    CB.swissKnife.openFontToolsTemplate();
    CB.swissKnife.pasteInPlace();
    if (CB.isQuark) CB.swissKnife.moveQuarkBWOnFontTools();
    else CB.swissKnife.movePMBWOnFontTools();
    
    CB.swissKnife.flattenImage();
    
    // this is the only way to pause the script (seemingly, anyway) and
    // continue after the user does something
    // we show a palette window by sending a message through bridgeTalk
    // the palette doesn't steal focus, but it also lets this script
    // continue executing (and there's no way to wait for it because
    // a loop will stop PS from responding to the user)
    // so we show this dialog and in the button click callback we load
    // the part 2 to this script and continue executing

    // this dialog is to allow the user to select any images to protect from
    // the accented edges tool we're about to use, then continue execution

    var title = "Select image";
    var message = "Select image to protect with marquee tool, then click continue...";
    var bt = new BridgeTalk();
        bt.target = "photoshop";
        func = "var w = new Window('palette', '" + title + "', [0, 0, 400, 100]); \
                        w.add('statictext', [5,5,390,50], '" + message + "'); \
                        okButton = w.add('button', [5,40,205,90], 'GO!'); \
                        w.center(); \
                        okButton.onClick = function() { \
                            w.close(); \
                            var CB = {}; \
                            CB.isMM = " + CB.isMM + "; \
                            CB.isCB = " + CB.isCB + "; \
                            CB.isMcDaniel = " + CB.isMcDaniel + "; \
                            CB.isUnited = " + CB.isUnited + "; \
                            CB.folder = \"" + CB.folder + "\"; \
                            CB.fontCode = \"" + CB.fontCode + "\"; \
                            CB.isFlap = " + CB.isFlap + "; \
                            #include \"/g/jdforsythe/Settings/Photoshop Scripts/global/BW_After_Marquee.jsx\"; \
                        }; \
                        w.center(); \
                        w.show();";
        bt.body = func;
        bt.send();

    // execution will continue after the pallete window is displayed
    // so we must do nothing here and only when the user clicks the continue button
    // in the palette window above, load another script to continue the execution of Quark BW images
    



}
/*********************************************************************************** MAIN EXECUTION CONTINUES
    *************************************************************************************************************/



// include the library of utils for user-inputted folder number strings
#include '/g/jdforsythe/Settings/Photoshop Scripts/lib/folderNumberStringUtils.jsx'
// get the folder number from user input
userInputFolder = prompt ("Enter the folder number", "A-0101", "Enter the folder number");
// get the font code from user input
CB.fontCode = prompt ("Enter the font code", "A", "Enter the font code");

// create an instance of the folderNumberStringUtils object with the user-inputted folder string
FolderUtils = new folderNumberStringUtils(userInputFolder);

// save company globally
CB.isMM = FolderUtils.isMM;
CB.isCB = FolderUtils.isCB;
CB.isMcDaniel = FolderUtils.isMCD;
CB.isUnited = FolderUtils.isUN;

// copy the sanitized folder number to the clipboard
CB.folder = FolderUtils.folder;

// create a dialog box to ask what the user wants to do
var win = new Window("dialog", undefined, [0,0,605,220], );
sText = win.add( "statictext", [5,5,75,25], 'From:' );
fromProgram1 = win.add( "radiobutton", [5,35,205,55], 'QuarkXPress');
fromProgram2 = win.add( "radiobutton", [5,60,205,80], 'PageMaker 6.5');
sText = win.add( "statictext", [200,5,270,25], 'Type:' );
colorType1 = win.add( "radiobutton", [200,35,400,55], 'Full Color' );
colorType2 = win.add( "radiobutton", [200,60,400,80], 'Monochrome' );
sText = win.add( "statictext", [400,5,470,25], 'Side:' );
jobSide1 = win.add( "radiobutton", [400,40,600,60], 'Face' );
jobSide2 = win.add( "radiobutton", [400,65,600,85], 'Flap' );
sText = win.add( "statictext", [5,115,75,135], 'Need:' );
needsProof = win.add( "checkbox", [5,145,205,165], 'Proof Page' );
goButton = win.add( "button", [5,185,200,215], 'GO!' );
win.center();

// default to Quark for Church Budget, PageMaker for Monthly Mail
if (!CB.isMM) fromProgram1.value = true;
else fromProgram2.value = true;

// default to Monochrome for everyone
colorType2.value = true;

// default to face side for everyone
jobSide1.value = true;

// for Church Budget, default to needing a proof
if (!CB.isMM) needsProof.value = true;


// set the values when the button is clicked
goButton.onClick = function() {
                                    // make sure all choices are made
                                    if ( (fromProgram1.value || fromProgram2.value) &&
                                         (colorType1.value || colorType2.value) &&
                                         (jobSide1.value || jobSide2.value) ) {
                                            if (fromProgram1.value == true) CB.fromProgram = CB.Programs.QUARK;
                                            if (fromProgram2.value == true) CB.fromProgram = CB.Programs.PAGEMAKER;
                                            
                                            if (colorType1.value == true) CB.colorType = CB.ColorTypes.FULLCOLOR;
                                            if (colorType2.value == true) CB.colorType = CB.ColorTypes.MONOCHROME;
                                            
                                            if (jobSide1.value == true) CB.jobSide = CB.JobSides.FACE;
                                            if (jobSide2.value == true) CB.jobSide = CB.JobSides.FLAP;
                                                                                
                                            if (needsProof.value == true) CB.needProof = true;
                                            else CB.needProof = false;
                                            
                                            win.close();
                                    }
                                
                                    // if one of the choices isn't make, don't close, show an alert
                                    else {
                                        if (!(fromProgram1.value || fromProgram2.value)) {
                                            alert("You must choose a program you're coming from");
                                        }
                                        else if (!(colorType1.value || colorType2.value)) {
                                            alert("You must choose a job color type");
                                        }
                                        else {
                                            alert("You must chose a job side");
                                        }
                                    }
}


win.show();


// if we end up here without the proper items chosen, the user X-ited the window, so do nothing
if ( (fromProgram1.value || fromProgram2.value) && (colorType1.value || colorType2.value) && (jobSide1.value || jobSide2.value) ) {

    // from Quark
    if (CB.fromProgram == CB.Programs.QUARK) {

        // Full color (go to only PNG Font)
        if (CB.colorType == CB.ColorTypes.FULLCOLOR) {
            // face side or flap side is already set in the button press listener above
            // both kinds of job use the same function which will check CB.jobSide for differences
            doCopySettingColor();
            
            // if we need a proof, print one
            if (CB.needProof) {
                #include "/g/jdforsythe/Settings/Photoshop Scripts/global/Put_On_Proof.jsx"
            }
        }

        // Monochrome (go to PNG Font AND Font Tools)
        else if (CB.colorType == CB.ColorTypes.MONOCHROME) {
            doCopySettingColor();
            
            // if we need a proof, print one (before doing monochrome because of the continue)
            if (CB.needProof) {
                #include "/g/jdforsythe/Settings/Photoshop Scripts/global/Put_On_Proof.jsx"
            }
        
            doCopySettingMonochrome();
        }
            
    }

    // from PageMaker 6.5
    else if (CB.fromProgram == CB.Programs.PAGEMAKER) {
        
        // going to PNG Font
        if (CB.colorType == CB.ColorTypes.FULLCOLOR) {
            doCopySettingColor();
            
            // if we need a proof, print one
            if (CB.needProof) {
                #include "/g/jdforsythe/Settings/Photoshop Scripts/global/Put_On_Proof.jsx"
            }
        }

        // going to Font Tools
        else if (CB.colorType == CB.ColorTypes.MONOCHROME) {
            doCopySettingColor();
            
            // if we need a proof, print one
            if (CB.needProof) {
                #include "/g/jdforsythe/Settings/Photoshop Scripts/global/Put_On_Proof.jsx"
            }
        
            doCopySettingMonochrome();
        }

    }

}

// else do nothing because they didn't choose anything...
