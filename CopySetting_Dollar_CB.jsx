// chooses which script(s) to run to complete the copy process for dollar size envelopes
#target photoshop

// always start with the global
#include "/g/jdforsythe/Settings/Photoshop Scripts/CopySettingGlobal.jsx";


// create a dialog box to ask what the user wants to do
var win = new Window("dialog", undefined, [0,0,605,220], );
sText = win.add( "statictext", [5,5,75,25], 'From:' );
fromProgram1 = win.add( "radiobutton", [5,35,205,55], 'QuarkXPress');
fromProgram2 = win.add( "radiobutton", [5,60,205,80], 'PageMaker 6.5');
sText = win.add( "statictext", [200,5,270,25], 'To:' );
toProgram1 = win.add( "radiobutton", [200,35,400,55], 'PNG Font' );
toProgram2 = win.add( "radiobutton", [200,60,400,80], 'Font Tools' );
sText = win.add( "statictext", [400,5,470,25], 'Side:' );
jobSide1 = win.add( "radiobutton", [400,40,600,60], 'Face' );
jobSide2 = win.add( "radiobutton", [400,65,600,85], 'Flap' );
sText = win.add( "statictext", [5,115,75,135], 'Need:' );
needsProof = win.add( "checkbox", [5,145,205,165], 'Proof Page' );
goButton = win.add( "button", [5,185,200,215], 'GO!' );
win.center();


// set the values when the button is clicked
goButton.onClick = function() {
                                    // make sure all choices are made
                                    if ( (fromProgram1.value || fromProgram2.value) &&
                                         (toProgram1.value || toProgram2.value) &&
                                         (jobSide1.value || jobSide2.value) ) {
                                            if (fromProgram1.value == true) CB.fromProgram = CB.Programs.QUARK;
                                            if (fromProgram2.value == true) CB.fromProgram = CB.Programs.PAGEMAKER;
                                            
                                            if (toProgram1.value == true) CB.toProgram = CB.Programs.PNGFONT;
                                            if (toProgram2.value == true) CB.toProgram = CB.Programs.FONTTOOLS;
                                            
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
                                        else if (!(toProgram1.value || toProgram2.value)) {
                                            alert("You must choose a program you're going to");
                                        }
                                        else {
                                            alert("You must chose a job side");
                                        }
                                    }
}


win.show();


// if we end up here without the proper items chosen, the user X-ited the window, so do nothing
if ( (fromProgram1.value || fromProgram2.value) && (toProgram1.value || toProgram2.value) && (jobSide1.value || jobSide2.value) ) {

    // from Quark
    if (CB.fromProgram == CB.Programs.QUARK) {

        // going to PNG Font
        if (CB.toProgram == CB.Programs.PNGFONT) {
            // face side or flap side is already set in the button press listener above
            // both kinds of job use the same script which will check CB.jobSide for differences
            #include "/g/jdforsythe/Settings/Photoshop Scripts/QuarkColor.jsx"
        }

        // going to Font Tools
        else if (CB.toProgram == CB.Programs.FONTTOOLS) {
            #include "/g/jdforsythe/Settings/Photoshop Scripts/QuarkBW.jsx"
        }
            
    }

    // from PageMaker 6.5
    else if (CB.fromProgram == CB.Programs.PAGEMAKER) {
        
        // going to PNG Font
        if (CB.toProgram == CB.Programs.PNGFONT) {
            
        }

        // going to Font Tools
        else if (CB.toProgram == CB.Programs.FONTTOOLS) {
            
        }

    }


    // here need to add from png or font tools to proof
    
}

// else do nothing