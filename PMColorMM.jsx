#target photoshop

// booleans for jobSide
CB.isFace = (CB.jobSide == CB.JobSides.FACE);
CB.isFlap = (CB.jobSide == CB.JobSides.FLAP);                                            
                                            
/**********************************************
    CUSTOM METHODS ON THE SWISS KNIFE OBJECT
 **********************************************/

// add a custom method for the translation needed from Quark+TIFF Printer Color to PNG Face side
CB.swissKnife.movePMColorFaceOnPNG = function() {
    // x=-1px, y=-286px
    translation = this.getTranslateValues(300, -1, -286, "px");
    this.moveActiveLayer(translation.tUnit, translation.xMovement, translation.yMovement);
};

// add a custom method for the translation needed from PNG onto a Dollar proof for face side
CB.swissKnife.movePNGOnDollarProof = function() {
    // x=-9.6 y=77.76 (relational to 72dpi, as recorded in an action)
    translation = this.getTranslateValues(72, -9.6, 77.76, "in");
    this.moveActiveLayer(translation.tUnit, translation.xMovement, translation.yMovement);
};


// add a custom method for the translation needed from Quark+TIFF Printer Color to PNG flap side
CB.swissKnife.movePMColorFlapOnPNG = function() {
    // x=-36px, y=530px
    translation = this.getTranslateValues(300, -36, 530, "px");
    this.moveActiveLayer(translation.tUnit, translation.xMovement, translation.yMovement);
};

// add a custom method for flipping the flap to the top on PNG template
CB.swissKnife.flipFlapOnPNG = function() {
    this.selectRect(1868, 2148, 2072, 177, "#Pxl"); // select the flap area at the bottom
    this.clipboardCut();
    this.pasteInPlace();
    
    // translation for moving the flap (x=0, y=-1862px)
    translation = this.getTranslateValues(300, 0, -1862, "px");
    this.moveActiveLayer(translation.tUnit, translation.xMovement, translation.yMovement);
};


// add a custom method to select the exact border around an envelope on the dollar proof
CB.swissKnife.selectDollarProofBorder = function() {
    // top, right, bottom, left, unit
    // 263.28, 30.24, 482.4, 489.36 (relational to 72dpi, as recorded in an action)
    this.selectRect(263.28, 489.36, 482.4, 30.24, "#Rlt");
};

                                            
// set the image to 300dpi since the color tiff printer is 600dpi
CB.swissKnife.resizeToDPI(300);

// select all, copy
CB.swissKnife.selectAll();
CB.swissKnife.clipboardCopy();

/********************
    FACE SIDE ONLY
 ********************/
// we close the original document on face side, but we need it later on flap side
// so we can put it on the proof without undo-ing flipping the flap
if (CB.isFace) CB.swissKnife.closeWithoutSaving();
/************************
    END FACE SIDE ONLY
 ************************/


// open the PNG Full Color Template
CB.swissKnife.openPNGTemplate();

// paste in place
CB.swissKnife.pasteInPlace();



/********************
    FACE SIDE ONLY
 ********************/

if (CB.isFace) {
    // move layer to proper position for face side job
    CB.swissKnife.movePMColorFaceOnPNG();

    // janky....
    // set select about half of the border and remove the outer pixels
    CB.swissKnife.selectRect(304, 2070, 1180, 275, "#Pxl");
    CB.swissKnife.invertSelection();
    CB.swissKnife.fillWithWhite();
    CB.swissKnife.selectNone();
}

/************************
    END FACE SIDE ONLY
 ************************/


/********************
    FLAP SIDE ONLY
 ********************/
else if (CB.isFlap) {
    CB.swissKnife.rotateByDegrees(180);
    CB.swissKnife.movePMColorFlapOnPNG();
    CB.swissKnife.flipFlapOnPNG();
}

/************************
    END FLAP SIDE ONLY
 ************************/




// flatten
CB.swissKnife.flattenImage();

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
    
    /********************
        FLAP SIDE ONLY
     ********************/
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
        CB.swissKnife.movePMColorFaceOnPNG();
        CB.swissKnife.selectRect(304, 2070, 1180, 275, "#Pxl");
        CB.swissKnife.selectInverse();
        CB.swissKnife.fillWithWhite();
        CB.swissKnife.selectNone();
        CB.swissKnife.flattenImage();
    }

    /************************
        END FLAP SIDE ONLY
     ************************/

    // select all and copy
    CB.swissKnife.selectAll();
    CB.swissKnife.clipboardCopy();

    // open the dollar proof template
    CB.swissKnife.openProofTemplateDollarMM();

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
        #include "/g/jdforsythe/Settings/Photoshop Scripts/Dollar_Proof_MM.jsx"
        #include "/g/jdforsythe/Settings/Photoshop Scripts/Print_Dollar_Proof_MM.jsx"
    }

    else {
        // #include "/g/jdforsythe/Settings/Photoshop Scripts/Dollar_Proof_CB.jsx"
        // #include "/g/jdforsythe/Settings/Photoshop Scripts/Print_Dollar_Proof_CB.jsx"
    }

    // close proof document
    CB.swissKnife.closeWithoutSaving();
}

// else we don't need a proof, so just continue with cleanup

// if this was a face job, close PNG template
// if flap job, close original document
CB.swissKnife.closeWithoutSaving();