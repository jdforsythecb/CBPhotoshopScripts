#target photoshop

// booleans for jobSide
CB.isFace = (CB.jobSide == CB.JobSides.FACE);
CB.isFlap = (CB.jobSide == CB.JobSides.FLAP);                                            
                                            
/**********************************************
    CUSTOM METHODS ON THE SWISS KNIFE OBJECT
 **********************************************/

// add a custom method for the translation needed from Quark+TIFF Printer BW to Font Tools
CB.swissKnife.moveQuarkBWOnFontTools = function() {
    // x=40px y=80px (recorded in an action)
    translation = this.getTranslateValues(300, 40, 80, "px");
    this.moveActiveLayer(translation.tUnit, translation.xMovement, translation.yMovement);
};

// add a custom method for the translation needed from Quark onto a Dollar proof for B&W
CB.swissKnife.moveQuarkBWOnDollarProof = function() {
    // x=-5px y=114px
    translation = this.getTranslateValues(300, -5, 114, "px");
    this.moveActiveLayer(translation.tUnit, translation.xMovement, translation.yMovement);
};


// add a custom method to select the exact border around an envelope on the dollar proof
CB.swissKnife.selectDollarProofBorder = function() {
    // top, right, bottom, left, unit
    // 263.28, 30.24, 482.4, 489.36 (relational to 72dpi, as recorded in an action)
    this.selectRect(263.28, 489.36, 482.4, 30.24, "#Rlt");
};

// open font tools early because it takes awhile
#include "/g/jdforsythe/Settings/Photoshop Scripts/Open_Font_Tools.jsx"

// on Black and white we have to first do the proof, if needed because of the poor state
// of non-modal dialogs (can't pass an object - CB - to the later functions)

if (CB.needProof) {
    
    // select all, copy
    CB.swissKnife.selectAll();
    CB.swissKnife.clipboardCopy();


    // select all and copy
    CB.swissKnife.selectAll();
    CB.swissKnife.clipboardCopy();

    // open the dollar proof template
    CB.swissKnife.openProofTemplateDollar();

    // paste in place
    CB.swissKnife.pasteInPlace();
    

    // move to proper position
    CB.swissKnife.moveQuarkBWOnDollarProof();

    // select the envelope, invert, and delete the surrounding pixels
    CB.swissKnife.selectDollarProofBorder();
    CB.swissKnife.invertSelection();
    CB.swissKnife.deleteSelection();

    // select none
    CB.swissKnife.selectNone();
 

    // now run the proofing script for the dollar size
    if (CB.isMM) {
        // #include "/g/jdforsythe/Settings/Photoshop Scripts/Dollar_Proof_MM.jsx"
        // #include "/g/jdforsythe/Settings/Photoshop Scripts/Print_Dollar_Proof_MM.jsx"
    }

    else {
        #include "/g/jdforsythe/Settings/Photoshop Scripts/Dollar_Proof_CB.jsx"
        #include "/g/jdforsythe/Settings/Photoshop Scripts/Print_Dollar_Proof_CB.jsx"
    }

    // close proof document
    CB.swissKnife.closeWithoutSaving();
}




// else we don't need a proof, so just continue with going into font tools



// select all, copy
CB.swissKnife.selectAll();
CB.swissKnife.clipboardCopy();

// open the Font Tools template
CB.swissKnife.openFontToolsTemplate();

// paste in place
CB.swissKnife.pasteInPlace();

// move layer to proper position
CB.swissKnife.moveQuarkBWOnFontTools();

// flatten
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
    bt.body = "var w = new Window('palette', '" + title + "', [0, 0, 400, 100]); \
                    w.add('statictext', [5,5,390,50], '" + message + "'); \
                    okButton = w.add('button', [5,40,205,90], 'GO!'); \
                    w.center(); \
                    okButton.onClick = function() { \
                        w.close(); \
                        var folder = \"" + CB.folder + "\"; \
                        fontCode = \"" + CB.fontCode + "\"; \
                        #include \"/g/jdforsythe/Settings/Photoshop Scripts/QuarkBW_after_dialog.jsx\"; \
                    }; \
                    w.show();";
    bt.send();

// execution will continue after the pallete window is displayed
// so we must do nothing here and only when the user clicks the continue button
// in the palette window above, load another script to continue the execution of Quark BW images