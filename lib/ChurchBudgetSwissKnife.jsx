#target photoshop
ChurchBudgetSwissKnife = function() {

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
    
    this.ready = false;
    
    // private functions
    cTID = function(s) { return app.charIDToTypeID(s); };
    sTID = function(s) { return app.stringIDToTypeID(s); };
}





///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS /////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////


// resize image to a certain dpi (scale styles defaults to true)
ChurchBudgetSwissKnife.prototype.resizeToDPI = function(dpi, scaleStyles) {
    // default
    if (typeof scaleStyles === 'undefined') scaleStyles = true;
    
    var actDesc = new ActionDescriptor();
    actDesc.putUnitDouble(cTID('Rslt'), cTID('#Rsl'), dpi);
    actDesc.putBoolean(sTID("scaleStyles"), true);
    actDesc.putBoolean(cTID('CnsP'), true);
    actDesc.putEnumerated(cTID('Intr'), cTID('Intp'), cTID('Bcbc'));
    executeAction(sTID('imageSize'), actDesc, DialogModes.NO);
};

// rotate currect layer by number of degrees
ChurchBudgetSwissKnife.prototype.rotateByDegrees = function(deg) {
    var actDesc = new ActionDescriptor();
    var actRef = new ActionReference();
    actRef.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    actDesc.putReference(cTID('null'), actRef);
    actDesc.putUnitDouble(cTID('Angl'), cTID('#Ang'), deg);
    executeAction(cTID('Rtte'), actDesc, DialogModes.NO);
};

/////////////////////////////////////////////////////////////
// WORKING WITH SELECTIONS //////////////////////////////////
/////////////////////////////////////////////////////////////

// select all
ChurchBudgetSwissKnife.prototype.selectAll = function() {
    var actDesc = new ActionDescriptor();
    var actRef = new ActionReference();
    actRef.putProperty(cTID('Chnl'), sTID("selection"));
    actDesc.putReference(cTID('null'), actRef);
    actDesc.putEnumerated(cTID('T   '), cTID('Ordn'), cTID('Al  '));
    executeAction(cTID('setd'), actDesc, DialogModes.NO);
};

// select None
ChurchBudgetSwissKnife.prototype.selectNone = function() {
    var actDesc = new ActionDescriptor();
    var actRef = new ActionReference();
    actRef.putProperty(cTID('Chnl'), sTID("selection"));
    actDesc.putReference(cTID('null'), actRef);
    actDesc.putEnumerated(cTID('T   '), cTID('Ordn'), cTID('None'));
    executeAction(cTID('setd'), actDesc, DialogModes.NO);
};

// select rectangle
ChurchBudgetSwissKnife.prototype.selectRect = function(top, right, bottom, left, unit) {
    var actDesc = new ActionDescriptor();
    var actRef = new ActionReference();
    actRef.putProperty(cTID('Chnl'), sTID("selection"));
    actDesc.putReference(cTID('null'), actRef);
    var actDesc2 = new ActionDescriptor();
    actDesc2.putUnitDouble(cTID('Top '), cTID(unit), top);
    actDesc2.putUnitDouble(cTID('Rght'), cTID(unit), right);
    actDesc2.putUnitDouble(cTID('Btom'), cTID(unit), bottom);
    actDesc2.putUnitDouble(cTID('Left'), cTID(unit), left);
    actDesc.putObject(cTID('T   '), cTID('Rctn'), actDesc2);
    executeAction(cTID('setd'), actDesc, DialogModes.NO);
};


// Inverse selection
ChurchBudgetSwissKnife.prototype.invertSelection = function() {
    executeAction(cTID('Invs'), undefined, DialogModes.NO);
};

// Delete selection
ChurchBudgetSwissKnife.prototype.deleteSelection = function() {
    executeAction(cTID('Dlt '), undefined, DialogModes.NO);
};


/////////////////////////////////////////////////////////////
// WORKING WITH CLIPBOARD ///////////////////////////////////
/////////////////////////////////////////////////////////////

// Copy
ChurchBudgetSwissKnife.prototype.clipboardCopy = function() {
    executeAction(cTID('copy'), undefined, DialogModes.NO);
};

