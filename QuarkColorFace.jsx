#target photoshop

#include "/g/jdforsythe/Settings/Photoshop Scripts/lib/ChurchBudgetSwissKnife.jsx"

// include the library to copy text to the clipboard
#include '/g/jdforsythe/Settings/Photoshop Scripts/lib/copyTextToClipboard.jsx'

// include the library of utils for user-inputted folder number strings
#include '/g/jdforsythe/Settings/Photoshop Scripts/lib/folderNumberStringUtils.jsx'

// get the folder-font code from user input
userInputFolder = prompt ("Enter the folder/font code", "A-0101 A", "Enter the folder/font code");

// create an instance of the folderNumberStringUtils object with the user-inputted folder string
folderUtils = new folderNumberStringUtils(My.folder);

// tell it to auto-set its company type
folderUtils.setCurrentCompany();

// get the sanitized, deciphered folder number and copy it to the clipboard
folderNumber = folderUtils.decipherString();


// create an instance of the swiss knife object
QuarkColorFace = new ChurchBudgetSwissKnife(ChurchBudgetSwissKnife.Programs.QUARK,
                                            ChurchBudgetSwissKnife.JobSizes.DOLLAR,
                                            ChurchBudgetSwissKnife.Formats.QUARKCOLORTIFFPRINTER);
                                            
// set the image to 300dpi since the color tiff printer is 600dpi
QuarkColorFace.resizeTo300dpi();

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
QuarkColorFace.flatten();

// save to clipboard.png
QuarkColorFace.saveToClipboardPNG();

// open PNG Font and show a stop/continue dialog
#include "/g/jdforsythe/Settings/Photoshop Scripts/Open_PNG_Font.jsx"
QuarkColorFace.stopContinueDialog("Go to PNG Font and load from clipboard to save the font, then come back and continue for your proof sheet");


/*

  step14();      // Scripts
  step15(true, true, "Go to PNGFont and load from clipboard to save the font, then come back and continue for your proof sheet");      // Stop
  step16();      // Flatten Image
  step17();      // Set
  step18();      // Copy
  step19();      // Open
  step20();      // Paste
  step21();      // Move
  step22();      // Set
  step23();      // Inverse
  step24();      // Delete
  step25();      // Set
  step26();      // Scripts
  step27(true, true, "If everything looks okay on the proof, continue to print proof and clean sheet, and save PDF of proof");      // Stop
  step28();      // Scripts
  */