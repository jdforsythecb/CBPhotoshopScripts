// chooses which script(s) to run to complete the copy process for dollar size envelopes
#target photoshop

// top-most script in the Copy setting hierarchy - creates the global object
// and initializes with the needed properties

// if we've hard-coded this as a monthly mail computer running it
if (typeof hardCodedMM === 'undefined') hardCodedMM = false;

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

// an enum-like object listing the job color types
CB.ColorTypes = {
    FULLCOLOR: 0,
    MONOCHROME: 1
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




















// and we're always going to need an instance of the swiss knife to do manipulations on the documents
//#include "/g/jdforsythe/Settings/Photoshop Scripts/lib/ChurchBudgetSwissKnife.jsxbin"
/**********************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    CHURCH BUDGET SWISS KNIFE
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************/
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

/**********************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    END CHURCH BUDGET SWISS KNIFE
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************/












/**********************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    INCLUDE PS_JSX_EXEC
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************/
/////////////////
// CONSTRUCTOR //
/////////////////
Exec = function(app){

    // file object for the application we're executing
    this.app = app;

    // we need to create a temporary batch file so we can execute a program
    // with command-line options, so we'll store it in the temp directory
    // (and delete it when we're done)
    this.tmp = Folder.temp;
};


////////////////
// PROPERTIES //
////////////////

Exec.extension = (isWindows() ? ".bat" : ".sh");

// support for bash (Mac or via cygwin)
Exec.bashApp = (isWindows() && !Exec.macTest ?
                "c:\\cygwin\bin\\bash" : "/bin/bash");


Exec.macScript = (isWindows() ?
                "/c/cygwin/tmp/psjs-exec.sh" : "/tmp/psjs-exec.sh");
                
Exec.macExecWrapper = app.path + "/Presets/Scripts/run-psjs-exec" + Exec.ext;



/////////////
// METHODS //
/////////////

// take array of arguments and return an command-line string for the batch file
Exec.prototype.toCommandStr = function(args) {
    var str = 'START "" /B '; // don't bring up a terminal window, run in the background

    if (this.app) {
        // surround the path (in the batch file) with double-quotes to prevent
        // problems with spaces in the path
        str += '\"' + this.app.fsName + '\"';
    }

    if (args) {
        // if a file or folder object was passed in, convert it to an array of one
        if (args instanceof File || args instanceof Folder) {
            args = ['\"' + args+ '\"'];
        }

        // if it's an array, append it to the command (could use Array.join)
        if (args.constructor == Array) {
            for (var i = 0; i < args.length; i++) {
                str += ' ' + args[i];
            }
        }

        else {
            // if it's something else (like a pre-built command string), just append it
            str += ' ' + args.toString();
        }
    }

    return str;
};

// get a time-coded batch file name (to prevent problems from multiple instances)
Exec.prototype.getBatName = function() {
    
    if (isMac()) {
        return Exec.macScript;
    }

    var nm = '';
    var ts = new Date().getTime();

    if (this.app) {
        nm = this.tmp + '/' + this.app.name + '-' + ts + ".bat";
    }
    else {
        nm = this.tmp + "/exec-" + ts + ".bat";
    }
    return nm;
};

// quick method to execute a command (probably system commands) without an instance
// and get the output back from stdio - obviously must be synchronous
Exec.prototype.getOutput = function(cmd, timeout, folder, keepBatchFile) {
    this.log("Exec.getOutput(\"" + cmd + "\", " + timeout + ");");
    
    // if this is a Mac, run that version of the method instead
    if (isMac()) {
        return Exec.getOutputMac(cmd, timeout, folder, keepBatchFile);
    }
    
    var ts = new Date().getTime();
    var e = new Exec();
    e.name = "getOutput";
    // output file
    var outf = new File(e.tmp + "/exec-" + ts + ".out");
    // go
    e.executeSynch(cmd + "> \"" + outf.fsName + '\"', timeout,
                    folder, keepBatchFile);
    // get the output back
    outf.open("r");
    var str = outf.read();
    outf.close();
    outf.remove();
    
        if (this.logEnabled) {
            this.log("=======================================================");
            this.log(str);
            this.log("=======================================================");
        }
    
    return str;
};
/*
Exec.prototype.getOutputMac = function(cmd, timeout, folder, keepBatchFile) {
    this.log("Exec.getOutputMac(\"" + cmd + "\", " + timeout + ");");
    
    var ts = new Date().getTime();
    var e = new Exec();
    e.name = "getOutputMac";
    
    var outf = new File(e.tmp + "/exec-" + ts + ".out");
    var outname = (isMac() ? outf.absoluteURI : outf.fsname);
    var cmdLine = "#!/bin/sh\n";
    cmdLine += cmd + " >& "\"" + outname + "\"";
    e.executeSynch(cmdLine, timeout, folder, keepBatchFile);
    
    outf.open("r");
    var str = outf.read();
    outf.close();
    outf.remove();
    
    if (this.logEnabled) {
        this.log("=======================================================")'
        this.log(str);
        this.log("=======================================================");
    }
    
    return str;
};
*/
// method that executes a bash commmand and returns the output
Exec.prototype.bash = function(cmd, timeout) {
    this.log("Exec.systemMac(\"" + cmd + "\", " + timeout + ");")

    var ts = new Date().getTime();
    var e = new Exec();
    e.name = "bash";

    var outf = new File(e.tmp + "/exec-" + ts + ".out");
    var cmdLine = Exec.bashApp;
    cmdLine += " -c \"" + cmd + "\" > \"" + outf.fsName + "\" 2>&1";
    e.executeBlock(cmdLine, timeout);

    outf.open("r");
    var str = outf.read();
    outf.close();
    outf.remove();

    if (this.logEnabled) {
        this.log("==========================================================");
        this.log(str);
        this.log("==========================================================");
    }   
    
    return str;
};

// method that actually executes the program asynchronously
// add keepBathFile argument?
Exec.prototype.executeAsynch = function(argList, folder) {
    if (typeof argList === 'undefined') argList = "";
    if (typeof folder === 'undefined') {
        this.log("Exec.executeAsynch(\"" + argList + "\");")
    }
    else {
        this.log("Exec.executeAsynch(\"" + argList + "\", \"" + folder + "\");")
    }
    // get the parameter string
    var str = this.toCommandStr(argList);
    // create a new temporary batch file
    var bat = new File(this.getBatName());
    // write a temporary batch file and execute it
    bat.open("w");
    if (folder) {
        bat.writeln('cd \"' + decodeURI(folder.fsName) + '\"');
    }
    bat.writeln(str);
    // batch file commits suicide ;)
    bat.writeln("del \"" + bat.fsName + "\"");
    //bat.writeln("exit");
    bat.close();
    // go
    bat.execute();
};

// method (hack) for synchronously executing a program
// because by default, the execute() method returns immediately,
// we have to create a semaphore file when execution of the program
// finishes, and we intermittently test for that file until it exists
Exec.prototype.fauxSynch = function(waitFile, timeout) {
    this.log("Exec.fauxSynch(" + waitFile.toUIString() + ", " + timeout + ");");
    if (timeout == undefined) {
        timeout = 2000;
        this.log("Timeout set by default to " + 2000);
    }
    
    if (timeout) {
        // default to 1/20 of timeout intervals
        var parts = 20;
        
        // if the timeout is more than 20 seconds, check every 2 seconds
        if (timeout > 20000) {
            parts = Math.ceil(timeout/2000);
        }
    
        var interval = timeout / parts;
        
        this.log("Synchronous exec: max intervals = " + parts + ", interval(ms) = " + interval);

        while (!waitFile.exists && parts) {
            this.log('.');
            $.sleep(interval);
            parts--;
        }
    
        this.log("Synchronous wait completed. File exists: " + file.exists +
                ", intervals remaining = " + parts);
    }
    return waitFile.exists;
};

// method to invoke the faux synchronous hack and check return status
Exec.prototype.synchronous = function(waitFile, timeout) {
    if (!Exec.fauxSync(waitFile, timeout)) {
        var msg = "Timeout exceeded for program " + this.name 
        this.log(msg);
        throw msg;
    }
};


// method that actually executes the program synchronously
Exec.prototype.executeSynch = function(argList, timeout, folder, keepBatchFile) {

    this.log("Exec.executeSynch(\"" + argList + "\", " + timeout + ", " +
           folder + ", " + keepBatfile + ");");
           
    // get parameter string
    var str = this.toCommandStr(argList);
    this.log("Parameter String = " + str);
    
    // create temporary batch file and a semaphore file
    var bat = new File(this.getBatName());
    var semaphore = new File(bat.toString() + ".sem")
    
    // what is the remove file command?
    var rm = (isWindows() ? "del" : "/bin/rm -f");
    
    this.log("bat = " + bat.toUIString() + ", sem = " + semaphore.toUIString() +
           ", rm = " + rm);

    var semname = (isMac() ?
                 semaphore.absoluteURI : semaphore.toUIString());
                 
    // construct a string to write to a batch file
    var bstr = '';
    if (folder) {
        bstr += "cd \"" + decodeURI(folder.fsName) + "\"\n";
    }
    bstr += str + "\n";
    
    bstr += "echo Done > \"" + semaphore.fsName + "\"\n";
    
    if (keepBatchFile != true) {
        // kill yourself!
        bstr += rm + " \"" + bat.fsName + "\"\n";
    }
    
    this.log("Batch file string: " + bstr);
                 
    // write a batch file and execute it
    bat.open("w");
    
    if (isMac()) {
        bat.lineFeed = "unix";
    }
        
    bat.writeln(bstr);
    bat.close();
    
    // if we're on windows, run the program
    if (isWindows()) {
        var rc = bat.execute();
        var msg = (rc ? "execute ok" : "execute failed: \"" + bat.error + "\"");
        this.log(msg);
        
        if (!rc) {
            throw msg;
        }
    }
    // if we're on Mac, use the wrapper
    else {
        var wrapper = new File(Exec.macExecWrapper);
        if (!wrapper.exists) {
            var msg = "Wrapper file " + wrapper.toUIString() + " not found.";
            this.log(msg);
            throw msg;
        }
    
        this.log("Using wrapper: " + Exec.MacExecWrapper);
        var rc = wrapper.execute();
        var msg = (rc ? "execute ok" : "execute failed: \"" + wrapper.error + "\"");
        this.log(msg);
        if (!rc) {
            throw msg;
        }
    }
    
    try {
        this.synchronous(semaphore, timeout);
    }
    finally {
        semaphore.remove();
    }
};



// log messages
Exec.prototype.log = function(msg) {
    //alert("Logging: " + msg);
    var file;
    
    if (!this.logEnabled) {
        return;
    }

    if (!this.logFilename) {
        return;
    }

    if (!this.log.fptr) {
        file = new File(this.logFilename);
        
        if (file.exists) file.remove();
        
        if (!file.open("w")) {
            throw Error("Unable to open log file " + file + ": " + file.error);
        }
    
        this.log.fptr = file;
        
        msg = "PS_JSX_Exec Versions $Revision: 1.00 $\n\n" + msg;
    }

    else {
        file = this.log.fptr;
        if (!file.open("e")) {
            throw Error("Unable to open log file " + file + ": " + file.error);
        }
    
        file.seek(0, 2); // jump tot he end of the file
    }

    var now = new Date();
    if (now.toISO) {
        now = now.toISO();
    }
    else {
        now = now.toString();
    }

    if (!file.writeln(now + " - " + msg)) {
        throw Error("Unable to write to log file " + file + ": " + file.error);
    }

    file.close();
 };

Exec.prototype.setLogFileName = function(name) {
    //var folder = new Folder("/c/temp");    
    //if (!folder.exists) {
    //    Exec.log(file.parent.toUIString() + " does not exist, changing to " +
    //            Folder.temp.toUIString());
    //    folder = Folder.temp;
    //}

    var folder = Folder.temp;
    
    var file = new File(folder + '/' + name);
    if (file.exists) {
        file.remove();
    }

    this.logFilename = file.absoluteURI;
    //alert("Log file: " + this.logFilename);
};


////////////////////
// HELPER METHODS //
////////////////////
/*
isWindows = function() {
    return $.os.match(/windows/i);
};

isMac = function() {
    return !isWindows();
}
*/
function isWindows() {
    return $.os.match(/windows/i);
}

function isMac() {
    return !isWindows();
}
/**********************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    END INCLUDE PS_JSX_EXEC
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************/











/**********************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    INCLUDE FOLDER NUMBER STRING UTILS
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************/
folderNumberStringUtils = function(input) {
    
    // what folder number string
    this.input = input;
    // this allows you to keep track of the company instead of reusing the "is" methods repeatedly
    // so you can if/ifelse/else or switch on instance.currentCompany against instance.CompanyTypes
    this.currentCompany = "";
    
    // sanitized folder number
    this.folder = "";
    // prettified folder number
    this.prettyFolder = "";
    
    // booleans
    this.isMM = false;
    this.isCB = false;
    this.isMCD = false;
    this.isUN = false;

    // create an enum-like object
    this.CompanyTypes = {
        MONTHLYMAIL: 0,
        CHURCHBUDGET: 1,
        MCDANIEL: 2,
        UNITED: 3
    };
    
    
    this.decipherString = function() {
    
        if (typeof this.input === 'undefined') {
            return {status:1, folder:'', message: 'getFolderNumberFromString: Nothing was passed to the function'};
        }

        else if (this.input == "") {
            return {status:1, folder:'', message: 'getFolderNumberFromString: An empty string was passed to the function'};
        }

        // if we have a real string to work on
        else {
            // Monthly Mail has a 4 digit folder number
            // CB, United, and McDaniel are all 5-characters (McD & United are 5 numbers, CB is one letter and 4 numbers)
            
            var len = 5;
            if (this.isMonthlyMail()) len = 4;
            
            // remove any dashes
            str = removeDashFromString(this.input);
            
            // is our string long enough to be a folder number?
            if (str.length < len) {
                return {status:1, folder: '', message: 'getFolderNumberFromString: String isn\'t long enough to be a folder number'};
            }
        
            else {
                // return the folder number of the proper length
                return {status:0, folder: str.slice(0, len), message:''};
           }
        }
    }

    this.setCurrentCompany = function() {
        if (this.isChurchBudget()) {
            this.currentCompany = this.CompanyTypes.CHURCHBUDGET;
            this.isCB = true;
        }
        else if (this.isMcDaniel()) {
            this.currentCompany = this.CompanyTypes.MCDANIEL;
            this.isMCD = true;
        }
        else if (this.isUnited()) {
            this.currentCompany = this.CompanyTypes.UNITED;
            this.isUN = true;
        }
        else if (this.isMonthlyMail()) {
            this.currentCompany = this.CompanyTypes.MONTHLYMAIL;
            this.isMM = true;
        }        
        else this.currentCompany = "";
    }


    this.isChurchBudget = function() {
        // if it isn't at least 5 characters after removing -, it's an invalid folder number
        if (removeDashFromString(this.input).length < 5) return false;
        
        // does it start with a letter?
        if (this.input.charAt(0).match(/^[a-zA-Z]/)) return true;
        else return false;
    }

    this.isUnited = function() {
        // remove any - from the string
        var str = removeDashFromString(this.input);
        // if it isn't at least 5 characters, it's an invalid folder number
        if (str.length < 5) return false;
        
        // if the first 5 characters are numbers and the first number is 6
        if(
            str.charAt(0).match(/^[0-9]/) &&
            str.charAt(1).match(/^[0-9]/) &&
            str.charAt(2).match(/^[0-9]/) &&
            str.charAt(3).match(/^[0-9]/) &&
            str.charAt(4).match(/^[0-9]/) &&
            str.charAt(0).match(/^[6]/)      ) return true;
        else return false;
    }

    this.isMcDaniel = function() {
        // remove any - from the string
        var str = removeDashFromString(this.input);
        // if it isn't at least 5 characters, it's an invalid folder number
        if (str.length < 5) return false;
        
        // if the first 5 characters are numbers and the first number is 3-5
        if(
            str.charAt(0).match(/^[0-9]/) &&
            str.charAt(1).match(/^[0-9]/) &&
            str.charAt(2).match(/^[0-9]/) &&
            str.charAt(3).match(/^[0-9]/) &&
            str.charAt(4).match(/^[0-9]/) &&
            str.charAt(0).match(/^[3-5]/)      ) return true;
        else return false;
    }

    this.isMonthlyMail = function() {
        // remove any - from the string
        var str = removeDashFromString(this.input);
        // if it isn't at least 4 characters, it's an invalid folder number
        if (str.length < 4) return false;
        
        // if the first 4 characters are numbers and the 5th isn't 
        if(
            str.charAt(0).match(/^[0-9]/) &&
            str.charAt(1).match(/^[0-9]/) &&
            str.charAt(2).match(/^[0-9]/) &&
            str.charAt(3).match(/^[0-9]/) &&
            !str.charAt(4).match(/^[0-9]/)   ) return true;
        else return false;
    }




    // private, helper functinos
    function removeDashFromString(input) {
        return input.replace ("-", "");
    }

    this.makePrettyFolder = function() {
        // this.folder has already been sanitized and we know it's valid otherwise this wouldn't get executed
        // monthly mail gets no dash, CB gets a dash after the letter, McD and United get a dash after the first two numbers
        if (this.isMM) return this.folder;
        else if (this.isCB) {
            // insert a - at position 1 (after the letter)
            return (this.folder.substr(0,1) + "-" + this.folder.substr(1));
        }
        else {
            // this is McDaniel or United, so insert the - at position 2 (after the first two numbers)
            return (this.folder.substr(0,2) + "-" + this.folder.substr(2));
        }        
    }
        

    // go ahead and do all the computation upon instantiation
    this.setCurrentCompany();
    result = this.decipherString();
    if (result.status == 1) {
        alert("folderNumberStringUtils: Failed to decipher string - " + result.message);
    }
    else {
        this.folder = result.folder;
        this.prettyFolder = this.makePrettyFolder();
    }

}

/**********************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    END INCLUDE FOLDER NUMBER STRING UTILS
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************/

















/**********************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    PUT ON PROOF
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************/
function putOnProof() {
    // resize the original TIFF printer image to 300dpi
    CB.swissKnife.resizeToDPI(300);
    CB.swissKnife.selectAll();
    CB.swissKnife.clipboardCopy();
    // return it to its original state
    CB.swissKnife.Document().activeHistoryState = CB.swissKnife.Document().historyStates[0];

    // open the PNG template and paste in place
    CB.swissKnife.openPNGTemplate();
    CB.swissKnife.pasteInPlace();

    // move on the PNG template as if it were face side, even if it is flap side
    // so flap shows up right on the proof sheet
    if (CB.isQuark) {
        CB.swissKnife.moveQuarkColorFaceOnPNG();
        CB.swissKnife.clearQuarkFolderNumber();
    }
    else {
        CB.swissKnife.movePMColorFaceOnPNG();
        CB.swissKnife.clearPMFolderNumber();
    }

    // flatten the image, select all, copy
    CB.swissKnife.flattenImage();
    CB.swissKnife.selectAll();
    CB.swissKnife.clipboardCopy();

    // open the dollar/premier proof template
    if (CB.jobSize == CB.swissKnife.JobSizes.DOLLAR) {
        if (!CB.isMM) CB.swissKnife.openProofTemplateDollar();
        else CB.swissKnife.openProofTemplateDollarMM();
    }
    else if (CB.jobSize == CB.swissKnife.JobSizes.PREMIER) {
        if (!CB.isMM) CB.swissKnife.openProofTemplatePremier();
        else CB.swissKnife.openProofTemplatePremierMM();
    }

    // paste then envelope image and move into place
    CB.swissKnife.pasteInPlace();
    CB.swissKnife.movePNGOnDollarProof();

    // select the envelope, invert, and clear around it
    CB.swissKnife.selectDollarProofBorder();
    CB.swissKnife.invertSelection();
    CB.swissKnife.deleteSelection();
    CB.swissKnife.selectNone();

    // now run the proper proofing script for getting date/number/addressing/advertising
    if (!CB.isMM) {
        function envelopeProofCB() {
            ////////////////////////////////////////////////////////////////////////////////
            // GLOBALS /////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////

            // document
            CB.mainDoc = app.activeDocument;

            // base background layer, to insert copy on top of
            CB.bgLayer = CB.mainDoc.layers.getByName("WhiteBG");

            // font code layer
            CB.fontCodeLayer = CB.mainDoc.layers.getByName("FONTCODE");

            // filename layer
            CB.fileNameLayer = CB.mainDoc.layers.getByName("FILENAME");

            // flap layer
            CB.flapLayer = CB.mainDoc.layers.getByName("Flap");

            // church budget group
            CB.CB = CB.mainDoc.layerSets.getByName("Proof").layerSets.getByName("ChurchBudget");
            // mcdaniel group
            CB.McD = CB.mainDoc.layerSets.getByName("Proof").layerSets.getByName("McDaniel");
            // united group
            CB.United = CB.mainDoc.layerSets.getByName("Proof").layerSets.getByName("United");


            // total church solutions group
            CB.TCS = CB.mainDoc.layerSets.getByName("Proof").layerSets.getByName("Advertisements").layerSets.getByName("Total Church Solutions");
            // parish support group
            CB.PS = CB.mainDoc.layerSets.getByName("Proof").layerSets.getByName("Advertisements").layerSets.getByName("ParishSupport");
            // CB e-offering group
            CB.EO = CB.mainDoc.layerSets.getByName("Proof").layerSets.getByName("Advertisements").layerSets.getByName("myEOffering");

            // dating and numbering layer refs
            CB.LeftNumsHigh = CB.mainDoc.layerSets.getByName("DateNumbers").artLayers.getByName("Left Nums High");
            CB.LeftNumsLow = CB.mainDoc.layerSets.getByName("DateNumbers").artLayers.getByName("Left Nums Low");
            CB.RightNumsHigh = CB.mainDoc.layerSets.getByName("DateNumbers").artLayers.getByName("Right Nums High");
            CB.RightNumsLow = CB.mainDoc.layerSets.getByName("DateNumbers").artLayers.getByName("Right Nums Low");
            CB.LeftNumsFlap = CB.mainDoc.layerSets.getByName("DateNumbers").artLayers.getByName("Left Nums Flap");
            CB.RightNumsFlap = CB.mainDoc.layerSets.getByName("DateNumbers").artLayers.getByName("Right Nums Flap");
            CB.DateHigh = CB.mainDoc.layerSets.getByName("DateNumbers").artLayers.getByName("Date High");
            CB.DateLow = CB.mainDoc.layerSets.getByName("DateNumbers").artLayers.getByName("Date Low");

            // Addressing and double-stock may not exist (if it's a Premier template)
            try {
                CB.Addressing = CB.mainDoc.layerSets.getByName("DateNumbers").artLayers.getByName("Addressing");
            } catch(e) {}

            try {
                CB.DoubleStock = CB.mainDoc.layerSets.getByName("DateNumbers").layerSets.getByName("DoubleStockDating");
            } catch(e) {}

            ////////////////////////////////////////////////////////////////////////////////
            // FUNCTION DECLARATIONS ///////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////



            ////////////////////////////////////////////////////////////////////////////////
            // MAIN EXECUTION //////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////


            // only run the app if this is Photoshop
            if( BridgeTalk.appName == "photoshop" ) {

                // Set Adobe Photoshop CS5 to display no dialogs
                app.displayDialogs = DialogModes.NO;
                
                // start by selecting the background layer to insert copy above
                CB.mainDoc.activeLayer = CB.bgLayer;


                // set the text of the font code text layer (CB.folder should have been set by calling script)
                CB.fontCodeLayer.textItem.contents = CB.folder.toUpperCase() + " " + CB.fontCode.toUpperCase();
                
                // set the text of the filename text layer
                if (CB.jobSize == CB.swissKnife.JobSizes.DOLLAR) {
                    CB.fileNameLayer.textItem.contents = CB.fontCodeLayer.textItem.contents + "_PROOF.PDF";
                }
                else if (CB.jobSize == CB.swissKnife.JobSizes.PREMIER) {
                    CB.fileNameLayer.textItem.contents = CB.fontCodeLayer.textItem.contents + "_PREMIER_PROOF.PDF";
                }
                    
                // use the company type to determine which company's info be displayed on the proof
                if (CB.isCB) CB.CB.visible = true;
                else if (CB.isMcDaniel) CB.McD.visible = true;
                else if (CB.isUnited) CB.United.visible = true;
                // else if (CB.isMM)...
                
                // dating and numbering
                // create a dialog window
                var dateNumDialog = new Window("dialog{text:'Pick Dating and Numbering',\
                bounds:[100,100,310,440],\
                button0:Button{bounds:[10,10,200,30], text:'Dated and Numbered'},\
                button1:Button{bounds:[10,40, 200, 60], text:'Dated'},\
                button2:Button{bounds:[10,70,200,90], text:'Numbered'},\
                button3:Button{bounds:[10,100,200,120], text:'Addressed'}\
                button4:Button{bounds:[10,130,200,150], text:'High Date and High Numbers'},\
                button5:Button{bounds:[10,160,200,180], text:'Low Date and Low Numbers'},\
                button6:Button{bounds:[10,190,200,210], text:'Low Date and High Numbers'},\
                button7:Button{bounds:[10,220,200,240], text:'Dated and Left Number Only'},\
                button8:Button{bounds:[10,250,200,270], text:'Dated and Right Number Only'},\
                button9:Button{bounds:[10,280,200,300], text:'Double Stock (2 Dates & Nums)'},\
                button10:Button{bounds:[10,310,200,330], text:'Loose'},\
                };");
                    
                // button click handlers, set the visibility of the date/number/addressing layers
                dateNumDialog.button0.onClick = function() {
                                                                    if (CB.isFace) {
                                                                        CB.LeftNumsLow.visible = true;
                                                                        CB.RightNumsLow.visible = true;
                                                                    }
                                                                    else if (CB.isFlap) {
                                                                        CB.LeftNumsFlap.visible = true;
                                                                        CB.RightNumsFlap.visible = true;
                                                                    }
                                                                    CB.DateHigh.visible = true;
                                                                    dateNumDialog.close();
                }

                dateNumDialog.button1.onClick = function() {
                                                                    CB.DateHigh.visible = true;
                                                                    dateNumDialog.close();
                }

                dateNumDialog.button2.onClick = function() {
                                                                    CB.LeftNumsLow.visible = true;
                                                                    CB.RightNumsLow.visible = true;
                                                                    dateNumDialog.close();
                }

                dateNumDialog.button3.onClick = function() {
                                                                    CB.Addressing.visible = true;
                                                                    dateNumDialog.close();
                }

                dateNumDialog.button4.onClick = function() {
                                                                    CB.LeftNumsHigh.visible = true;
                                                                    CB.RightNumsHigh.visible = true;
                                                                    CB.DateHigh.visible = true;
                                                                    dateNumDialog.close();
                }

                dateNumDialog.button5.onClick = function() {
                                                                    CB.LeftNumsLow.visible = true;
                                                                    CB.RightNumsLow.visible = true;
                                                                    CB.DateLow.visible = true;
                                                                    dateNumDialog.close();
                }
                
                dateNumDialog.button6.onClick = function() {
                                                                    CB.LeftNumsHigh.visible = true;
                                                                    CB.RightNumsHigh.visible = true;
                                                                    CB.DateLow.visible = true;
                                                                    dateNumDialog.close();
                }

                dateNumDialog.button7.onClick = function() {
                                                                    CB.LeftNumsLow.visible = true;
                                                                    CB.DateHigh.visible = true;
                                                                    dateNumDialog.close();
                }

                dateNumDialog.button8.onClick = function() {
                                                                    CB.RightNumsLow.visible = true;
                                                                    CB.DateHigh.visible = true;
                                                                    dateNumDialog.close();
                }

                dateNumDialog.button9.onClick = function() {
                                                                    CB.DoubleStock.visible = true;
                                                                    CB.LeftNumsLow.visible = true;
                                                                    CB.RightNumsLow.visible = true;
                                                                    dateNumDialog.close();
                }

                dateNumDialog.button10.onClick = function() {
                                                                    dateNumDialog.close();
                }

                // show dialog
                dateNumDialog.show();
              
                // ask if catholic or protestant
                // create a dialog window
                var dlg = new Window("dialog{text:'Catholic or Protestant?',\
                bounds:[100,100,300,150],\
                button0:Button{bounds:[10,10,80,30] , text:'Protestant' },\
                button1:Button{bounds:[100,10,180,30] , text:'Catholic' }\
                };");

                // button click handlers, set the proper advertisements to visible
                dlg.button0.onClick = function() {
                                                    CB.TCS.visible = true;
                                                    CB.EO.visible = true;
                                                    dlg.close();
                                           }
                                       
                dlg.button1.onClick = function() {
                                                    CB.PS.visible = true;
                                                    CB.EO.visible = true;
                                                    dlg.close();
                                          }
                dlg.show();
                
                // if this is a flap job, show the flap outline
                if (CB.isFlap) {
                    CB.flapLayer.visible = true;
                }

            }
        }
    
        envelopeProofCB();
    }

    else {
        function dollarProofMM() {
            ////////////////////////////////////////////////////////////////////////////////
            // GLOBALS /////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////

            // create the universal global object if it doesn't exist
            var CB = CB || {};

            // document
            CB.mainDoc = app.activeDocument;

            // base background layer, to insert copy on top of
            CB.bgLayer = CB.mainDoc.layers.getByName("WhiteBG");

            // font code layer
            CB.fontCodeLayer = CB.mainDoc.layers.getByName("FONTCODE");

            // flap layer
            CB.flapLayer = CB.mainDoc.layers.getByName("Flap");

            // total church solutions group
            CB.TCS = CB.mainDoc.layerSets.getByName("Proof").layerSets.getByName("Advertisements").layerSets.getByName("Total Church Solutions");
            // parish support group
            CB.PS = CB.mainDoc.layerSets.getByName("Proof").layerSets.getByName("Advertisements").layerSets.getByName("ParishSupport");
            // CB e-offering group
            CB.EO = CB.mainDoc.layerSets.getByName("Proof").layerSets.getByName("Advertisements").layerSets.getByName("myEOffering");

            // dating and numbering layer refs
            CB.Addressing = CB.mainDoc.layers.getByName("Addressing");
            CB.NumLeftDateRight = CB.mainDoc.layerSets.getByName("NumLeft DateRight");
            CB.DateLeftNumRight = CB.mainDoc.layerSets.getByName("DateLeft NumRight");

            ////////////////////////////////////////////////////////////////////////////////
            // FUNCTION DECLARATIONS ///////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////



            ////////////////////////////////////////////////////////////////////////////////
            // MAIN EXECUTION //////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////


            // only run the app if this is Photoshop
            if( BridgeTalk.appName == "photoshop" ) {

                // Set Adobe Photoshop CS5 to display no dialogs
                app.displayDialogs = DialogModes.NO;
                
                // start by selecting the background layer to insert copy above
                CB.mainDoc.activeLayer = CB.bgLayer;


                // set the text of the font code text layer (CB.folder should have been set by calling script)
                CB.fontCodeLayer.textItem.contents = "MM" + CB.folder + CB.fontCode.toUpperCase() + "_PROOF.PDF";



                // dating and numbering
                // create a dialog window
                var dateNumDialog = new Window("dialog{text:'Pick options',\
                bounds:[100,100,300,300],\
                button0:Button{bounds:[10,10,200,30], text:'Addressed (### - DATE)'},\
                button1:Button{bounds:[10,40, 200, 60], text:'Addressed (DATE - ###)'},\
                button2:Button{bounds:[10,70,200,90], text:'Loose'},\
                };");
                    
                    
                // button click handlers, set the visibility of the date/number/addressing layers
                dateNumDialog.button0.onClick = function() {
                                                                    CB.Addressing.visible = true;
                                                                    CB.NumLeftDateRight.visible = true;
                                                                    dateNumDialog.close();
                };

                dateNumDialog.button1.onClick = function() {
                                                                    CB.Addressing.visible = true;
                                                                    CB.DateLeftNumRight.visible = true;
                                                                    dateNumDialog.close();
                };

                dateNumDialog.button2.onClick = function() {
                                                                    // don't need to do anything special for loose
                                                                    dateNumDialog.close();
                };

                dateNumDialog.center();
                                                                  
                                                                  
                                                                  
                // show dialog
                dateNumDialog.show();
              
                // ask if catholic or protestant
                // create a dialog window
                var dlg = new Window("dialog{text:'Catholic or Protestant?',\
                bounds:[100,100,300,150],\
                button0:Button{bounds:[10,10,80,30] , text:'Protestant' },\
                button1:Button{bounds:[100,10,180,30] , text:'Catholic' }\
                };");

                // button click handlers, set the proper advertisements to visible
                dlg.button0.onClick = function() {
                                                    CB.TCS.visible = true;
                                                    CB.EO.visible = true;
                                                    dlg.close();
                };
                                       
                dlg.button1.onClick = function() {
                                                    CB.PS.visible = true;
                                                    CB.EO.visible = true;
                                                    dlg.close();
                };
                dlg.center();
                dlg.show();
                
                // if this is a flap job, show the flap outline
                if (CB.isFlap) {
                    CB.flapLayer.visible = true;
                }

            }
        }
    
        dollarProofMM();
    }

    // print proofs
    function printProof() {
        docRef = CB.swissKnife.Document();

        // if this is Church Budget, we need a clean sheet, so save the history state as it is now
        if (!CB.isMM) snapshot = docRef.historyStates.length - 1;

        // print the proof page, as-is
        docRef.printSettings.flip = false;
        docRef.printSettings.setPagePosition(DocPositionStyle.PRINTCENTERED);
        docRef.printSettings.negative = false;
        docRef.printOneCopy();

        // save to pdf

        filename = docRef.layers.getByName("FILENAME").textItem.contents;
        if (!CB.isMM) pdfpath = "/g/_CBProofs/";
        else pdfpath = "/g/_MMProofs/PROOFS/";

        // flatten for saving pdf without layers
        CB.swissKnife.flattenImage();

        pdf = new File(pdfpath + filename);
        pdfSaveOptions = new PDFSaveOptions();

        pdfSaveOptions.PDFCompatibility = PDFCompatibility.PDF16;
        pdfSaveOptions.colorConversion = false;
        pdfSaveOptions.destinationProfile = "U.S. Web Coated (SWOP) v2";
        pdfSaveOptions.embedColorProfile = false;
        pdfSaveOptions.optimizeForWeb = false;
        pdfSaveOptions.profileInclusionPolicy = false;
        pdfSaveOptions.encoding = PDFEncoding.JPEG;
        pdfSaveOptions.downSample = PDFResample.PDFBICUBIC;
        pdfSaveOptions.PDFStandard = PDFStandard.PDFX42008;
        pdfSaveOptions.PDFCompatibility = PDFCompatibility.PDF15;
        pdfSaveOptions.downSampleSize = 200;
        pdfSaveOptions.downSampleSizeLimit = 250;
        pdfSaveOptions.layers = false;
        pdfSaveOptions.preserveEditing=false;
        pdfSaveOptions.jpegQuality = 10;

        // save it
        docRef.saveAs(pdf, pdfSaveOptions, true, Extension.LOWERCASE);

        // for Church Budget side, print the clean sheet
        if (!CB.isMM) {
            // take us back to before the PDF
            docRef.activeHistoryState = docRef.historyStates[snapshot];
            
            // turn off layers, to make clean sheet
            docRef.layerSets.getByName("Proof").visible = false;
            docRef.layerSets.getByName("DateNumbers").visible = false;
            docRef.layers.getByName("Flap").visible = false;
            docRef.layers.getByName("FILENAME").visible = false;

            // print one copy
            docRef.printSettings.flip = false;
            docRef.printSettings.setPagePosition(DocPositionStyle.PRINTCENTERED);
            docRef.printSettings.negative = false;
            docRef.printOneCopy();
        }
    }

    printProof();

    // close the proof document
    CB.swissKnife.closeWithoutSaving();

    // close the PNG template
    CB.swissKnife.closeWithoutSaving();
}
/**********************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    END PUT ON PROOF
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************/
























// create an instance of the swiss knife object
CB.swissKnife = new ChurchBudgetSwissKnife();




/*********************************************************************************** FUNCTION DEFINITIONS
    ********************************************************************************************************/



// the main execution of the color job type
function doCopySettingColor() {
    
    CB.isFace = (CB.jobSide == CB.JobSides.FACE);
    CB.isFlap = !CB.isFace;
    
    CB.isQuark = (CB.fromProgram == CB.Programs.QUARK);
    CB.isPageMaker = !CB.isQuark;

    // resize to 300dpi since the tiff printer is 600dpi
    CB.swissKnife.resizeToDPI(300);
    
    // select all, copy
    CB.swissKnife.selectAll();
    CB.swissKnife.clipboardCopy();
    
    // undo the resize to 300dpi to get the original document (from TIFF printer) in its original state
    CB.swissKnife.Document().activeHistoryState = CB.swissKnife.Document().historyStates[0];
    
    // open the PNG Template
    CB.swissKnife.openPNGTemplate();
    
    // paste in place
    CB.swissKnife.pasteInPlace();
    
    
    // for face side, move the layer into the proper position, and get rid of the folder number
    if (CB.isFace) {
        // move layer
        if (CB.isQuark) CB.swissKnife.moveQuarkColorFaceOnPNG();
        else CB.swissKnife.movePMColorFaceOnPNG();
        
        // janky way to get rid of folder number from Quark
        if (CB.isQuark) CB.swissKnife.clearQuarkFolderNumber();
        // janky way to get rid of any extra pixels from PageMaker
        // selects a rectangle about halfway into the border and clears pixels around it
        else CB.swissKnife.clearPMFolderNumber();
    }

    // for flap side, rotate the layer 180 degrees, move into the proper place, and flip the flap to the top
    else if (CB.isFlap) {
        CB.swissKnife.rotateByDegrees(180);
        
        if (CB.isQuark) {
            CB.swissKnife.moveQuarkColorFlapOnPNG();
            CB.swissKnife.flipFlapOnPNGCB();
        }
        else {
            CB.swissKnife.movePMColorFlapOnPNG();
            CB.swissKnife.flipFlapOnPNGMM();
        }
    }


    // flatten and save to clipboard.png
    CB.swissKnife.flattenImage();
    CB.swissKnife.saveToClipboardPNG();
    
    // create command-line arguments for PNG Font
    var PNGFontArgs = {}
    PNGFontArgs.folder = CB.folder.toUpperCase();
    if (CB.isMM) PNGFontArgs.jobType = 'DoubleWide_MM';
    else PNGFontArgs.jobType = 'DoubleWide_CB';    









/**********************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    OPEN PNG FONT
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************/
    if (typeof PNGFontArgs !== 'undefined') {

        // create and run an instance of the Exec object for PNG font
        var PNGFont = new Exec(new File("/c/pngfont/pngfont2.exe"));

        PNGFont.logEnabled = true;
        PNGFont.setLogFileName("pngFontExec.log");

        // create a go method, with optional arguments
        // for now this is just going to be asynchronous
       
        if ((typeof PNGFontArgs.folder === 'undefined') || (typeof PNGFontArgs.jobType === 'undefined')) {
            args = [];
        }

        else {
            args = ["/o=" + PNGFontArgs.folder, "/t=" + PNGFontArgs.jobType];
        }

        PNGFont.Go = function() {
            this.executeAsynch(args);
        };

        // now it's time to execute the script
        PNGFont.Go();
    }

/**********************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    OPEN PNG FONT
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************/








    
    // we no longer need this dialog. nothing will save over top clipboard.png
    // however certain functions, like Paste In Place will fail if Photoshop
    // doesn't have focus, so we need to keep the script paused until the user returns
    message = "When PNG Font opens, \"Load from clipboard\" and create or overwrite font code \"" + CB.fontCode + "\" \n\n \
               Then come back and press \"Ok\"";

    CB.swissKnife.informationDialog(message);
    
    
    // we're done with the PNG Template, so close it, leaving the original document open
    CB.swissKnife.closeWithoutSaving();
}



// the main execution of the monochrome job type
function doCopySettingMonochrome() {

    // booleans for jobSide
    CB.isFace = (CB.jobSide == CB.JobSides.FACE);
    CB.isFlap = !CB.isFace;
    
    CB.isQuark = (CB.fromProgram == CB.Programs.QUARK);
    CB.isPageMaker = !CB.isQuark;
    
    // set the image to 300dpi since the bw tiff printer is now 600dpi
    CB.swissKnife.resizeToDPI(300);

    // select all, copy
    CB.swissKnife.selectAll();
    CB.swissKnife.clipboardCopy();
    
    // undo the resize to 300dpi to get the original document (from TIFF printer) in its original state
    CB.swissKnife.Document().activeHistoryState = CB.swissKnife.Document().historyStates[0];

    // open Font Tools Template and paste into place, move and flatten
    CB.swissKnife.openFontToolsTemplate();
    CB.swissKnife.pasteInPlace();
    if (CB.isQuark) CB.swissKnife.moveQuarkBWOnFontTools();
    else CB.swissKnife.movePMBWOnFontTools();
    
    CB.swissKnife.flattenImage();
    
    // if we don't have an image, we don't need to protect the image so just move on
    if (!CB.hasImage) {
        
        
/**********************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    BW AFTER MARQUEE
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************/        
        CB.swissKnife.convertToGrayscale();

        // if it is text only, do 50% threshold bitmap
        CB.swissKnife.convertToBitmapThreshold();
    

        // create the argument object for FontTools
        if (CB.jobSize == CB.swissKnife.JobSizes.DOLLAR) {
            FontToolsArgs = { folder: CB.folder };
        }
        else if (CB.jobSize == CB.swissKnife.JobSizes.PREMIER) {
            FontToolsArgs = { folder: ("p" + CB.folder) };
        }

        // open font tools
        
/**********************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    OPEN FONT TOOLS
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************/ 
        if (typeof FontToolsArgs !== 'undefined') {
    
            // create and run an instance of the Exec object for PNG font
            var FontTool = new Exec(new File("/c/FontTool/fnttool3.exe"));

            FontTool.logEnabled = true;
            FontTool.setLogFileName("FontToolExec.log");


            if (typeof FontToolsArgs.folder === 'undefined') {
                args = [];
            }

            else {
                args = ["/o=" + FontToolsArgs.folder];
            }

            // create a go method, with optional arguments
            // for now this is just going to be asynchronous
            FontTool.go = function() {
                this.executeAsynch(args);
            }

            // now it's time to execute the script
            FontTool.go();
            
        }
    
    
    
/**********************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    OPEN FONT TOOLS
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************/

        // flatten, select all, copy, and open font tools for updating/inserting
        CB.swissKnife.flattenImage();
        CB.swissKnife.selectAll();
        CB.swissKnife.clipboardCopy();

        message = "Add or update the proper font code.\n\n \
                   Then come back and press \"Ok\"";

        CB.swissKnife.informationDialog(message);

        // now that the user has saved into Font Tools, go ahead and close the font tools template
        CB.swissKnife.closeWithoutSaving();
        
        
/**********************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    BW AFTER MARQUEE
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************
    *******************************************************************************************************************/        



        
        
        
    }

    else {    
        // this is the only way to pause the script (seemingly, anyway) and
        // continue after the user does something
        // we show a palette window by sending a message through bridgeTalk
        // the palette doesn't steal focus, but it also lets this script
        // continue executing (and there's no way to wait for it because
        // a loop will stop PS from responding to the user)
        // so we show this dialog and in the button click callback we load
        // the part 2 to this script and continue executing

        // this dialog is to allow the user to select any images to protect from
        // the accented edges tool we're about to use, then continue execution

        var title = "Select image";
        var message = "Select image to protect with marquee tool, then click continue...";
        var bt = new BridgeTalk();
            bt.target = "photoshop";
            func = "var w = new Window('palette', '" + title + "', [0, 0, 400, 100]); \
                            w.add('statictext', [5,5,390,50], '" + message + "'); \
                            okButton = w.add('button', [5,40,205,90], 'GO!', {name: 'ok'}); \
                            okButton.active = true; \
                            w.center(); \
                            okButton.onClick = function() { \
                                w.close(); \
                                var CB = {}; \
                                CB.isMM = " + CB.isMM + "; \
                                CB.isCB = " + CB.isCB + "; \
                                CB.isMcDaniel = " + CB.isMcDaniel + "; \
                                CB.isUnited = " + CB.isUnited + "; \
                                CB.folder = \"" + CB.folder + "\"; \
                                CB.prettyFolder = \"" + CB.prettyFolder + "\"; \
                                CB.fontCode = \"" + CB.fontCode + "\"; \
                                CB.isFlap = " + CB.isFlap + "; \
                                CB.hasImage = " + CB.hasImage + "; \
                                CB.jobSize = " + CB.jobSize + "; \
                                #include \"/g/jdforsythe/Settings/Photoshop Scripts/CopySetting/Envelope_BW_After_Marquee.jsx\"; \
                            }; \
                            w.center(); \
                            w.show(); \
                            $.sleep(100); \
                            w.active = true; \
                            okButton.active = true;";

            bt.body = func;
            bt.send();

        // execution will continue after the pallete window is displayed
        // so we must do nothing here and only when the user clicks the continue button
        // in the palette window above, load another script to continue the execution of Quark BW images

    }


}
/*********************************************************************************** MAIN EXECUTION CONTINUES
    *************************************************************************************************************/

// if this is hard-coded monthly mail, use 0000
// otherwise use A-0101 for the default folder code3
if (!hardCodedMM) {
    defaultFolder = "A-0101";
    defaultFont = "A";
}
else {
    defaultFolder = "0000";
    defaultFont = "W";
}


// if the user cancels at the folder input, we want to catch that "error" and stop execution
try {
    // get the folder number from user input
    userInputFolder = prompt ("Enter the folder number", defaultFolder, "Enter the folder number");
    // ERROR: if they press cancel, the value is null
    if (userInputFolder === null) throw "NO_FOLDER";
    
    // get the font code from user input
    CB.fontCode = prompt ("Enter the font code", defaultFont, "Enter the font code");
    // ERROR: if they press cancel, cancel
    if (CB.fontCode === null) throw "NO_FONT";

    // include the library of utils for user-inputted folder number strings
    //#include '/g/jdforsythe/Settings/Photoshop Scripts/lib/folderNumberStringUtils.jsxbin'

    // create an instance of the folderNumberStringUtils object with the user-inputted folder string
    FolderUtils = new folderNumberStringUtils(userInputFolder);

    // save company globally
    CB.isMM = FolderUtils.isMM;
    CB.isCB = FolderUtils.isCB;
    CB.isMcDaniel = FolderUtils.isMCD;
    CB.isUnited = FolderUtils.isUN;
    
    // ERROR: if none of the companies gets set to true, there was an error with the folder number
    if (!(CB.isMM || CB.isCB || CB.isMcDaniel || CB.isUnited)) throw "INVALID_FOLDER";

    CB.folder = FolderUtils.folder;
    CB.prettyFolder = FolderUtils.prettyFolder;

    // create a dialog box to ask what the user wants to do
    var win = new Window("dialog", undefined, [0,0,605,250], );

    sText = win.add( "statictext", [5,5,75,25], 'From:' );
    fromProgram1 = win.add( "radiobutton", [5,35,205,55], 'QuarkXPress');
    fromProgram2 = win.add( "radiobutton", [5,60,205,80], 'PageMaker 6.5');

    sText = win.add( "statictext", [200,5,270,25], 'Type:' );
    colorType1 = win.add( "radiobutton", [200,35,400,55], 'Full Color' );
    colorType2 = win.add( "radiobutton", [200,60,400,80], 'Monochrome' );

    sText = win.add( "statictext", [400,5,470,25], 'Side:' );
    jobSide1 = win.add( "radiobutton", [400,35,600,55], 'Face' );
    jobSide2 = win.add( "radiobutton", [400,60,600,80], 'Flap' );

    sText = win.add( "statictext", [5,115,75,135], 'Need:' );
    needsProof = win.add( "checkbox", [5,145,205,165], 'Proof Page' );

    win.add("statictext", [200,115,270,135], 'Size:');
    jobSize1 = win.add("radiobutton", [200,150,400,170], 'Dollar');
    jobSize2 = win.add("radiobutton", [200,175,400,195], 'Premier');

    win.add("statictext", [400,115,470,135], 'Design:');
    hasImage1 = win.add("radiobutton", [400,150,600,170], 'Has an image');
    hasImage2 = win.add("radiobutton", [400,175,600,195], 'Is text only');

    // naming the button "ok" makes it accept the enter key (even when it doesn't have focus)
    goButton = win.add( "button", [400,210,600,240], 'GO!', {name: "ok"});
    // making the button "active" gives it focus (although without naming it "ok"
    // it can lose focus) also it only accepts space bar without the name
    goButton.active = true;
    
    cancelButton = win.add( "button", [235,210,385,240], 'Cancel', {name: "cancel"});
    
    
    win.center();

    // default to Quark for Church Budget, PageMaker for Monthly Mail
    if (!CB.isMM) fromProgram1.value = true;
    else fromProgram1.value = false;
    fromProgram2.value = !fromProgram1.value;


    // default to Monochrome for everyone
    colorType1.value = false;
    colorType2.value = true;

    // default to face side for everyone
    jobSide1.value = true;
    jobSide2.value = false;

    // for Church Budget, default to needing a proof
    if (!CB.isMM) needsProof.value = true;

    // default to dollar size
    jobSize1.value = true;
    jobSize2.value = false;

    // default to having an image for everyone
    hasImage1.value = false;
    hasImage2.value = true;


    // set the values when the button is clicked
    goButton.onClick = function() {
                                        // make sure all choices are made
                                        if ( (fromProgram1.value || fromProgram2.value) &&
                                             (colorType1.value || colorType2.value) &&
                                             (jobSide1.value || jobSide2.value) &&
                                             (jobSize1.value || jobSize2.value) ) {
                                                if (fromProgram1.value == true) CB.fromProgram = CB.Programs.QUARK;
                                                else CB.fromProgram = CB.Programs.PAGEMAKER;
                                                
                                                if (colorType1.value == true) CB.colorType = CB.ColorTypes.FULLCOLOR;
                                                else CB.colorType = CB.ColorTypes.MONOCHROME;
                                                
                                                if (jobSide1.value == true) CB.jobSide = CB.JobSides.FACE;
                                                else CB.jobSide = CB.JobSides.FLAP;
                                                                                    
                                                CB.needProof = needsProof.value;
                                                
                                                if (jobSize1.value == true) CB.jobSize = CB.swissKnife.JobSizes.DOLLAR;
                                                else CB.jobSize = CB.swissKnife.JobSizes.PREMIER;
                                                                                            
                                                CB.hasImage = hasImage1.value;
                                                
                                                win.close();
                                        }
                                    
                                        // if one of the choices isn't make, don't close, show an alert
                                        else {
                                            if (!(fromProgram1.value || fromProgram2.value)) {
                                                alert("You must choose a program you're coming from");
                                            }
                                            else if (!(colorType1.value || colorType2.value)) {
                                                alert("You must choose a job color type");
                                            }
                                            else if (!(jobSize1.value || jobSize2.value)) {
                                                alert("You must select a job size");
                                            }
                                            else {
                                                alert("You must chose a job side");
                                            }
                                        }
    }

    win.show();


    // if we end up here without the proper items chosen, the user X-ited the window or clicked cancel
    if ( (fromProgram1.value || fromProgram2.value) && (colorType1.value || colorType2.value) &&
         (jobSide1.value || jobSide2.value) && (jobSize1.value || jobSize2.value) ) {

        // from Quark
        if (CB.fromProgram == CB.Programs.QUARK) {

            // Full color (go to only PNG Font)
            if (CB.colorType == CB.ColorTypes.FULLCOLOR) {
                // face side or flap side is already set in the button press listener above
                // both kinds of job use the same function which will check CB.jobSide for differences
                // both Dollar and Premier use the same PNG function, just a different proof
                doCopySettingColor();
                
                // if we need a proof, print one
                if (CB.needProof) {
                    //#include "/g/jdforsythe/Settings/Photoshop Scripts/CopySetting/Envelope_Put_On_Proof.jsx"
                    putOnProof();
                }
            }

            // Monochrome (go to PNG Font AND Font Tools)
            else if (CB.colorType == CB.ColorTypes.MONOCHROME) {

                // we always want to put the image into PNG font, even for monochrome
                // dollar and premier both use the same functions for PNG and Font Tools
                doCopySettingColor();
                
                // if we need a proof, print one (before doing monochrome because of the continue)
                if (CB.needProof) {
                    //#include "/g/jdforsythe/Settings/Photoshop Scripts/CopySetting/Envelope_Put_On_Proof.jsx"
                    putOnProof();
                }
            
                doCopySettingMonochrome();
            }
                
        }

        // from PageMaker 6.5
        else if (CB.fromProgram == CB.Programs.PAGEMAKER) {
            
            // going to PNG Font
            if (CB.colorType == CB.ColorTypes.FULLCOLOR) {
                doCopySettingColor();
                
                // if we need a proof, print one
                if (CB.needProof) {
                    //#include "/g/jdforsythe/Settings/Photoshop Scripts/CopySetting/Envelope_Put_On_Proof.jsxbin"
                    putOnProof();
                }
            }

            // going to Font Tools
            else if (CB.colorType == CB.ColorTypes.MONOCHROME) {
                doCopySettingColor();
                
                // if we need a proof, print one
                if (CB.needProof) {
                    //#include "/g/jdforsythe/Settings/Photoshop Scripts/CopySetting/Envelope_Put_On_Proof.jsxbin"
                    putOnProof();
                }
            
                doCopySettingMonochrome();
            }

        }

    }

    // ERROR: else the user cancelled, pressed ESC, or clicked the X
    else throw "NO_OPTIONS";
    
}

// error-handling (since all functions, color and monochrome, are run from within this try/catch block
// all errors can be handled here)
catch(err) {
    switch(err) {
        case "NO_FOLDER":
            // the user cancelled entering a folder number, silently exit
            break;
        
        case "NO_FONT":
            // the user cancelled entering a font code, silently exit
            break;
            
        case "INVALID_FOLDER":
            // the folder entered didn't evaluate into any of the companies
            alert("The folder number you entered is invalid. Please try again.");
            break;
            
        case "NO_OPTIONS":
            // the user cancelled the job options window, silently exit
            break;
            
        default:
            alert("Other error: " + err + " : " + err.file + " : " + err.line + " : " + err.msg);
            break;
    }
}