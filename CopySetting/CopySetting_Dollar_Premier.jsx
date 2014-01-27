// chooses which script(s) to run to complete the copy process for dollar size envelopes
#target photoshop

// top-most script in the Copy setting hierarchy - creates the global object
// and initializes with the needed properties

// if we've hard-coded this as a monthly mail computer running it
if (typeof hardCodedMM === 'undefined') hardCodedMM = false;

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
        
        if (CB.isQuark) {
            CB.swissKnife.moveQuarkColorFlapOnPNG();
            CB.swissKnife.flipFlapOnPNGCB();
        }
        else {
            CB.swissKnife.movePMColorFlapOnPNG();
            CB.swissKnife.flipFlapOnPNGMM();
        }
    }


    // flatten and save to clipboard.png
    CB.swissKnife.flattenImage();
    CB.swissKnife.saveToClipboardPNG();
    
    // create command-line arguments for PNG Font
    var PNGFontArgs = {}
    PNGFontArgs.folder = CB.folder.toUpperCase();
    if (CB.isMM) PNGFontArgs.jobType = 'DoubleWide_MM';
    else PNGFontArgs.jobType = 'DoubleWide_CB';    

    // open PNG Font
    #include "/g/jdforsythe/Settings/Photoshop Scripts/Open_PNG_Font.jsx"

    
    // we no longer need this dialog. nothing will save over top clipboard.png
    // however certain functions, like Paste In Place will fail if Photoshop
    // doesn't have focus, so we need to keep the script paused until the user returns
    message = "When PNG Font opens, \"Load from clipboard\" and create or overwrite font code \"" + CB.fontCode + "\" \n\n \
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
    
    // if we don't have an image, we don't need to protect the image so just move on
    if (!CB.hasImage) {
        #include "/g/jdforsythe/Settings/Photoshop Scripts/CopySetting/Envelope_BW_After_Marquee.jsx";
    }

    else {    
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
                            okButton = w.add('button', [5,40,205,90], 'GO!', {name: 'ok'}); \
                            okButton.active = true; \
                            w.center(); \
                            okButton.onClick = function() { \
                                w.close(); \
                                var CB = {}; \
                                CB.isMM = " + CB.isMM + "; \
                                CB.isCB = " + CB.isCB + "; \
                                CB.isMcDaniel = " + CB.isMcDaniel + "; \
                                CB.isUnited = " + CB.isUnited + "; \
                                CB.folder = \"" + CB.folder + "\"; \
                                CB.prettyFolder = \"" + CB.prettyFolder + "\"; \
                                CB.fontCode = \"" + CB.fontCode + "\"; \
                                CB.isFlap = " + CB.isFlap + "; \
                                CB.hasImage = " + CB.hasImage + "; \
                                CB.jobSize = " + CB.jobSize + "; \
                                #include \"/g/jdforsythe/Settings/Photoshop Scripts/CopySetting/Envelope_BW_After_Marquee.jsx\"; \
                            }; \
                            w.center(); \
                            w.show(); \
                            $.sleep(100); \
                            w.active = true; \
                            okButton.active = true;";

            bt.body = func;
            bt.send();

//                                CB.JobSizes = " + CB.swissKnife.objectToString(CB.JobSizes) + "; \
        // execution will continue after the pallete window is displayed
        // so we must do nothing here and only when the user clicks the continue button
        // in the palette window above, load another script to continue the execution of Quark BW images

    }


}
/*********************************************************************************** MAIN EXECUTION CONTINUES
    *************************************************************************************************************/

// if this is hard-coded monthly mail, use 0000
// otherwise use A-0101 for the default folder code3
if (!hardCodedMM) {
    defaultFolder = "A-0101";
    defaultFont = "A";
}
else {
    defaultFolder = "0000";
    defaultFont = "W";
}


