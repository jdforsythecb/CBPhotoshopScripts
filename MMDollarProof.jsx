#target photoshop
///////////////
// GLOBALS
//////////////

// global object
var My = {};
// document
My.mainDoc = app.activeDocument;

// font code layer
My.fontCode = My.mainDoc.layers.getByName("FONTCODE");

// total church solutions group
My.TCS = My.mainDoc.layerSets.getByName("Proof").layerSets.getByName("Advertisements").layerSets.getByName("Total Church Solutions");
// parish support group
My.PS = My.mainDoc.layerSets.getByName("Proof").layerSets.getByName("Advertisements").layerSets.getByName("ParishSupport");
// my e-offering group
My.EO = My.mainDoc.layerSets.getByName("Proof").layerSets.getByName("Advertisements").layerSets.getByName("myEOffering");

// dating and numbering layer refs
My.Addressing = My.mainDoc.layers.getByName("Addressing");

// flap outline layer ref
My.Flap = My.mainDoc.layers.getByName("Flap");



////////////////////////////////////////////////////////////////////////////////
// MAIN EXECUTION //////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


// only run the app if this is Photoshop
if( BridgeTalk.appName == "photoshop" ) {

    // Set Adobe Photoshop CS5 to display no dialogs
    app.displayDialogs = DialogModes.NO;

    // get the folder-font code from user input
    var folder = prompt ("Enter the folder/font code", "1234W", "Enter the folder/font code");

    // set the text of the font code text layer
    My.fontCode.textItem.contents = "MM" + folder + "_PROOF.PDF";
  
    // dating and numbering
    // create a dialog window
    var dateNumDialog = new Window("dialog{text:'Pick options',\
    bounds:[100,100,310,440],\
    button0:Button{bounds:[10,10,200,30], text:'Addressed Face Side'},\
    button1:Button{bounds:[10,40, 200, 60], text:'Addressed Flap Side'},\
    button2:Button{bounds:[10,70,200,90], text:'Loose Face Side'},\
    button3:Button{bounds:[10,100,200,120], text:'Loose Flap Side'},\
    };");
        
    // button click handlers, set the visibility of the date/number/addressing layers
    dateNumDialog.button0.onClick = function() {
                                                        My.Addressing.visible = true;
                                                        My.Flap.visible = false;
                                                        dateNumDialog.close();
    }

    dateNumDialog.button1.onClick = function() {
                                                        My.Addressing.visible = true;
                                                        My.Flap.visible = true;
                                                        dateNumDialog.close();
    }

    dateNumDialog.button2.onClick = function() {
                                                        My.Addressing.visible = false;
                                                        My.Flap.visible = false;
                                                        dateNumDialog.close();
    }

    dateNumDialog.button3.onClick = function() {
                                                        My.Addressing.visible = false;
                                                        My.Flap.visible = true;
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