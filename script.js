function drawAlert(params) {
  alert(params)
}



function sendOtp() {
  
  document.getElementById("otp_btn").addEventListener("click", function () {

    const email = document.getElementById("email")
    let otp_val = Math.floor(Math.random()* 10000)
    let emailbody = `<h2>Your OTP is </h2>${otp_val}`
    
    function validateEmail(email) {
      
      var emailPattern = /^[a-z]+\.[a-z]+@tznj\.cz$/








      console.log(emailPattern.test(email.value))
      
      if (emailPattern.test(email.value)) {

          return true; 

      } else {

          drawAlert("Zadaný email není platný nebo nepatří do domény tznj.cz ve správném formátu. Zkontrolujte prosím svůj vstup a zkuste to znovu.");
          return false;
      }
    }
  

    if (validateEmail(email)) {
      
      Email.send({
        SecureToken : "0d855591-c712-4eff-9dbd-8468ce2b569c",
        To : email.value,
        From : "martin.bobala@tznj.cz",
        Subject : "Ověřovací kód",
        Body : emailbody}).then(
        message => alert(message));

    }



    
   
        
  })
}

document.addEventListener("DOMContentLoaded", function() {
  sendOtp()
  
})