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
 */

// we need a swiss knife instance if it's not yet defined
if (typeof CB.swissKnife === 'undefined') {
    #include "/g/jdforsythe/Settings/Photoshop Scripts/lib/ChurchBudgetSwissKnife.jsx"
    CB.swissKnife = new ChurchBudgetSwissKnife();
}



// if there's an image we need to work with
if (CB.hasImage) {
    // the user has a marquee around the image

    // the best way to deal with a gradiated, greyscale image seems to be to
    // diffusion dither and copy the image, then undo and threshold dither
    // for the text, and past the diffusion'd image on top
    
    // first we need to save the select, because after we convert to a bitmap
    // the selection would disappear
    savedSel = CB.swissKnife.saveSelection();

    // convert to grayscale
    CB.swissKnife.convertToGrayscale();

    // save the history state, because we need to come back here in a minute
    var savedState = CB.swissKnife.Document().activeHistoryState;
    
    // diffusion dither
    CB.swissKnife.convertToBitmapDiffusion();
    
    // copy the entire document into clipboard
    CB.swissKnife.selectAll();
    CB.swissKnife.clipboardCopy();
    
    // undo changes back to original document
    CB.swissKnife.Document().activeHistoryState = savedState;
    
    // now paste the diffusion'd image in place
    CB.swissKnife.pasteInPlace();
    
    // load the selection (selection, not-additive, yes-inverse)
    CB.swissKnife.loadSelection(savedSel, false, true);
    
    // delete the inversed selection, leaving only the diffusion'd image
    CB.swissKnife.deleteSelection();
    
    // flatten image
    CB.swissKnife.flattenImage();
    
    // now do a 50% threshold bitmap on the image to make the text nice(-ish)
    CB.swissKnife.convertToBitmapThreshold();
}

// otherwise the copy is just text
else {
    // convert to grayscale
    CB.swissKnife.convertToGrayscale();

    // if it is text only, do 50% threshold bitmap
    CB.swissKnife.convertToBitmapThreshold();
    
}

// create the argument object for FontTools
if (CB.jobSize == CB.swissKnife.JobSizes.DOLLAR) {
    FontToolsArgs = { folder: CB.folder };
}
else if (CB.jobSize == CB.swissKnife.JobSizes.PREMIER) {
    FontToolsArgs = { folder: ("p" + CB.folder) };
}

// open font tools
#include "/g/jdforsythe/Settings/Photoshop Scripts/Open_Font_Tools.jsx"

// flatten, select all, copy, and open font tools for updating/inserting
CB.swissKnife.flattenImage();
CB.swissKnife.selectAll();
CB.swissKnife.clipboardCopy();

message = "Add or update the proper font code.\n\n \
           Then come back and press \"Ok\"";

CB.swissKnife.informationDialog(message);

// now that the user has saved into Font Tools, go ahead and close the font tools template
CB.swissKnife.closeWithoutSaving();
