#target photoshop

/* what we get passed from CopySetting_Dollar.jsx.doCopySettingMonochrome()
CB = {}
CB.isMM
CB.isCB
CB.isMcDaniel
CB.isUnited
CB.folder
CB.fontCode
CB.isFlap
*/

/* debugging 
CB = {};
CB.isMM = false;
CB.isCB = true;
CB.isMcDaniel = false;
CB.isUnited = false;
CB.folder = "A0101";
CB.fontCode = "A";
CB.isFlap = false;
 */

// we need a swiss knife instance
#include "/g/jdforsythe/Settings/Photoshop Scripts/lib/ChurchBudgetSwissKnife.jsx"
CB.swissKnife = new ChurchBudgetSwissKnife();

// there should be a marquee around what the user wants to protect
// invert selection and run accented edges
CB.swissKnife.invertSelection();
CB.swissKnife.accentedEdges();
CB.swissKnife.selectNone();

// convert to grayscale, then bitmap with diffusion dither
CB.swissKnife.convertToGrayscale();
CB.swissKnife.convertToBitmapDiffusion();

/*
// copy the sanitized folder number to the clipboard (folder is passed in from previous script, PMBWMM.jsx)

// include the library to copy text to the clipboard
#include '/g/jdforsythe/Settings/Photoshop Scripts/lib/copyTextToClipboard.jsx'

// we need the folder number with any letters lowercase for Font Tools
clip = copyTextToClipboard(CB.folder.toLowerCase());
if (clip.status == 1) {
    alert("Failed to copy the folder number to the clipboard! Error: " + clip.message);
}


// open font tools
#include "/g/jdforsythe/Settings/Photoshop Scripts/Open_Font_Tools.jsx"



message = "When Font Tools opens, press \"New Font\" and CTRL+V to paste in the folder number.\n \
           Then come back and press \"Ok\" to copy the image";

CB.swissKnife.informationDialog(message);

*/
// open font tools
#include "/g/jdforsythe/Settings/Photoshop Scripts/Open_Font_Tools.jsx"

// select all, copy, and open font tools for updating/inserting
CB.swissKnife.selectAll();
CB.swissKnife.clipboardCopy();

message = "Add or update the proper font code.\n\n \
           Then come back and press \"Ok\"";

CB.swissKnife.informationDialog(message);

// now that the user has saved into Font Tools, go ahead and close the font tools template
CB.swissKnife.closeWithoutSaving();
