#target photoshop


////////////////////////////////////////////////////////////////////////////////
// GLOBALS /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// global object
var My = {};
// document
My.mainDoc = app.activeDocument;

// font code layer
My.fontCode = My.mainDoc.layers.getByName("FONTCODE");

// church budget group
My.CB = My.mainDoc.layerSets.getByName("Proof").layerSets.getByName("ChurchBudget");
// mcdaniel group
My.McD = My.mainDoc.layerSets.getByName("Proof").layerSets.getByName("McDaniel");
// united group
My.United = My.mainDoc.layerSets.getByName("Proof").layerSets.getByName("United");


// total church solutions group
My.TCS = My.mainDoc.layerSets.getByName("Proof").layerSets.getByName("Advertisements").layerSets.getByName("Total Church Solutions");
// parish support group
My.PS = My.mainDoc.layerSets.getByName("Proof").layerSets.getByName("Advertisements").layerSets.getByName("ParishSupport");
// my e-offering group
My.EO = My.mainDoc.layerSets.getByName("Proof").layerSets.getByName("Advertisements").layerSets.getByName("myEOffering");

// dating and numbering layer refs
My.LeftNumsHigh = My.mainDoc.layerSets.getByName("DateNumbers").artLayers.getByName("Left Nums High");
My.LeftNumsLow = My.mainDoc.layerSets.getByName("DateNumbers").artLayers.getByName("Left Nums Low");
My.RightNumsHigh = My.mainDoc.layerSets.getByName("DateNumbers").artLayers.getByName("Right Nums High");
My.RightNumsLow = My.mainDoc.layerSets.getByName("DateNumbers").artLayers.getByName("Right Nums Low");
My.DateHigh = My.mainDoc.layerSets.getByName("DateNumbers").artLayers.getByName("Date High");
My.DateLow = My.mainDoc.layerSets.getByName("DateNumbers").artLayers.getByName("Date Low");

// Addressing and double-stock may not exist (if it's a Premier template)
try {
    My.Addressing = My.mainDoc.layerSets.getByName("DateNumbers").artLayers.getByName("Addressing");
} catch(e) {}

try {
    My.DoubleStock = My.mainDoc.layerSets.getByName("DateNumbers").artLayers.getByName("DoubleStockDating");
} catch(e) {}

////////////////////////////////////////////////////////////////////////////////
// FUNCTION DECLARATIONS ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function beginsWithALetter(str) {
    if (str.charAt(0).match(/^[a-zA-Z]/)) return true;
    else return false;
}

////////////////////////////////////////////////////////////////////////////////
// MAIN EXECUTION //////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


// only run the app if this is Photoshop
if( BridgeTalk.appName == "photoshop" ) {

    // Set Adobe Photoshop CS5 to display no dialogs
    app.displayDialogs = DialogModes.NO;

    // get the folder-font code from user input
    var folder = prompt ("Enter the folder/font code", "A-0101 A", "Enter the folder/font code");

    // set the text of the font code text layer
    My.fontCode.textItem.contents = folder;
    
    // decide whether to use church budget (begins with a letter),
    // mcdaniel (32-50), or united (60+)
    var company = 0;
    
    // if it begins with a P and the next character is not a dash, it's premier
    // so we remove the P from the beginning for company detection
    if (folder.charAt(0).toUpperCase() === "P" && folder.charAt(1) !== "-") {
        folder = folder.substring(1);
    }  
    
    // if it begins with a letter, it's church budget
    if (beginsWithALetter(folder)) {
        My.CB.visible = true;
    }

    // if it doesn't begin with a letter, and doesn't begin with a 6, then it's mcDaniel
    else if (folder.charAt(0) !== "6") {
        My.McD.visible = true;
    }

    // otherwise, it begins with a 6 and is United
    else {
        My.United.visible = true;
    }


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
                                                        My.LeftNumsLow.visible = true;
                                                        My.RightNumsLow.visible = true;
                                                        My.DateHigh.visible = true;
                                                        dateNumDialog.close();
    }

    dateNumDialog.button1.onClick = function() {
                                                        My.DateHigh.visible = true;
                                                        dateNumDialog.close();
    }

    dateNumDialog.button2.onClick = function() {
                                                        My.LeftNumsLow.visible = true;
                                                        My.RightNumsLow.visible = true;
                                                        dateNumDialog.close();
    }

    dateNumDialog.button3.onClick = function() {
                                                        My.Addressing.visible = true;
                                                        dateNumDialog.close();
    }

    dateNumDialog.button4.onClick = function() {
                                                        My.LeftNumsHigh.visible = true;
                                                        My.RightNumsHigh.visible = true;
                                                        My.DateHigh.visible = true;
                                                        dateNumDialog.close();
    }

    dateNumDialog.button5.onClick = function() {
                                                        My.LeftNumsLow.visible = true;
                                                        My.RightNumsLow.visible = true;
                                                        My.DateLow.visible = true;
                                                        dateNumDialog.close();
    }
    
    dateNumDialog.button6.onClick = function() {
                                                        My.LeftNumsHigh.visible = true;
                                                        My.RightNumsHigh.visible = true;
                                                        My.DateLow.visible = true;
                                                        dateNumDialog.close();
    }

    dateNumDialog.button7.onClick = function() {
                                                        My.LeftNumsLow.visible = true;
                                                        My.DateHigh.visible = true;
                                                        dateNumDialog.close();
    }

    dateNumDialog.button8.onClick = function() {
                                                        My.RightNumsLow.visible = true;
                                                        My.DateHigh.visible = true;
                                                        dateNumDialog.close();
    }

    dateNumDialog.button9.onClick = function() {
                                                        My.DoubleStock.visible = true;
                                                        My.LeftNumsLow.visible = true;
                                                        My.RightNumsLow.visible = true;
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
                                        My.TCS.visible = true;
                                        My.EO.visible = true;
                                        dlg.close();
                               }
                           
    dlg.button1.onClick = function() {
                                        My.PS.visible = true;
                                        My.EO.visible = true;
                                        dlg.close();
                              }
    dlg.show();

}