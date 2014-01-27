#target photoshop
ChurchBudgetSwissKnife = function() {

    // private constants
    TEMPLATEBASEPATH = "/g/jdforsythe/Templates/Photoshop/";
    CLIPBOARDPNGPATH = "/c/eps/dump/clipboard.png";
    
    PNGTEMPLATE = "PNG Template.tif";
    FNTTOOLSTEMPLATE = "Font Tools Template.psd";
    
    STRIPINTEMPLATE = "Dollar Addressed Stripins.psd";
    
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


// a document object that always contains the ACTIVE document
//
// you use this just like a property that you'd store but it's a method returning the object, so, internally, e.g:
// this.Document().selection.selectAll()
// always selects all on the current active document, regardless of when this SwissKnife was instantiated
ChurchBudgetSwissKnife.prototype.Document = function() {
    return app.activeDocument;
};

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
    /*var actDesc = new ActionDescriptor();
    var actRef = new ActionReference();
    actRef.putProperty(cTID('Chnl'), sTID("selection"));
    actDesc.putReference(cTID('null'), actRef);
    actDesc.putEnumerated(cTID('T   '), cTID('Ordn'), cTID('Al  '));
    executeAction(cTID('setd'), actDesc, DialogModes.NO);
    */
    this.Document().selection.selectAll();
};

// select None
ChurchBudgetSwissKnife.prototype.selectNone = function() {
    /*var actDesc = new ActionDescriptor();
    var actRef = new ActionReference();
    actRef.putProperty(cTID('Chnl'), sTID("selection"));
    actDesc.putReference(cTID('null'), actRef);
    actDesc.putEnumerated(cTID('T   '), cTID('Ordn'), cTID('None'));
    executeAction(cTID('setd'), actDesc, DialogModes.NO);
    */
    this.Document().selection.deselect();
};

// select rectangle
// this actionDescriptor method is useful for easily recording a select and inputting
// the values from the action into this method. for (x,y) bounds use
// this.Document().selection.select(bounds)
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



// Save current selection
// addToSaved: whether to add selection we're saving to the already saved selection selectNum
//              if false (default) it replaces the selection given by selectNum
//              or if false and selectNum is not passed, it creates a new selection
ChurchBudgetSwissKnife.prototype.saveSelection = function(addToSaved, selectNum) {
    // defaults
    addToSaved = typeof addToSaved !== 'undefined' ? addToSaved : false; // default to false
    selectNum = typeof selectNum !== 'undefined' ? selectNum : null; // default to null

    // we're going to store total number of saved selections - we'll name selections by an index
    // as if they're in an array, so this stores our total number for max checking
    if (typeof this.savedSelections === 'undefined') {
        this.savedSelections = -1;
    }
    
    // we just want to abstractly use
    // a number in our scripts to refer to a selection, so we'll name the
    // channel what its array index is, in string form
    
    if (addToSaved === true) {
        
        if ((selectNum === null) || isNaN(selectNum) || (selectNum >= this.savedSelections)) {
            // error if adding and number isn't set, or number isn't a number, or number is larger than the array of selections
        }
    
        else {
            // want to add to the current selection to the saved selection
            selType = SelectionType.EXTEND;
        }
    }

    // replace selection
    else {
        if (selectNum === null) {
            // create a new selection in storage
            // increment the counter
            this.savedSelections++;
            selectNum = this.savedSelections;
            selType = SelectionType.REPLACE;
        }
    
        else if (isNaN(selectNum) || (selectNum >= this.savedSelections)) {
            // error - if we passed nothing, we'd create a new selection above
            // if we pass something but it's not a number, that's an error
            // or if the number we pass is larger than the array of selections
        }
    
        else {
            // replace what we passed
            selType = SelectionType.REPLACE;
        }
    }


    // errors don't stop this from processing, although we aren't catching errors anyway so...
    // well the if undef does...
    
    // now save the selection to the document's channels
    if (typeof selType !== 'undefined') {
        
        // this is hacky but I don't think there's another way to do it...
        // we have to store which channels are visible before we start
        // since there may already be a selection channel - then we restore these to visible later
        var visChans = [];
        for (i=0; i<this.Document().channels.length; i++) {
            if (this.Document().channels[i].visible === true) {
                visChans.push(this.Document().channels[i].name);
            }
        }
    
        // and save which channels are selected for restoring later because photoshop
        // will select the new selection channel after we create it
        var selChans = this.Document().activeChannels;
    
        // create the new selection channel - setting visible to false here doesn't work?
        var channel = this.Document().channels.add();
        channel.name = selectNum.toString();
        channel.kind = ChannelType.SELECTEDAREA;
        // channel.visible = false;
                            
        this.Document().selection.store(channel, SelectionType.REPLACE);
        
        // show all the other layers that were visible before (that photoshop hides for some unknown reason)
        for (i=0; i<visChans.length; i++) {
            this.Document().channels.getByName(visChans[i]).visible = true;
        }
    
        // make the selection layer hidden
        this.Document().channels.getByName(selectNum.toString()).visible = false;
        
        // restore the originally selected channels
        this.Document().activeChannels = selChans;

    }

    // and return the number of the selection we stored to the script
    return selectNum;
    
};



