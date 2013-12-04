#target photoshop

// top-most script in the Copy setting hierarchy - creates the global object
// and initializes with the needed properties

// create the universal global object if it doesn't exist
var CB = CB || {};

///////////////////////////////////////////////////////////////////////////////////////
// ENUMS //////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

// an enum-like object listing all programs
CB.Programs = {
    QUARK: 0,
    PAGEMAKER: 1,
    INDESIGN: 2,
    PHOTOSHOP: 3,
    PNGFONT: 4,
    FONTTOOLS: 5
};

// an enum-like object listing the job sizes
CB.JobSizes = {
    DOLLAR: 0,
    PREMIER: 1,
    BOOKLET: 2,
    CARTON: 3,
    COVER: 4,
    MAILBACK: 5,
    NUM10: 6
};

// an enum-like object listing all formats a document could be in
CB.Formats = {
    QUARKCOLORTIFFPRINTER: 0,
    QUARKBWTIFFPRINTER: 1,
    PMPORTRAITCOLORTIFFPRINTER: 2,
    PMPORTRAITBWTIFFPRINTER: 3,
    PMLANDSCAPECOLORTIFFPRINTER: 4,
    PMLANDSCAPEBWTIFFPRINTER: 5
};

// an enum-like object listing job sides (face/flap)
CB.JobSides = {
    FACE: 0,
    FLAP: 1
};






// things we're always going to need:


/* for future reference
// include the library to copy text to the clipboard
#include '/g/jdforsythe/Settings/Photoshop Scripts/lib/copyTextToClipboard.jsx'
*/


// include the library of utils for user-inputted folder number strings
#include '/g/jdforsythe/Settings/Photoshop Scripts/lib/folderNumberStringUtils.jsx'


// get the folder number from user input
userInputFolder = prompt ("Enter the folder number", "A-0101", "Enter the folder number");

// get the font code from user input
CB.fontCode = prompt ("Enter the font code", "A", "Enter the font code");


// create an instance of the folderNumberStringUtils object with the user-inputted folder string
FolderUtils = new folderNumberStringUtils(userInputFolder);

// save company globally
CB.isMM = FolderUtils.isMM;
CB.isCB = FolderUtils.isCB;
CB.isMcDaniel = FolderUtils.isMCD;
CB.isUnited = FolderUtils.isUN;

/**************************
   for future reference
**************************
// copy the sanitized folder number to the clipboard
CB.folder = FolderUtils.folder;
clip = copyTextToClipboard(CB.folder);
if (clip.status == 1) {
    alert("Failed to copy the folder number to the clipboard! Error: " + clip.message);
}
*/


// and we're always going to need an instance of the swiss knife to do manipulations on the documents

#include "/g/jdforsythe/Settings/Photoshop Scripts/lib/ChurchBudgetSwissKnife.jsx"

// create an instance of the swiss knife object
CB.swissKnife = new ChurchBudgetSwissKnife();
