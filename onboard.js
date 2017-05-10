function satellitePageRead(expectedContent,friendly,prereq) {
    console.log(expectedContent,friendly,prereq,prevFriendly);
  	var prereq = prereq || "none";
  	//Expected content must be on page to proceed.
  	if(pgContents.indexOf(expectedContent) > -1) {
        //Detects if new page is same as previous & determine if form/page error calls are req'd.
        if (friendly == prevFriendly) {
          	var errorCount = pgContents.indexOf("Required")
            + pgContents.indexOf("Must be valid email")
            + pgContents.indexOf("Username or password incorrect")
            + pgContents.indexOf("Must be at least 8 characters");
            //Track error (not resetting the cookie), else do nothing.
            if (errorCount > -1) {
                _satellite.track("error-" + friendly);
            }
        }
        //If page is new, and doesn't require or meets prereqs, track the page, and reset the cookie.
        else if (prereq == "none" || prereq == prevFriendly) {      
          	_satellite.track(friendly);
            _satellite.setCookie("previousPage",friendly,1);
        }
    }
  
}

//Collect page contents and previous page cookie values on every call.
var pgContents = document.body.innerText;
var prevFriendly = _satellite.readCookie("previousPage");

satellitePageRead(window.DATA.signUpTitle,"newSignUpScreen");
satellitePageRead(window.DATA.loginTitle,"existingUserLoginScreen");
satellitePageRead("Download the Sharecare App to your mobile device now and sign in","existingUserAppScreen","eligibilityFormScreenExisting");
satellitePageRead("Download the Sharecare App to your mobile device now and sign in","newNonClientAppScreen","eligibilityFormScreenNew");

//Exception for home screen, since we have to wait for the signup/login modals to disappear.
setTimeout(function(){
    pgContents = document.body.innerText;
  	if (pgContents.indexOf(window.DATA.signUpTitle) == -1 && pgContents.indexOf(window.DATA.loginTitle) == -1) {
        satellitePageRead(window.DATA.landingPageContent,"homeScreen");
		}
  	satellitePageRead(window.DATA.eligibilityFormContent,"eligibilityFormScreenExisting","existingUserLoginScreen");
		satellitePageRead(window.DATA.eligibilityFormContent,"eligibilityFormScreenNew","newSignUpScreen");
},200);