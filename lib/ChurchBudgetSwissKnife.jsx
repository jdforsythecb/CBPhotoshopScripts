
ChurchBudgetSwissKnife = function(fromProgram, jobSize, format) {
    this.fromProgram = fromProgram;
    this.jobSize = jobSize;
    this.format = format;

    // private constants
    TEMPLATEBASEPATH = "/g/jdforsythe/Templates/Photoshop/";
    CLIPBOARDPNGPATH = "/c/eps/dump/clipboard.png";
    
    PNGTEMPLATE = "Full Color Template.tif";
    FNTTOOLSTEMPLATE = "Font Tools Template.psd";
    
    PROOFTEMPLATEBOOKLETCOVER = "Proof Template Book Cover.psd";
    PROOFTEMPLATEBOOKLET = "Proof Template Booklet.psd";
    PROOFTEMPLATECARTON = "Proof Template Carton.psd";
    PROOFTEMPLATEDOLLAR = "Proof Template Dollar New.psd";
    PROOFTEMPLATEPREMIER = "Proof Template Premier.psd";
    PROOFTEMPLATEMAILBACK = "Proof Template Mailback.psd";
    PROOFTEMPLATEDOLLARMM = "Proof Template Dollar MM.psd";
    
    // private functions
    cTID = function(s) { return app.charIDToTypeID(s); };
    sTID = function(s) { return app.stringIDToTypeID(s); };
}


///////////////////////////////////////////////////////////////////////////////////////
// ENUMS //////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

// an enum-like object listing all programs
ChurchBudgetSwissKnife.prototype.Programs = {
    QUARK: 0,
    PAGEMAKER: 1,
    INDESIGN: 2,
    PHOTOSHOP: 3,
    PNGFONT: 4,
    FONTTOOLS: 5
};

// an enum-like object listing the job sizes
ChurchBudgetSwissKnife.prototype.JobSizes = {
    DOLLAR: 0,
    PREMIER: 1,
    BOOKLET: 2,
    CARTON: 3,
    COVER: 4,
    MAILBACK: 5,
    NUM10: 6
};

// an enum-like object listing all formats a document could be in
ChurchBudgetSwissKnife.prototype.Formats = {
    QUARKCOLORTIFFPRINTER: 0,
    QUARKBWTIFFPRINTER: 1,
    PMPORTRAITCOLORTIFFPRINTER: 2,
    PMPORTRAITBWTIFFPRINTER: 3,
    PMLANDSCAPECOLORTIFFPRINTER: 4,
    PMLANDSCAPEBWTIFFPRINTER: 5
};
    


///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS /////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
    
    
// Image Size from TIFF Color ImagePrinterPro is 600dpi, resize to 300dpi
ChurchBudgetSwissKnife.prototype.resizeTo300dpi() = function() {
    var actDesc = new ActionDescriptor();
    actDesc.putUnitDouble(cTID('Rslt'), cTID('#Rsl'), 300);
    actDesc.putBoolean(sTID("scaleStyles"), true);
    actDesc.putBoolean(cTID('CnsP'), true);
    actDesc.putEnumerated(cTID('Intr'), cTID('Intp'), cTID('Bcbc'));
    executeAction(sTID('imageSize'), actDesc, DialogModes.NO);
};


/////////////////////////////////////////////////////////////
// WORKING WITH SELECTIONS //////////////////////////////////
/////////////////////////////////////////////////////////////

// select all
ChurchBudgetSwissKnife.prototype.selectAll() = function() {
    var actDesc = new ActionDescriptor();
    var actRef = new ActionReference();
    actRef.putProperty(cTID('Chnl'), sTID("selection"));
    actDesc.putReference(cTID('null'), actRef);
    actDesc.putEnumerated(cTID('T   '), cTID('Ordn'), cTID('Al  '));
    executeAction(cTID('setd'), actDesc, DialogModes.NO);
};

// select None
ChurchBudgetSwissKnife.prototype.selectNone() = function() {
    var actDesc = new ActionDescriptor();
    var actRef = new ActionReference();
    actRef.putProperty(cTID('Chnl'), sTID("selection"));
    actDesc.putReference(cTID('null'), actRef);
    actDesc.putEnumerated(cTID('T   '), cTID('Ordn'), cTID('None'));
    executeAction(cTID('setd'), actDesc, DialogModes.NO);
};


// Inverse selection
ChurchBudgetSwissKnife.prototype.invertSelection() = function() {
    executeAction(cTID('Invs'), undefined, DialogModes.NO);
};

// Delete selection
ChurchBudgetSwissKnife.prototype.deleteSelection() = function() {
    executeAction(cTID('Dlt '), undefined, DialogModes.NO);
};