// cut
ChurchBudgetSwissKnife.prototype.clipboardCut = function() {
    executeAction(cTID('cut '), undefined, DialogModes.NO);
};

// Paste in place
ChurchBudgetSwissKnife.prototype.pasteInPlace = function() {
    var actDesc = new ActionDescriptor();
    actDesc.putBoolean(sTID("inPlace"), true);
    actDesc.putEnumerated(cTID('AntA'), cTID('Annt'), cTID('Anno'));
    executeAction(cTID('past'), actDesc, DialogModes.NO);
};




/////////////////////////////////////////////////////////////
// CLOSING / SAVING DOCUMENTS ///////////////////////////////
/////////////////////////////////////////////////////////////


// close without saving
ChurchBudgetSwissKnife.prototype.closeWithoutSaving = function() {
    var actDesc = new ActionDescriptor();
    actDesc.putEnumerated(cTID('Svng'), cTID('YsN '), cTID('N   '));
    executeAction(cTID('Cls '), actDesc, DialogModes.NO);
};


// Save as copy to c:\eps\dump\clipboard.png
ChurchBudgetSwissKnife.prototype.saveToClipboardPNG = function() {
    this.flattenImage();
    this.convertToRGB();
    this.saveAsCopyPNG(CLIPBOARDPNGPATH);
};

