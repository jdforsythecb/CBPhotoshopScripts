#target photoshop

#include "/g/jdforsythe/Settings/Photoshop Scripts/lib/ChurchBudgetSwissKnife.jsx"

// include the library to copy text to the clipboard
#include '/g/jdforsythe/Settings/Photoshop Scripts/lib/copyTextToClipboard.jsx'

// include the library of utils for user-inputted folder number strings
#include '/g/jdforsythe/Settings/Photoshop Scripts/lib/folderNumberStringUtils.jsx'

// create the universal global object if it doesn't exist
var CB = CB || {};

// get the folder-font code from user input
userInputFolder = prompt ("Enter the folder number", "A-0101", "Enter the folder number");

// create an instance of the folderNumberStringUtils object with the user-inputted folder string
FolderUtils = new folderNumberStringUtils(userInputFolder);

// save company globally
CB.isMM = FolderUtils.isMM;
CB.isCB = FolderUtils.isCB;
CB.isMcDaniel = FolderUtils.isMCD;
CB.isUnited = FolderUtils.isUN;

// copy the sanitized folder number to the clipboard
CB.folder = FolderUtils.folder;
clip = copyTextToClipboard(CB.folder);
if (clip.status == 1) {
    alert("Failed to copy the folder number to the clipboard! Error: " + clip.message);
}


// create an instance of the swiss knife object
QuarkColorFace = new ChurchBudgetSwissKnife(); /*ChurchBudgetSwissKnife.Programs.QUARK,
                                            ChurchBudgetSwissKnife.JobSizes.DOLLAR,
                                            ChurchBudgetSwissKnife.Formats.QUARKCOLORTIFFPRINTER);*/
                                            
                                            
/**********************************************
    CUSTOM METHODS ON THE SWISS KNIFE OBJECT
 **********************************************/

// add a custom method for the translation needed from Quark+TIFF Printer Color to PNG
QuarkColorFace.moveQuarkColorFaceOnPNG = function() {
    // x=50px y=-220px (recorded in an action)
    translation = this.getTranslateValues(300, 50, -220, "px");
    this.moveActiveLayer(translation.tUnit, translation.xMovement, translation.yMovement);
};

// add a custom method for the translation needed from PNG onto a Dollar proof
QuarkColorFace.movePNGOnDollarProof = function() {
    // x=-9.6 y=77.76 (relational to 72dpi, as recorded in an action)
    translation = this.getTranslateValues(72, -9.6, 77.76, "in");
    this.moveActiveLayer(translation.tUnit, translation.xMovement, translation.yMovement);
};

// add a custom method to select the exact border around an envelope on the dollar proof
QuarkColorFace.selectDollarProofBorder = function() {
    // top, right, bottom, left, unit
    // 263.28, 30.24, 482.4, 489.36 (relational to 72dpi, as recorded in an action)
    this.selectRect(263.28, 489.36, 482.4, 30.24, "#Rlt");
    /*
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Chnl'), sTID("selection"));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putUnitDouble(cTID('Top '), cTID('#Rlt'), 263.28);
    desc2.putUnitDouble(cTID('Left'), cTID('#Rlt'), 30.24);
    desc2.putUnitDouble(cTID('Btom'), cTID('#Rlt'), 482.4);
    desc2.putUnitDouble(cTID('Rght'), cTID('#Rlt'), 489.36);
    desc1.putObject(cTID('T   '), cTID('Rctn'), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
    */
};

                                            
// set the image to 300dpi since the color tiff printer is 600dpi
QuarkColorFace.resizeToDPI(300);

// select all, copy, and close the document
QuarkColorFace.selectAll();
QuarkColorFace.clipboardCopy();
QuarkColorFace.closeWithoutSaving();

// open the PNG Full Color Template
QuarkColorFace.openPNGTemplate();

// paste in place
QuarkColorFace.pasteInPlace();

// move layer to proper position
QuarkColorFace.moveQuarkColorFaceOnPNG();

// janky....
// set select and fill with white to remove folder number that printed from Quark
QuarkColorFace.selectMarqueeForFolderNumber();
QuarkColorFace.fillWithWhite();

// flatten
QuarkColorFace.flattenImage();

// save to clipboard.png
QuarkColorFace.saveToClipboardPNG();

// open PNG Font and show a stop/continue dialog
#include "/g/jdforsythe/Settings/Photoshop Scripts/Open_PNG_Font.jsx"

// select all and copy
QuarkColorFace.selectAll();
QuarkColorFace.clipboardCopy();

// open the dollar proof template
QuarkColorFace.openProofTemplateDollar();

// paste in place
QuarkColorFace.pasteInPlace();

// move to proper position
QuarkColorFace.movePNGOnDollarProof();

// select the envelope, invert, and delete the surrounding pixels
QuarkColorFace.selectDollarProofBorder();
QuarkColorFace.invertSelection();
QuarkColorFace.deleteSelection();

// select none
QuarkColorFace.selectNone();

// now run the proofing script for the dollar size
if (CB.isMM) {
    // #include "/g/jdforsythe/Settings/Photoshop Scripts/Dollar_Proof_MM.jsx"
}

else {
    #include "/g/jdforsythe/Settings/Photoshop Scripts/Dollar_Proof_CB.jsx"
}


// if they wanted a proof
if (CB.needProof) {
    // run the dollar proof print script
    if (CB.isMM) {
        // #include "/g/jdforsythe/Settings/Photoshop Scripts/Print_Dollar_Proof_MM.jsx"
    }

    else {
        #include "/g/jdforsythe/Settings/Photoshop Scripts/Print_Dollar_Proof_CB.jsx"
    }
}