// loads a previously-saved selection by index
// index: the index number of the selection to load
// additive: whether to add the loaded selection to the current selection (false=replace)
// loadInverted: whether to load the inverse of the saved selection
ChurchBudgetSwissKnife.prototype.loadSelection = function(index, additive, loadInverted) {
    // defaults
    index = typeof index !== 'undefined' ? index : 0; // default to 0 - i.e. load the only selection
    additive = typeof additive !== 'undefined' ? additive : false; // default to not additive
    loadInverted = typeof loadInverted !== 'undefined' ? loadInverted : false; // default to not inverted
    
    
    
    if (additive === false) {
        additive = SelectionType.REPLACE;
    }
    else {
        additive = SelectionType.EXTEND;
    }

    this.Document().selection.load(this.Document().channels.getByName(index.toString()), additive, loadInverted);
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
    this.Document().close(SaveOptions.DONOTSAVECHANGES);
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
    //executeAction(sTID('flattenImage'), undefined, DialogModes.NO);
    this.Document().flatten();
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

ChurchBudgetSwissKnife.prototype.openStripinTemplate = function() {
    this.openDocument(TEMPLATEBASEPATH + STRIPINTEMPLATE);
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
    /*
    var actDesc = new ActionDescriptor();
    actDesc.putClass(cTID('T   '), cTID('Grys'));
    executeAction(sTID('convertMode'), actDesc, DialogModes.NO);
    */
    this.Document().changeMode(ChangeMode.GRAYSCALE);
};

// convert to bitmap, generic
ChurchBudgetSwissKnife.prototype.convertToBitmap = function(dpi, method) {
    switch (method) {
        case "diffusion":
            method = BitmapConversionType.DIFFUSIONDITHER;
            break;
        case "threshold":
            method = BitmapConversionType.HALFTHRESHOLD;
            break;
    }
    bitmapSaveOptions = new BitmapConversionOptions();
    bitmapSaveOptions.method = method;
    bitmapSaveOptions.resolution = dpi;
    this.Document().changeMode(ChangeMode.BITMAP, bitmapSaveOptions);
};

// Bitmap with Diffusion dither
ChurchBudgetSwissKnife.prototype.convertToBitmapDiffusion = function() {
    // dpi = 299.998992919922 for font tools
    dpi = 299.998992919922;
    method = "diffusion";
    this.convertToBitmap(dpi, method);
};

// bitmap with 50% threshold
ChurchBudgetSwissKnife.prototype.convertToBitmapThreshold = function() {
    dpi = 299.998992919922;
    method = "threshold";
    this.convertToBitmap(dpi, method);
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


// function to stringify an object, since Adobe javascript doesn't include the JSON library to use JSON.stringify()
ChurchBudgetSwissKnife.prototype.objectToString = function(obj) {
    str = "{";
    
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + ":" + obj[p] + ',';
        }
    }
    // after we're done making the string it will look like:
    // key1: value1,
    // key2: value2,
    // key3: value3,
    //
    // so we need to remove the last , then add the final }
    return str.slice(0, str.length-1) + "}";
};




