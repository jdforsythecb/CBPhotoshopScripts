#target photoshop

// copies all guides from the current document out to ~/Desktop/Guides.txt to be used with the Import Guides script
// simulates copy+paste guides from one document to another

if (documents.length == 0) {
    alert("There are no documents open.");
}

else {
    var docRef = activeDocument;
    
    if ($.os.search(/windows/i) != -1) {
        fileLineFeed = "Windows"
    }

    else {
        fileLineFeed = "Macintosh"
    }

    fileOut = new File("~/Desktop/Guides.txt")
    fileOut.lineFeed = fileLineFeed
    fileOut.open("w", "TEXT", "????")

    for(var i=0; i<docRef.guides.length; ++i) {
        fileOut.write(docRef.guides[i].direction + "," + docRef.guides[i].coordinate + "\n")
    }

    fileOut.close();
    alert("Guides exported!");
}

