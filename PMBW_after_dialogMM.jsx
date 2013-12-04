#target photoshop
var CB = {};


#include "/g/jdforsythe/Settings/Photoshop Scripts/lib/ChurchBudgetSwissKnife.jsx"

// create an instance of the swiss knife object
CB.swissKnife = new ChurchBudgetSwissKnife();


// at this point the user will have selected any images they need to protect


// invert selection and run accented edges
//CB.swissKnife.invertSelection();
/*
CB.swissKnife.accentedEdges();

// select none
CB.swissKnife.selectNone();
*/
// convert to grayscale first
CB.swissKnife.convertToGrayscale();

// then bitmap with diffusion dither
CB.swissKnife.convertToBitmapDiffusion();

// select all, copy, and open font tools for updating/inserting
CB.swissKnife.selectAll();
CB.swissKnife.clipboardCopy();

// font tools should already be open from previously

CB.swissKnife.informationDialog("Save into Font Tools and then continue");

// close font tools template
CB.swissKnife.closeWithoutSaving();

// close original document
CB.swissKnife.closeWithoutSaving();
