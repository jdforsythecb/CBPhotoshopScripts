#target photoshop

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
    CB.fontCodeLayer.textItem.contents = CB.folder + " " + CB.fontCode;
    
    // set the text of the filename text layer
    CB.fileNameLayer.textItem.contents = CB.fontCodeLayer.textItem.contents + "_PROOF.PDF"
    
/*    
    // if it begins with a P and the next character is not a dash, it's premier
    // so we remove the P from the beginning for company detection
    if (CB.folder.charAt(0).toUpperCase() === "P" && CB.folder.charAt(1) !== "-") {
        CB.folder = CB.folder.substring(1);
    }  
*/    
    
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