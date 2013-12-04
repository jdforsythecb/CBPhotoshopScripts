#target photoshop

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
    CB.fontCodeLayer.textItem.contents = "MM" + CB.folder + CB.fontCode + "_PROOF.PDF";



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