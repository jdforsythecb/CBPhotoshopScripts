//
// Execute an external application from a Photoshop script
//
// ISSUES:
// * not working on Mac yet

///////////////////
// EXAMPLE USAGE //
///////////////////
/*
    
    
// create an instance of the program with a file object
Program = new Exec(new File("/c/Program Files/Program Name/program.exe"));


// create one or more "go" methods, with optional arguments,
// to execute the app
Program.Go = function(folder) {
    var args = ["/slideshow=" + folder.fsName, "/closeslideshow"];
    this.executeAsynch(args);
};

// create a "go" method to read data from stdio
Program.getInfo = function(arg) {
    if (!arg) {
        return '';
    }
    var args = [];

    // if a file object is passed, surround it in double-quotes to prevent issues with space
    if (arg instanceof File) {
        args.push('\"' + arg.fsName + '\"');
    }
    // likewise with a folder object
    else if (arg instanceof Folder) {
        args.push('\"' + arg.fsName + "\\*\"");
    }
    // otherwise just pass the argument as a string
    else {
        args.push(arg.toString());
    }

    // file program will write output to
    var ifile = new File(this.tmp + "/info.txt");

    // parameter string that makes program output to file (e.g. echo > info.txt)
    args.push("/info=\"" + ifile.fsName + '\"');
    // any other arguments can be pushed
    args.push("/silent");
    // execute the program and wait for it to return
    this.executeSynch(args, 10000);
    // open the output file, read it, and close it
    ifile.open("r");
    var str = ifile.read();
    ifile.close();
    ifile.remove();
    // return the output
    return str;
};

// time to execute
var dir = new Folder("/h/pics");
Program.go(dir)

// get output string and use it
alert(Program.getInfo(dir));



OR

// quick execute synchronously and use output without an instance
alert(Exec.getOutput("dir " + dir.fsName, 10000);

// quick execute bash command and use output without an instance
alert(Exec.bash("ls -al", 10000);

*/









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