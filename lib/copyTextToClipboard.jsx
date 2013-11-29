// function to copy text to the clipboard
// returns an object:
//
// { status: 0, // 0 ok, 1 error
//   message:   // nothing or the error message
// }

copyTextToClipboard = function(text) {
    
    if (typeof text === 'undefined') {
        return {status:1, message: "copyTextToClipboard: Nothing was passed to the function"};
    }

    else if (text == "") {
        return {status:1, message: "copyTextToClipboard: An empty string was passed to the function"};
    }

    else {
        var folderForTempFile = Folder.temp.fsName;
        
        // create a new text file and put the text into it
        var clipTxtFile = new File(folderForTempFile + "/clipboard.txt");
        if (clipTxtFile.exists) clipTxtFile.remove();
        clipTxtFile.open('w');
        clipTxtFile.write(text);
        clipTxtFile.close();
        
        // use clip.exe to copy the contents of the text file to the Windows clipboard
        var clipBatFile = new File(folderForTempFiles + "/clipboard.bat")
        if (clipBatFile.exists) clipBatFile.remove();
        clipBatFile.open('w');
        clipBatFile.writeln("cat \"" + clipTxtFile.fsName + "\" | clip");
        // make the batch file delete the text file and then itself
        clipBatFile.writeln("del \"" + clipTxtFile.fsName + "\"");
        clipBatFile.writeln("del \"" + clipBatFile.fsName + "\"");
        clipBatFile.close();
        clipBatFile.execute();
        
        return {status:0, message:''};
    }

}
       

        