// if the user cancels at the folder input, we want to catch that "error" and stop execution
try {
    // get the folder number from user input
    userInputFolder = prompt ("Enter the folder number", defaultFolder, "Enter the folder number");
    // ERROR: if they press cancel, the value is null
    if (userInputFolder === null) throw "NO_FOLDER";
    
    // get the font code from user input
    CB.fontCode = prompt ("Enter the font code", defaultFont, "Enter the font code");
    // ERROR: if they press cancel, cancel
    if (CB.fontCode === null) throw "NO_FONT";

    // include the library of utils for user-inputted folder number strings
    #include '/g/jdforsythe/Settings/Photoshop Scripts/lib/folderNumberStringUtils.jsx'

    // create an instance of the folderNumberStringUtils object with the user-inputted folder string
    FolderUtils = new folderNumberStringUtils(userInputFolder);

    // save company globally
    CB.isMM = FolderUtils.isMM;
    CB.isCB = FolderUtils.isCB;
    CB.isMcDaniel = FolderUtils.isMCD;
    CB.isUnited = FolderUtils.isUN;
    
    // ERROR: if none of the companies gets set to true, there was an error with the folder number
    if (!(CB.isMM || CB.isCB || CB.isMcDaniel || CB.isUnited)) throw "INVALID_FOLDER";

    CB.folder = FolderUtils.folder;
    CB.prettyFolder = FolderUtils.prettyFolder;

    // create a dialog box to ask what the user wants to do
    var win = new Window("dialog", undefined, [0,0,605,250], );

    sText = win.add( "statictext", [5,5,75,25], 'From:' );
    fromProgram1 = win.add( "radiobutton", [5,35,205,55], 'QuarkXPress');
    fromProgram2 = win.add( "radiobutton", [5,60,205,80], 'PageMaker 6.5');

    sText = win.add( "statictext", [200,5,270,25], 'Type:' );
    colorType1 = win.add( "radiobutton", [200,35,400,55], 'Full Color' );
    colorType2 = win.add( "radiobutton", [200,60,400,80], 'Monochrome' );

    sText = win.add( "statictext", [400,5,470,25], 'Side:' );
    jobSide1 = win.add( "radiobutton", [400,35,600,55], 'Face' );
    jobSide2 = win.add( "radiobutton", [400,60,600,80], 'Flap' );

    sText = win.add( "statictext", [5,115,75,135], 'Need:' );
    needsProof = win.add( "checkbox", [5,145,205,165], 'Proof Page' );

    win.add("statictext", [200,115,270,135], 'Size:');
    jobSize1 = win.add("radiobutton", [200,150,400,170], 'Dollar');
    jobSize2 = win.add("radiobutton", [200,175,400,195], 'Premier');

    win.add("statictext", [400,115,470,135], 'Design:');
    hasImage1 = win.add("radiobutton", [400,150,600,170], 'Has an image');
    hasImage2 = win.add("radiobutton", [400,175,600,195], 'Is text only');

    // naming the button "ok" makes it accept the enter key (even when it doesn't have focus)
    goButton = win.add( "button", [400,210,600,240], 'GO!', {name: "ok"});
    // making the button "active" gives it focus (although without naming it "ok"
    // it can lose focus) also it only accepts space bar without the name
    goButton.active = true;
    
    cancelButton = win.add( "button", [235,210,385,240], 'Cancel', {name: "cancel"});
    
    
    win.center();

    // default to Quark for Church Budget, PageMaker for Monthly Mail
    if (!CB.isMM) fromProgram1.value = true;
    else fromProgram1.value = false;
    fromProgram2.value = !fromProgram1.value;


    // default to Monochrome for everyone
    colorType1.value = false;
    colorType2.value = true;

    // default to face side for everyone
    jobSide1.value = true;
    jobSide2.value = false;

    // for Church Budget, default to needing a proof
    if (!CB.isMM) needsProof.value = true;

    // default to dollar size
    jobSize1.value = true;
    jobSize2.value = false;

    // default to having an image for everyone
    hasImage1.value = false;
    hasImage2.value = true;


    // set the values when the button is clicked
    goButton.onClick = function() {
                                        // make sure all choices are made
                                        if ( (fromProgram1.value || fromProgram2.value) &&
                                             (colorType1.value || colorType2.value) &&
                                             (jobSide1.value || jobSide2.value) &&
                                             (jobSize1.value || jobSize2.value) ) {
                                                if (fromProgram1.value == true) CB.fromProgram = CB.Programs.QUARK;
                                                else CB.fromProgram = CB.Programs.PAGEMAKER;
                                                
                                                if (colorType1.value == true) CB.colorType = CB.ColorTypes.FULLCOLOR;
                                                else CB.colorType = CB.ColorTypes.MONOCHROME;
                                                
                                                if (jobSide1.value == true) CB.jobSide = CB.JobSides.FACE;
                                                else CB.jobSide = CB.JobSides.FLAP;
                                                                                    
                                                CB.needProof = needsProof.value;
                                                
                                                if (jobSize1.value == true) CB.jobSize = CB.swissKnife.JobSizes.DOLLAR;
                                                else CB.jobSize = CB.swissKnife.JobSizes.PREMIER;
                                                                                            
                                                CB.hasImage = hasImage1.value;
                                                
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
                                            else if (!(jobSize1.value || jobSize2.value)) {
                                                alert("You must select a job size");
                                            }
                                            else {
                                                alert("You must chose a job side");
                                            }
                                        }
    }

    win.show();


    // if we end up here without the proper items chosen, the user X-ited the window or clicked cancel
    if ( (fromProgram1.value || fromProgram2.value) && (colorType1.value || colorType2.value) &&
         (jobSide1.value || jobSide2.value) && (jobSize1.value || jobSize2.value) ) {

        // from Quark
        if (CB.fromProgram == CB.Programs.QUARK) {

            // Full color (go to only PNG Font)
            if (CB.colorType == CB.ColorTypes.FULLCOLOR) {
                // face side or flap side is already set in the button press listener above
                // both kinds of job use the same function which will check CB.jobSide for differences
                // both Dollar and Premier use the same PNG function, just a different proof
                doCopySettingColor();
                
                // if we need a proof, print one
                if (CB.needProof) {
                    #include "/g/jdforsythe/Settings/Photoshop Scripts/CopySetting/Envelope_Put_On_Proof.jsx"
                }
            }

            // Monochrome (go to PNG Font AND Font Tools)
            else if (CB.colorType == CB.ColorTypes.MONOCHROME) {

                // we always want to put the image into PNG font, even for monochrome
                // dollar and premier both use the same functions for PNG and Font Tools
                doCopySettingColor();
                
                // if we need a proof, print one (before doing monochrome because of the continue)
                if (CB.needProof) {
                    #include "/g/jdforsythe/Settings/Photoshop Scripts/CopySetting/Envelope_Put_On_Proof.jsx"
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
                    #include "/g/jdforsythe/Settings/Photoshop Scripts/CopySetting/Envelope_Put_On_Proof.jsx"
                }
            }

            // going to Font Tools
            else if (CB.colorType == CB.ColorTypes.MONOCHROME) {
                doCopySettingColor();
                
                // if we need a proof, print one
                if (CB.needProof) {
                    #include "/g/jdforsythe/Settings/Photoshop Scripts/CopySetting/Envelope_Put_On_Proof.jsx"
                }
            
                doCopySettingMonochrome();
            }

        }

    }

    // ERROR: else the user cancelled, pressed ESC, or clicked the X
    else throw "NO_OPTIONS";
    
}

// error-handling (since all functions, color and monochrome, are run from within this try/catch block
// all errors can be handled here)
catch(err) {
    switch(err) {
        case "NO_FOLDER":
            // the user cancelled entering a folder number, silently exit
            break;
        
        case "NO_FONT":
            // the user cancelled entering a font code, silently exit
            break;
            
        case "INVALID_FOLDER":
            // the folder entered didn't evaluate into any of the companies
            alert("The folder number you entered is invalid. Please try again.");
            break;
            
        case "NO_OPTIONS":
            // the user cancelled the job options window, silently exit
            break;
            
        case "TESTING":
            alert("wow it worked"); break;
            
        default:
            alert("Other error");
            break;
    }
}