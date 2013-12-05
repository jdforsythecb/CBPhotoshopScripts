#target photoshop
var CB = {};

//alert("Folder: " + folder + " font: " + fontCode);

#include "/g/jdforsythe/Settings/Photoshop Scripts/lib/ChurchBudgetSwissKnife.jsx"

// create an instance of the swiss knife object
CB.swissKnife = new ChurchBudgetSwissKnife();


// at this point the user will have selected any images they need to protect


// invert selection and run accented edges
CB.swissKnife.invertSelection();

CB.swissKnife.accentedEdges();

// select none
CB.swissKnife.selectNone();

// convert to grayscale first
CB.swissKnife.convertToGrayscale();

// then bitmap with diffusion dither
CB.swissKnife.convertToBitmapDiffusion();

// copy the sanitized folder number to the clipboard (folder is passed in from previous script, PMBWMM.jsx)

// include the library to copy text to the clipboard
#include '/g/jdforsythe/Settings/Photoshop Scripts/lib/copyTextToClipboard.jsx'

clip = copyTextToClipboard(folder);
if (clip.status == 1) {
    alert("Failed to copy the folder number to the clipboard! Error: " + clip.message);
}


// open font tools
#include "/g/jdforsythe/Settings/Photoshop Scripts/Open_Font_Tools.jsx"



message = "When Font Tools opens, press \"New Font\" and CTRL+V to paste in the folder number.\n \
           Then come back and press \"Ok\" to copy the image";

CB.swissKnife.informationDialog(message);


// select all, copy, and open font tools for updating/inserting
CB.swissKnife.selectAll();
CB.swissKnife.clipboardCopy();

message = "Add or update the proper font code.\n\n \
           Then come back and press \"Ok\"";

CB.swissKnife.informationDialog(message);


// close font tools template
CB.swissKnife.closeWithoutSaving();

// close original document
//CB.swissKnife.closeWithoutSaving();

// undo the resize to 300dpi
CB.swissKnife.Document().activeHistoryState = CB.swissKnife.Document().historyStates[0];

// if not flap
if (!isFlap) {
    CB.jobSide = CB.JobSides.FACE;
}
else {
    CB.jobSide = CB.JobSides.FLAP;
}

/* 0, -305px fnt tools to png
// cheating
var cont = true;
#include "/g/jdforsythe/Settings/Photoshop Scripts/CopySetting_Dollar_MM.jsx"

*/