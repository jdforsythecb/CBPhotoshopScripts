#target photoshop
///////////////
// GLOBALS
//////////////

// active document
var docRef = app.activeDocument;

// print the active document (proof page)

docRef.printSettings.flip = false;
docRef.printSettings.setPagePosition(DocPositionStyle.PRINTCENTERED);
docRef.printSettings.negative = false;
docRef.printOneCopy(); //Print One Copy

/*------------------------------------------------------------
doc.printSettings.caption = true/false; 
doc.printSettings.labels = true/false; 
doc.printSettings.cornerCropMarks = true/false; 
doc.printSettings.centerCropMarks = true/false; 
doc.printSettings.colorBars = true/false; 
doc.printSettings.regMarks = true/false; 
doc.printSettings.negative = true/false; 
doc.printSettings.flip = true/false; 
doc.printSettings.interpolate = true/false; 
doc.printSettings.vectorData = true/false; 
doc.printSettings.hardProof = true/false; 
doc.printSettings.mapBlack = true/false; 
doc.printSettings.printSelected = true/false;
var bgColor = new SolidColor; 
bgColor .rgb.red = xxx; 
bgColor .rgb.green = xxx; 
bgColor .rgb.blue = xxx; 
doc.printSettings.backgroundColor = bgColor;
doc.printSettings.renderIntent = Intent.PERCEPTUAL/intent.SATURATION/ 
intent.RelativeColorimetric/intent.intent.AbsoluteColorimetric;
doc.printSettings.printBorder = xx; 
doc.printSettings.bleedWidth = xx;
// Format for setPagePosition(DocPositionStyle, X (optional), Y 
(optional), scale (optional)) 
// DocPositionStyle.USERDEFINED 
// DocPositionStyle.PRINTCENTERED 
// DocPositionStyle.SIZETOFIT
doc.printSettings.setPagePosition(DocPositionStyle.USERDEFINED, 1.5, 2.0);
*/







// save to pdf based on the FONTCODE layer


// name of file = FONTCODE_PROOF.pdf
var filename = docRef.layers.getByName("FONTCODE").textItem.contents;

// path to save to
var pdfpath = "/g/Jalan/PROOFS/";

// flatten layers before saving
docRef.flatten();

// save options for PDFs
var pdf = new File(pdfpath + filename);
var pdfSaveOptions = new PDFSaveOptions()
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
docRef.saveAs(pdf, pdfSaveOptions, true, Extension.LOWERCASE);
//docRef.close(SaveOptions.DONOTSAVECHANGES);