// select the area containing the envelope on dollar proof
ChurchBudgetSwissKnife.prototype.selectDollarProofBorder() = function() {
    var actDesc = new ActionDescriptor();
    var actRef = new ActionReference();
    actRef.putProperty(cTID('Chnl'), sTID("selection"));
    actDesc.putReference(cTID('null'), actRef);
    var actDesc2 = new ActionDescriptor();
    actDesc2.putUnitDouble(cTID('Top '), cTID('#Rlt'), 263.28);
    actDesc2.putUnitDouble(cTID('Left'), cTID('#Rlt'), 30.24);
    actDesc2.putUnitDouble(cTID('Btom'), cTID('#Rlt'), 482.4);
    actDesc2.putUnitDouble(cTID('Rght'), cTID('#Rlt'), 489.36);
    actDesc.putObject(cTID('T   '), cTID('Rctn'), actDesc2);
    executeAction(cTID('setd'), actDesc, DialogModes.NO);
};


/////////////////////////////////////////////////////////////
// WORKING WITH CLIPBOARD ///////////////////////////////////
/////////////////////////////////////////////////////////////

// Copy
ChurchBudgetSwissKnife.prototype.clipboardCopy() = function() {
    executeAction(cTID('copy'), undefined, DialogModes.NO);
};

// Paste in place
ChurchBudgetSwissKnife.prototype.pasteInPlace() = function() {
    var actDesc = new ActionDescriptor();
    actDesc.putBoolean(sTID("inPlace"), true);
    actDesc.putEnumerated(cTID('AntA'), cTID('Annt'), cTID('Anno'));
    executeAction(cTID('past'), actDesc, DialogModes.NO);
};




/////////////////////////////////////////////////////////////
// CLOSING / SAVING DOCUMENTS ///////////////////////////////
/////////////////////////////////////////////////////////////


// close without saving
ChurchBudgetSwissKnife.prototype.closeWithoutSaving() = function() {
    var actDesc = new ActionDescriptor();
    actDesc.putEnumerated(cTID('Svng'), cTID('YsN '), cTID('N   '));
    executeAction(cTID('Cls '), actDesc, DialogModes.NO);
};


// Save as copy to c:\eps\dump\clipboard.png
ChurchBudgetSwissKnife.prototype.saveToClipboardPNG() = function() {
    this.flatten();
    this.convertToRGB();
    this.saveAsCopyPNG(CLIPBOARDPNGPATH);
};

ChurchBudgetSwissKnife.prototype.saveAsCopyPNG(filePath) = function() {
    var actDesc = new ActionDescriptor();
    var actDesc2 = new ActionDescriptor();
    actDesc2.putEnumerated(sTID("PNGInterlaceType"), sTID("PNGInterlaceType"), sTID("PNGInterlaceNone"));
    actDesc2.putEnumerated(sTID("PNGFilter"), sTID("PNGFilter"), sTID("PNGFilterAdaptive"));
    actDesc.putObject(cTID('As  '), sTID("PNGFormat"), actDesc2);
    actDesc.putPath(cTID('In  '), new File(filePath));
    actDesc.putBoolean(cTID('Cpy '), true);
    executeAction(cTID('save'), actDesc, DialogModes.NO);
};




/////////////////////////////////////////////////////////////
// WORKING WITH LAYERS //////////////////////////////////////
/////////////////////////////////////////////////////////////

// Flatten Image
ChurchBudgetSwissKnife.prototype.flattenImage() = function() {
    executeAction(sTID('flattenImage'), undefined, DialogModes.NO);
};

// set active layer



/////////////////////////////////////////////////////////////
// WORKING WITH TEMPLATES ///////////////////////////////////
/////////////////////////////////////////////////////////////


// open any document
ChurchBudgetSwissKnife.prototype.openDocument(filePath) = function() {
    var actDesc = new ActionDescriptor();
    actDesc.putPath(cTID('null'), new File(filePath));
    executeAction(cTID('Opn '), actDesc, DialogModes.NO);
};

ChurchBudgetSwissKnife.prototype.openPNGTemplate() = function() {
    this.openDocument(TEMPLATEBASEPATH + PNGTEMPLATE);
};

ChurchBudgetSwissKnife.prototype.openFontToolsTemplate() = function() {
    this.openDocument(TEMPLATEBASEPATH + FNTTOOLSTEMPLATE);
};

// proof templates

ChurchBudgetSwissKnife.prototype.openProofTemplateBookletCover() = function() {
    this.openDocument(TEMPLATEBASEPATH + PROOFTEMPLATEBOOKLETCOVER);
};

ChurchBudgetSwissKnife.prototype.openProofTemplateBooklet() = function() {
    this.openDocument(TEMPLATEBASEPATH + PROOFTEMPLATEBOOKLET);
};

ChurchBudgetSwissKnife.prototype.openProofTemplateCarton() = function() {
    this.openDocument(TEMPLATEBASEPATH + PROOFTEMPLATECARTON);
};

ChurchBudgetSwissKnife.prototype.openProofTemplateDollar() = function() {
    this.openDocument(TEMPLATEBASEPATH + PROOFTEMPLATEDOLLAR);
};

