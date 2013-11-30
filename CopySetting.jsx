// chooses which script(s) to run to complete the copy process

#target photoshop

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

// an enum-like object listing all formats a document could be in
CB.Formats = {
    QUARKCOLORTIFFPRINTER: 0,
    QUARKBWTIFFPRINTER: 1,
    PMPORTRAITCOLORTIFFPRINTER: 2,
    PMPORTRAITBWTIFFPRINTER: 3,
    PMLANDSCAPECOLORTIFFPRINTER: 4,
    PMLANDSCAPEBWTIFFPRINTER: 5
};

// create a dialog box to ask what the user wants to do

var win = new Window("dialog", undefined, [0,0,605,220], );
sText = win.add( "statictext", [5,5,75,25], 'From:' );
fromProgram1 = win.add( "radiobutton", [5,35,205,55], 'QuarkXPress');
fromProgram2 = win.add( "radiobutton", [5,60,205,80], 'PageMaker 6.5');
sText = win.add( "statictext", [200,5,270,25], 'To:' );
toProgram1 = win.add( "radiobutton", [200,35,400,55], 'PNG Font' );
toProgram2 = win.add( "radiobutton", [200,60,400,80], 'Font Tools' );
sText = win.add( "statictext", [400,5,470,25], 'Size:' );
jobSize1 = win.add( "radiobutton", [400,40,600,60], 'Dollar' );
jobSize2 = win.add( "radiobutton", [400,65,600,85], 'Premier' );
jobSize3 = win.add( "radiobutton", [400,90,470,110], 'Booklet' );
sText = win.add( "statictext", [5,115,75,135], 'Need:' );
needsProof = win.add( "checkbox", [5,145,205,165], 'Proof Page' );
goButton = win.add( "button", [5,185,200,215], 'GO!' );
win.center();


// button click handlers, set the visibility of the date/number/addressing layers
goButton.onClick = function() {
                                    if (fromProgram1.value == true) CB.fromProgram = CB.Programs.QUARK;
                                    if (fromProgram2.value == true) CB.fromProgram = CB.Programs.PAGEMAKER;
                                    
                                    if (toProgram1.value == true) CB.toProgram = CB.Programs.PNGFONT;
                                    if (toProgram2.value == true) CB.toProgram = CB.Programs.FONTTOOLS;
                                    
                                    if (jobSize1.value == true) CB.jobSize = CB.JobSizes.DOLLAR;
                                    if (jobSize2.value == true) CB.jobSize = CB.JobSizes.PREMIER;
                                    if (jobSize3.value == true) CB.jobSize = CB.JobSizes.BOOKLET;
                                    
                                    if (needsProof.value == true) CB.needProof = true;
                                    else CB.needProof = false;
                                    
                                    win.close();
}


win.show();

// run the correct scripts
switch (CB.fromProgram) {
    
    // coming from Quark
    case CB.Programs.QUARK:
        
        // going to which program
        switch (CB.toProgram) {
            
            // going to PNG Font
            case CB.Programs.PNGFONT:

                // what size envelope
                switch (CB.jobSize) {
                    
                    // dollar size
                    case CB.JobSizes.DOLLAR:
                        #include "/g/jdforsythe/Settings/Photoshop Scripts/QuarkColorFace.jsx"
                        break;
                }
            
                break;
        }
    
        break;
        
}
                    
                    