ChurchBudgetSwissKnife.prototype.saveAsCopyPNG = function(filePath) {
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
ChurchBudgetSwissKnife.prototype.flattenImage = function() {
    executeAction(sTID('flattenImage'), undefined, DialogModes.NO);
};

// set active layer



/////////////////////////////////////////////////////////////
// WORKING WITH TEMPLATES ///////////////////////////////////
/////////////////////////////////////////////////////////////


// open any document
ChurchBudgetSwissKnife.prototype.openDocument = function(filePath) {
    var actDesc = new ActionDescriptor();
    actDesc.putPath(cTID('null'), new File(filePath));
    executeAction(cTID('Opn '), actDesc, DialogModes.NO);
};

ChurchBudgetSwissKnife.prototype.openPNGTemplate = function() {
    this.openDocument(TEMPLATEBASEPATH + PNGTEMPLATE);
};

ChurchBudgetSwissKnife.prototype.openFontToolsTemplate = function() {
    this.openDocument(TEMPLATEBASEPATH + FNTTOOLSTEMPLATE);
};

// proof templates

ChurchBudgetSwissKnife.prototype.openProofTemplateBookletCover = function() {
    this.openDocument(TEMPLATEBASEPATH + PROOFTEMPLATEBOOKLETCOVER);
};

ChurchBudgetSwissKnife.prototype.openProofTemplateBooklet = function() {
    this.openDocument(TEMPLATEBASEPATH + PROOFTEMPLATEBOOKLET);
};

ChurchBudgetSwissKnife.prototype.openProofTemplateCarton = function() {
    this.openDocument(TEMPLATEBASEPATH + PROOFTEMPLATECARTON);
};

ChurchBudgetSwissKnife.prototype.openProofTemplateDollar = function() {
    this.openDocument(TEMPLATEBASEPATH + PROOFTEMPLATEDOLLAR);
};

ChurchBudgetSwissKnife.prototype.openProofTemplatePremier = function() {
    this.openDocument(TEMPLATEBASEPATH + PROOFTEMPLATEPREMIER);
};

ChurchBudgetSwissKnife.prototype.openProofTemplateMailback = function() {
    this.openDocument(TEMPLATEBASEPATH + PROOFTEMPLATEMAILBACK);
};

ChurchBudgetSwissKnife.prototype.openProofTemplateDollarMM = function() {
    this.openDocument(TEMPLATEBASEPATH + PROOFTEMPLATEDOLLARMM);
};




/////////////////////////////////////////////////////////////
// WORKING WITH ALIGNMENT ///////////////////////////////////
/////////////////////////////////////////////////////////////

// get the values needed to plug into the move function from human-readable measurements (px, mm, in, etc)
// remember that a translate starts from the center of the layer
// we need the dpi because if not in pixels, Photoshop uses #Rlt, relating the movement to a 72dpi image
ChurchBudgetSwissKnife.prototype.getTranslateValues = function(dpi, xMovement, yMovement, tUnit) {
    // if we didn't pass a required parameter, return an error
    if (typeof dpi === 'undefined') return {status: 1, message: 'getTranslateValues: Did not supply dpi'};
    else if (typeof xMovement === 'undefined') return {status: 1, message: 'getTranslateValues: Did not supply xMovement'};
    else if (typeof yMovement === 'undefined') return {status:1, message: 'getTranslateValues: Did not supply yMovement'};
    else if (typeof tUnit === 'undefined') return {status:1, message: 'getTranslateValues: Did not supply tUnit'};
    
    else {
        
        xTranslate = this.convertToPSUnits(dpi, xMovement, tUnit);
        yTranslate = this.convertToPSUnits(dpi, yMovement, tUnit);
        
        if (xTranslate.convertedUnit !== yTranslate.convertedUnit) return {status: 1, message: 'getTranslateValues: Did not get back same units from convertToPSUnits'};
        else return {tUnit: xTranslate.convertedUnit, xMovement: xTranslate.convertedValue, yMovement: yTranslate.convertedValue};
    }
};


// convert a number and a unit of measurement to the proper CTID() for the Photoshop grid
// on PS grid, use pixels (#Pxl) or relational-to-72dpi (#Rlt)
// returns an object {convertedValue, convertedUnit}
ChurchBudgetSwissKnife.prototype.convertToPSUnits = function(dpi, value, unit) {
    // if we didn't pass a required parameter, return an error
    if (typeof dpi === 'undefined') return {status: 1, message: 'convertToPSUnits: Did not supply dpi'};
    else if (typeof value === 'undefined') return {status: 1, message: 'convertToPSUnits: Did not supply value'};
    else if (typeof unit === 'undefined') return {status:1, message: 'convertToPSUnits: Did not supply unit'};
    
    else {
        
        // if it's in pixels, we don't need to do any math
        if (unit == "px" || unit == "pxs" || unit == "pixel" || unit == "pixels") {
            return {
                convertedValue: value,
                convertedUnit: '#Pxl'
            };
        }
    
        else {            
            // if we're in metric, convert to inches
            
            if (unit == "cm" || unit == "cms" || unit == "centimeter" || unit == "centimeters") {
                // convert centimeters to millimeters
                value *= 10;
                unit == "mm";
            }
        
            if (unit == "mm" || unit == "mms" || unit == "millimeter" || unit == "millimeters") {
                // convert to inches
                value *= (1/25.4);
                
                // divide by dpi/72 to get correct translation in inches
                value = value / (dpi / 72);
                unit = "in";
            }
        
            // by now all proper measurements should be in inches
            if (unit !== "in" && unit !== "ins" && unit !== "inch" && unit !== "inches") {
                // return error
                return {status: 1, message: 'convertToPSUnits: Did not supply a proper unit'};
            }
        
            else {
                return {
                    convertedValue: value,
                    convertedUnit: '#Rlt'
                };
            }
        }
    }
};

// move active layer
ChurchBudgetSwissKnife.prototype.moveActiveLayer = function(tUnit, xMovement, yMovement) {
    var actDesc = new ActionDescriptor();
    var actRef = new ActionReference();
    actRef.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    actDesc.putReference(cTID('null'), actRef);
    var actDesc2 = new ActionDescriptor();
    actDesc2.putUnitDouble(cTID('Hrzn'), cTID(tUnit), xMovement);
    actDesc2.putUnitDouble(cTID('Vrtc'), cTID(tUnit), yMovement);
    actDesc.putObject(cTID('T   '), cTID('Ofst'), actDesc2);
    executeAction(cTID('move'), actDesc, DialogModes.NO);
};





/////////////////////////////////////////////////////////////
// MISCELLANY ///////////////////////////////////////////////
/////////////////////////////////////////////////////////////


// Convert to RGB
ChurchBudgetSwissKnife.prototype.convertToRGB = function() {
    var actDesc = new ActionDescriptor();
    actDesc.putClass(cTID('T   '), sTID("RGBColorMode"));
    actDesc.putBoolean(cTID('Fltt'), true);
    actDesc.putBoolean(cTID('Rstr'), false);
    executeAction(sTID('convertMode'), actDesc, DialogModes.NO);
};

// Convert to grayscale
ChurchBudgetSwissKnife.prototype.convertToGrayscale = function() {
    var actDesc = new ActionDescriptor();
    actDesc.putClass(cTID('T   '), cTID('Grys'));
    executeAction(sTID('convertMode'), actDesc, DialogModes.NO);
};

// Bitmap with Diffusion dither
ChurchBudgetSwissKnife.prototype.convertToBitmapDiffusion = function() {
    // dpi = 299.998992919922 for font tools
    dpi = 299.998992919922;
    var actDesc1 = new ActionDescriptor();
    var actDesc2 = new ActionDescriptor();
    actDesc2.putUnitDouble(cTID('Rslt'), cTID('#Rsl'), dpi);
    actDesc2.putEnumerated(cTID('Mthd'), cTID('Mthd'), cTID('DfnD'));
    actDesc1.putObject(cTID('T   '), cTID('BtmM'), actDesc2);
    executeAction(sTID('convertMode'), actDesc1, DialogModes.NO);
};


// Fill with white
ChurchBudgetSwissKnife.prototype.fillWithWhite = function() {
    var actDesc = new ActionDescriptor();
    actDesc.putEnumerated(cTID('Usng'), cTID('FlCn'), cTID('Wht '));
    actDesc.putUnitDouble(cTID('Opct'), cTID('#Prc'), 100);
    actDesc.putEnumerated(cTID('Md  '), cTID('BlnM'), cTID('Nrml'));
    executeAction(cTID('Fl  '), actDesc, DialogModes.NO);
};


// accented edges (for black and white to font tools)
ChurchBudgetSwissKnife.prototype.accentedEdges = function() {
    var actDesc = new ActionDescriptor();
    actDesc.putEnumerated(cTID('GEfk'), cTID('GEft'), cTID('AccE'));
    actDesc.putInteger(cTID('EdgW'), 1);
    actDesc.putInteger(cTID('EdgB'), 10);
    actDesc.putInteger(cTID('Smth'), 1);
    executeAction(cTID('AccE'), actDesc, DialogModes.NO);
};


// need a better way to do this
// select marquee for folder number
ChurchBudgetSwissKnife.prototype.selectMarqueeForFolderNumber = function() {
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
ChurchBudgetSwissKnife.prototype.stopContinueDialog = function(message) {
    var actDesc = new ActionDescriptor();
    actDesc.putString(cTID('Msge'), message);
    actDesc.putBoolean(cTID('Cntn'), true);
    executeAction(cTID('Stop'), actDesc, DialogModes.ALL);
};

// non-modal (doesn't steal focus, allows interaction with the document) dialog
ChurchBudgetSwissKnife.prototype.nonModalDialog = function(title, message) {

    var bt = new BridgeTalk();
    bt.target = "photoshop";
    bt.message = "var w = new Window('palette', '" + title + "'); w.add('statictext', undefined, '" + message + "'); w.center(); w.show();";
    bt.send();


/*    var win, windowResource;
    
    windowResource = "palette { \
        orientation: 'column', \
        alignChildren: ['fill', 'top'],  \
        preferredSize:[300, 130], \
        text: '" + title + "',  \
        margins:15, \
        \
        bottomGroup: Group{ \
            continueButton: Button { text: 'Continue', properties:{name:'ok'}, size: [120,24], alignment:['right', 'center'] }, \
        }\
    }";
    
    win = new Window(windowResource);
     
    win.bottomGroup.continueButton.onClick = function() {
        this.ready = true;
        return win.close();
    };
     
    win.show();
*/
};

// generic information dialog
ChurchBudgetSwissKnife.prototype.informationDialog = function(message) {
    alert(message);
};

