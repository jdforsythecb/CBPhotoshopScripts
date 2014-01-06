#target photoshop

var CB = {};

// import swiss knife
#include "/g/jdforsythe/Settings/Photoshop Scripts/lib/ChurchBudgetSwissKnife.jsx"

// create an instance of the swiss knife object
CB.swissKnife = new ChurchBudgetSwissKnife();

// get the stripin text
stripinText = prompt ("Enter the strip-in", "Special Offering", "Enter the strip-in");

// change the text to match the stripin
CB.swissKnife.Document().layers.getByName("STRIPIN").textItem.contents = stripinText;

// flatten
CB.swissKnife.flattenImage();

// copy to clipboard.png and close without saving
CB.swissKnife.saveToClipboardPNG();
CB.swissKnife.closeWithoutSaving();


