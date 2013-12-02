#target photoshop

// booleans for jobSide
CB.isFace = (CB.jobSide == CB.JobSides.FACE);
CB.isFlap = (CB.jobSide == CB.JobSides.FLAP);                                            
                                            
/**********************************************
    CUSTOM METHODS ON THE SWISS KNIFE OBJECT
 **********************************************/

// add a custom method for the translation needed from Quark+TIFF Printer Color to PNG Face side
CB.swissKnife.moveQuarkBWOnFontTools = function() {
    // x=40px y=80px (recorded in an action)
    translation = this.getTranslateValues(300, 40, 80, "px");
    this.moveActiveLayer(translation.tUnit, translation.xMovement, translation.yMovement);
};

// add a custom method for the translation needed from PNG onto a Dollar proof for face side
CB.swissKnife.movePNGOnDollarProof = function() {
    // x=-9.6 y=77.76 (relational to 72dpi, as recorded in an action)
    translation = this.getTranslateValues(72, -9.6, 77.76, "in");
    this.moveActiveLayer(translation.tUnit, translation.xMovement, translation.yMovement);
};


// add a custom method to select the exact border around an envelope on the dollar proof
CB.swissKnife.selectDollarProofBorder = function() {
    // top, right, bottom, left, unit
    // 263.28, 30.24, 482.4, 489.36 (relational to 72dpi, as recorded in an action)
    this.selectRect(263.28, 489.36, 482.4, 30.24, "#Rlt");
};

                                            












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



CB.swissKnife.stopContinueDialog("test");



/*
// save to clipboard.png
CB.swissKnife.saveToClipboardPNG();

// open PNG Font
#include "/g/jdforsythe/Settings/Photoshop Scripts/Open_PNG_Font.jsx"

CB.swissKnife.informationDialog("Save into PNG Font and then continue");


/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
// how to stop and continue here?
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// only if a proof is needed
/////////////////////////////////////////////////////////////////////////////////////////////////////////
if (CB.needProof) {

if (CB.isFlap) {
        // for flap side, we want to close the PNG template after we're done
        // so we can copy from the original document (saving us from un-doing the flap flipping)
        CB.swissKnife.closeWithoutSaving();
        // then we paste back on the PNG Template and move it as if it were a face side
        CB.swissKnife.selectAll();
        CB.swissKnife.clipboardCopy();
        CB.swissKnife.closeWithoutSaving();
        CB.swissKnife.openPNGTemplate();
        CB.swissKnife.pasteInPlace();
        CB.swissKnife.moveQuarkColorFaceOnPNG();
        CB.swissKnife.flattenImage();
    }


    // select all and copy
    CB.swissKnife.selectAll();
    CB.swissKnife.clipboardCopy();

    // open the dollar proof template
    CB.swissKnife.openProofTemplateDollar();

    // paste in place
    CB.swissKnife.pasteInPlace();
    

    // move to proper position for face side
    CB.swissKnife.movePNGOnDollarProof();

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

// else we don't need a proof, so just continue with cleanup

// if this was a face job, close PNG template
// if flap job, close original document
CB.swissKnife.closeWithoutSaving();
*/