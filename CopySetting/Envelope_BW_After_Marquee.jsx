#target photoshop

/* what we get passed from CopySetting_Dollar.jsx.doCopySettingMonochrome()
CB = {}
CB.isMM
CB.isCB
CB.isMcDaniel
CB.isUnited
CB.folder
CB.prettyFolder
CB.fontCode
CB.isFlap
CB.hasImage
CB.jobSize
*/

/* debugging 
CB = {};
CB.isMM = false;
CB.isCB = true;
CB.isMcDaniel = false;
CB.isUnited = false;
CB.folder = "A0101";
CB.prettyFolder = "A-0101";
CB.fontCode = "A";
CB.isFlap = false;
CB.hasImage = true;
CB.jobSize = CB.JobSizes.DOLLAR;
 */

// we need a swiss knife instance if it's not yet defined
if (typeof CB.swissKnife === 'undefined') {
    #include "/g/jdforsythe/Settings/Photoshop Scripts/lib/ChurchBudgetSwissKnife.jsx"
    CB.swissKnife = new ChurchBudgetSwissKnife();
}

// this needs to be improved - find some way to diffusion dither where they marquee
// then paste that back on the original and threshhold bitmap it
if (CB.hasImage) {
    // there should be a marquee around what the user wants to protect
    // invert selection and run accented edges
    CB.swissKnife.invertSelection();
    CB.swissKnife.accentedEdges();
    CB.swissKnife.selectNone();
}

// convert to grayscale, then bitmap with diffusion dither
CB.swissKnife.convertToGrayscale();

// if it has an image, do diffusion dither bitmap
if (CB.hasImage) CB.swissKnife.convertToBitmapDiffusion();
// if it is text only, do 50% threshold bitmap
else CB.swissKnife.convertToBitmapThreshold();

// create the argument object for FontTools
if (CB.jobSize == CB.JobSizes.DOLLAR) {
    FontToolsArgs = { folder: CB.folder };
}
else if (CB.jobSize == CB.JobSizes.PREMIER) {
    FontToolsArgs = { folder: ("p" + CB.folder) };
}

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
