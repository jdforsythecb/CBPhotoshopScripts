#target photoshop

var CB = {};

// import swiss knife
#include "/g/jdforsythe/Settings/Photoshop Scripts/lib/ChurchBudgetSwissKnife.jsx"

// create an instance of the swiss knife object
CB.swissKnife = new ChurchBudgetSwissKnife();

// get the stripin text
stripinText = prompt ("Enter the strip-in", "Special Offering", "Enter the strip-in");

// open the template
//CB.swissKnife.openStripinTemplate();

// change the text to match the stripin
CB.swissKnife.Document().layers.getByName("STRIPIN").textItem.contents = stripinText;

// flatten
CB.swissKnife.flattenImage();

// convert to bitmap with 50% threshold
CB.swissKnife.convertToBitmapThreshold();

// select all, copy, and close without saving
CB.swissKnife.selectAll();
CB.swissKnife.clipboardCopy();
CB.swissKnife.closeWithoutSaving();