/********************************************************************************************** CHURCH BUDGET ******
********************************************************************************************************************
********************************************************************************************************************/
// Quark + Color TIFF Printer (ImagePrinter Pro) + Face Side >> PNG Font Template
ChurchBudgetSwissKnife.prototype.moveQuarkColorFaceOnPNG = function() {
    // x=50px y=-220px (recorded in an action)
    translation = this.getTranslateValues(300, 50, -220, "px");
    this.moveActiveLayer(translation.tUnit, translation.xMovement, translation.yMovement);
};

// Quark + Color TIFF Printer (ImagePrinter Pro) + Flap Side >> PNG Font Template
ChurchBudgetSwissKnife.prototype.moveQuarkColorFlapOnPNG = function() {
    // x=-36px, y=530px
    translation = this.getTranslateValues(300, -36, 530, "px");
    this.moveActiveLayer(translation.tUnit, translation.xMovement, translation.yMovement);
};

// Quark + BW TIFF Printer (ImagePrinter Pro) + any job side >> Font Tools Template
ChurchBudgetSwissKnife.prototype.moveQuarkBWOnFontTools = function() {
    // x=40px y=80px (recorded in an action)
    translation = this.getTranslateValues(300, 40, 80, "px");
    this.moveActiveLayer(translation.tUnit, translation.xMovement, translation.yMovement);
};

// Quark + BW TIFF Printer (ImagePrinter Pro) + any job side >> Dollar Proof
ChurchBudgetSwissKnife.prototype.moveQuarkBWOnDollarProof = function() {
    // x=-5px y=114px
    translation = this.getTranslateValues(300, -5, 114, "px");
    this.moveActiveLayer(translation.tUnit, translation.xMovement, translation.yMovement);
};

// PNG Font Template - flip the flap to the top for flap side jobs
ChurchBudgetSwissKnife.prototype.flipFlapOnPNGCB = function() {
    // select the flap area at the bottom of the template, cut and paste again (in place) as a new layer
    //this.selectRect(1868, 2148, 2072, 177, "#Pxl");
    this.selectFlap();
    this.clipboardCut();
    this.pasteInPlace();
        // translation for moving the flap (x=0, y=-1862px)
    translation = this.getTranslateValues(300, 0, -1862, "px");
    this.moveActiveLayer(translation.tUnit, translation.xMovement, translation.yMovement);
};


/*********************************************************************************************** MONTHLY MAIL ******
********************************************************************************************************************
********************************************************************************************************************/

// PageMaker + Color TIFF Printer (ImagePrinter Pro) + Face Side >> PNG Font Template
ChurchBudgetSwissKnife.prototype.movePMColorFaceOnPNG = function() {
    // x=-1px, y=-286px
    // -286px was the original. dialed it in with commit "focus buttons" to -300px
    // now changing it to -272px to fix proof issue
    translation = this.getTranslateValues(300, -1, -272, "px");
    this.moveActiveLayer(translation.tUnit, translation.xMovement, translation.yMovement);
};

// PageMaker + Color TIFF Printer (ImagePrinter Pro) + Flap Side >> PNG Font Template
ChurchBudgetSwissKnife.prototype.movePMColorFlapOnPNG = function() {
    // x=0px, y=630px
    translation = this.getTranslateValues(300, 0, 595, "px");
    this.moveActiveLayer(translation.tUnit, translation.xMovement, translation.yMovement);
};

// PageMaker + BW TIFF Printer (ImagePrinter Pro) + any job side >> Font Tools Template
ChurchBudgetSwissKnife.prototype.movePMBWOnFontTools = function() {
    // x=-2px y=2px (recorded in an action)
    translation = this.getTranslateValues(300, -2, 2, "px");
    this.moveActiveLayer(translation.tUnit, translation.xMovement, translation.yMovement);
};

