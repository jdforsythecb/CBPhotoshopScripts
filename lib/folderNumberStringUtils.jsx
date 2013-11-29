// utilities for folder number strings

// usage:
// myFolder = new folderNumberStringUtils("F-1023");
//
// myFolder.setCurrentCompany();
//
// myFolder.currentCompany = myFolder.CompanyTypes.MONTHLYMAIL;
//
// test = myFolder.isChurchBudget();
//
// myObj = myFolder.decipherString();
// myObj { status: 0/1 (ok/fail), folder: properFolderNumberString, message: error message, if any }


folderNumberStringUtils = function(input) {
    
    // what folder number string
    this.input = input;
    // this allows you to keep track of the company instead of reusing the "is" methods repeatedly
    // so you can if/ifelse/else or switch on instance.currentCompany against instance.CompanyTypes
    this.currentCompany = "";

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
        if      (this.isChurchBudget()) this.currentCompany = this.CompanyTypes.CHURCHBUDGET;
        else if (this.isMcDaniel())     this.currentCompany = this.CompanyTypes.MCDANIEL;
        else if (this.isUnited())       this.currentCompany = this.CompanyTypes.UNITED;
        else if (this.isMonthlyMail())  this.currentCompany = this.CompanyTypes.MONTHLYMAIL;
        
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

}