ChurchBudgetSwissKnife.prototype.openProofTemplatePremier() = function() {
    this.openDocument(TEMPLATEBASEPATH + PROOFTEMPLATEPREMIER);
};

ChurchBudgetSwissKnife.prototype.openProofTemplateMailback() = function() {
    this.openDocument(TEMPLATEBASEPATH + PROOFTEMPLATEMAILBACK);
};

ChurchBudgetSwissKnife.prototype.openProofTemplateDollarMM() = function() {
    this.openDocument(TEMPLATEBASEPATH + PROOFTEMPLATEDOLLARMM);
};




/////////////////////////////////////////////////////////////
// WORKING WITH ALIGNMENT ///////////////////////////////////
/////////////////////////////////////////////////////////////

// move active layer
ChurchBudgetSwissKnife.prototype.moveActiveLayer = function(hunit, horizontal, vunit, vertical) {
    var actDesc = new ActionDescriptor();
    var actRef = new ActionReference();
    actRef.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    actDesc.putReference(cTID('null'), actRef);
    var actDesc2 = new ActionDescriptor();
    actDesc2.putUnitDouble(cTID('Hrzn'), cTID(hunit), horizontal);
    actDesc2.putUnitDouble(cTID('Vrtc'), cTID(vunit), vertical);
    actDesc.putObject(cTID('T   '), cTID('Ofst'), actDesc2);
    executeAction(cTID('move'), actDesc, DialogModes.NO);
};

// Move Quark Color Face on Full Color Template (PNG)
ChurchBudgetSwissKnife.prototype.moveQuarkColorFaceOnPNG() = function() {
    // horizontal = 50 px
    // vertical = -220 px
    this.moveActiveLayer("#Pxl", 50, "#Pxl", -220);
};

// Move PNG on Dollar Proof
ChurchBudgetSwissKnife.prototype.movePNGOnDollarProof() = function() {
    // horizontal = -9.6 mm
    // vertical = 77.76 mm
    this.moveActiveLayer("#Rlt", -9.6, "#Rlt", 77.76);
};



/////////////////////////////////////////////////////////////
// MISCELLANY ///////////////////////////////////////////////
/////////////////////////////////////////////////////////////


// Convert to RGB
ChurchBudgetSwissKnife.prototype.convertToRGB() = function() {
    var actDesc = new ActionDescriptor();
    actDesc.putClass(cTID('T   '), sTID("RGBColorMode"));
    actDesc.putBoolean(cTID('Fltt'), true);
    actDesc.putBoolean(cTID('Rstr'), false);
    executeAction(sTID('convertMode'), actDesc, DialogModes.NO);
};


// Fill with white
ChurchBudgetSwissKnife.prototype.fillWithWhite() = function() {
    var actDesc = new ActionDescriptor();
    actDesc.putEnumerated(cTID('Usng'), cTID('FlCn'), cTID('Wht '));
    actDesc.putUnitDouble(cTID('Opct'), cTID('#Prc'), 100);
    actDesc.putEnumerated(cTID('Md  '), cTID('BlnM'), cTID('Nrml'));
    executeAction(cTID('Fl  '), actDesc, DialogModes.NO);
};


// need a better way to do this
// select marquee for folder number
ChurchBudgetSwissKnife.prototype.selectMarqueeForFolderNumber() = function() {
    var actDesc = new ActionDescriptor();
    var actRef = new ActionReference();
    actRef.putProperty(cTID('Chnl'), sTID("selection"));
    actDesc.putReference(cTID('null'), actRef);
    var actDesc2 = new ActionDescriptor();
    actDesc2.putUnitDouble(cTID('Top '), cTID('#Pxl'), 176);
    actDesc2.putUnitDouble(cTID('Left'), cTID('#Pxl'), 293);
    actDesc2.putUnitDouble(cTID('Btom'), cTID('#Pxl'), 258);
    actDesc2.putUnitDouble(cTID('Rght'), cTID('#Pxl'), 2148);
    actDesc.putObject(cTID('T   '), cTID('Rctn'), actDesc2);
    executeAction(cTID('setd'), actDesc, DialogModes.NO);
};





// stop and continue dialog
ChurchBudgetSwissKnife.prototype.stopContinueDialog(message) = function() {
    var actDesc = new ActionDescriptor();
    actDesc.putString(cTID('Msge'), message);
    actDesc.putBoolean(cTID('Cntn'), true);
    executeAction(cTID('Stop'), actDesc, DialogModes.NO);
};












/*

function() {
  step1();      // Image Size
  step2();      // Set
  step3();      // Copy
  step4();      // Close
  step5();      // Open
  step6();      // Paste
  step7();      // Move
  step8();      // Set
  step9();      // Fill
  step10();      // Set
  step11();      // Flatten Image
  step12();      // Convert Mode
  step13();      // Save
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
};
*/