// PageMaker + BW TIFF Printer (ImagePrinter Pro) + any job side >> Dollar Proof
ChurchBudgetSwissKnife.prototype.movePMBWOnDollarProof = function() {
    // x=-40px y=60px
    translation = this.getTranslateValues(300, -40, 60, "px");
    this.moveActiveLayer(translation.tUnit, translation.xMovement, translation.yMovement);
};

// PNG Font Template - flip the flap to the top for flap side jobs
ChurchBudgetSwissKnife.prototype.flipFlapOnPNGMM = function() {
    // select the flap area at the bottom of the template, cut and paste again (in place) as a new layer
    //this.selectRect(1868, 2148, 2072, 177, "#Pxl");
    this.selectFlap();
    this.clipboardCut();
    this.pasteInPlace();
        // translation for moving the flap (x=0, y=-1862px)
    translation = this.getTranslateValues(300, 0, -1800, "px");
    this.moveActiveLayer(translation.tUnit, translation.xMovement, translation.yMovement);
};


/********************************************************************************************** BOTH SIDES *********
********************************************************************************************************************
********************************************************************************************************************/
/*
// PNG Font Template - flip the flap to the top for flap side jobs
ChurchBudgetSwissKnife.prototype.flipFlapOnPNG = function() {
    // select the flap area at the bottom of the template, cut and paste again (in place) as a new layer
    //this.selectRect(1868, 2148, 2072, 177, "#Pxl");
    this.selectFlap();
    this.clipboardCut();
    this.pasteInPlace();
        // translation for moving the flap (x=0, y=-1862px)
    translation = this.getTranslateValues(300, 0, -1800, "px");
    this.moveActiveLayer(translation.tUnit, translation.xMovement, translation.yMovement);
};
*/

// PNG Font Template (face side area) >> Dollar Proof Template
ChurchBudgetSwissKnife.prototype.movePNGOnDollarProof = function() {
    // x=-9.6 y=77.76 (relational to 72dpi, as recorded in an action)
    translation = this.getTranslateValues(72, -9.6, 77.76, "in");
    this.moveActiveLayer(translation.tUnit, translation.xMovement, translation.yMovement);
};

// select the area containing the envelope on Dollar Proof Template (for inverting and clearing around it)
ChurchBudgetSwissKnife.prototype.selectDollarProofBorder = function() {
    // top, right, bottom, left, unit
    // 263.28, 30.24, 482.4, 489.36 (relational to 72dpi, as recorded in an action)
    this.selectRect(263.28, 489.36, 482.4, 30.24, "#Rlt");
};


ChurchBudgetSwissKnife.prototype.selectFlap = function() {
    var actDesc = new ActionDescriptor();
    var actRef = new ActionReference();
    actRef.putProperty( cTID("Chnl"), cTID("fsel") );
    actDesc.putReference( cTID("null"), actRef );
    
    var actRef2 = new ActionReference();
    actRef2.putName( cTID( "Path" ), "flap" );
    actDesc.putReference( cTID( "T   " ), actRef2 );
    actDesc.putInteger( cTID("Vrsn"), 1 );
    actDesc.putBoolean( sTID( "vectorMaskParams" ), true );
    executeAction( cTID("setd"), actDesc, DialogModes.NO );
};








/*******************************************************************************************JANKY AS HELL **********
********************************************************************************************************************
********************************************************************************************************************/



ChurchBudgetSwissKnife.prototype.clearQuarkFolderNumber = function() {
    CB.swissKnife.selectMarqueeForFolderNumber();
    CB.swissKnife.fillWithWhite();
};

ChurchBudgetSwissKnife.prototype.clearPMFolderNumber = function() {
    CB.swissKnife.selectRect(304, 2070, 1180, 275, "#Pxl");
    CB.swissKnife.invertSelection();
    CB.swissKnife.fillWithWhite();
    CB.swissKnife.selectNone();
};
