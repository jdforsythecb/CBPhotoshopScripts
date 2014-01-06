#target photoshop

docRef = CB.swissKnife.Document();

// if this is Church Budget, we need a clean sheet, so save the history state as it is now
if (!CB.isMM) snapshot = docRef.historyStates.length - 1;

// print the proof page, as-is
docRef.printSettings.flip = false;
docRef.printSettings.setPagePosition(DocPositionStyle.PRINTCENTERED);
docRef.printSettings.negative = false;
docRef.printOneCopy();

// save to pdf

if (!CB.isMM) {
    filename = docRef.layers.getByName("FONTCODE").textItem.contents + "_PROOF.pdf";
    pdfpath = "/g/_CBProofs/";
}
else {
    filename = docRef.layers.getByName("FONTCODE").textItem.contents;
    pdfpath = "/g/Jalan/PROOFS/";
}

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