#target photoshop

// resize the original TIFF printer image to 300dpi
CB.swissKnife.resizeToDPI(300);
CB.swissKnife.selectAll();
CB.swissKnife.clipboardCopy();
// return it to its original state
CB.swissKnife.Document().activeHistoryState = CB.swissKnife.Document().historyStates[0];

// open the PNG template and paste in place
CB.swissKnife.openPNGTemplate();
CB.swissKnife.pasteInPlace();

// move on the PNG template as if it were face side, even if it is flap side
// so flap shows up right on the proof sheet
if (CB.isQuark) {
    CB.swissKnife.moveQuarkColorFaceOnPNG();
    CB.swissKnife.clearQuarkFolderNumber();
}
else {
    CB.swissKnife.movePMColorFaceOnPNG();
    CB.swissKnife.clearPMFolderNumber();
}

// flatten the image, select all, copy
CB.swissKnife.flattenImage();
CB.swissKnife.selectAll();
CB.swissKnife.clipboardCopy();

// open the dollar proof template, paste, and move into place
if (!CB.isMM) CB.swissKnife.openProofTemplateDollar();
else CB.swissKnife.openProofTemplateDollarMM();

CB.swissKnife.pasteInPlace();
CB.swissKnife.movePNGOnDollarProof();

// select the envelope, invert, and clear around it
CB.swissKnife.selectDollarProofBorder();
CB.swissKnife.invertSelection();
CB.swissKnife.deleteSelection();
CB.swissKnife.selectNone();

// now run the proper proofing script for getting date/number/addressing/advertising
if (!CB.isMM) {
    #include "/g/jdforsythe/Settings/Photoshop Scripts/Dollar_Proof_CB.jsx";
}

else {
    #include "/g/jdforsythe/Settings/Photoshop Scripts/Dollar_Proof_MM.jsx";
}

// print proofs
#include "/g/jdforsythe/Settings/Photoshop Scripts/global/Print_Proof.jsx";

// close the proof document
CB.swissKnife.closeWithoutSaving();

// close the PNG template
CB.swissKnife.closeWithoutSaving();