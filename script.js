let otpValue

function drawAlert(text) {
  alert(text)
}

function makeBookList() {
  
  fetch("https://script.google.com/macros/s/AKfycbwcnwHAjGUjS5OIApbrkRqbuqhIqE_B9MriFo3ofsQqftPAhi4hGcbYFNetHz1XLP4w/exec")
    .then(res=> res.json())
    .then(data => {
      
      let bookData = data.data
      
      bookData.forEach(book => {

        if (book.genre !== "" || book.category !== "") {
          
          const listItem = document.createElement('li')
        
          listItem.innerHTML = `<input type='checkbox' value='${book.name}'><span class="book">${book.name}</span> <span class="author">${book.autor}</span>`
          
          document.getElementById(book.category).appendChild(listItem);
        }

        else{
          console.log("Chybí kategorie nebo žánr Knihy, Prosím zkontrolujte Google tabulku povinna cetba a jeji hodnoty u knihy " + book.name )
        }
      })

    })


}

function sendOtp() {
  
  let emailAlreadySent = false

  document.getElementById("otpButton").addEventListener("click", function () {

    function generateOTP() {
      const digits = 6
      const min = Math.pow(10, digits - 1)
      const max = Math.pow(10, digits) - 1 
      return Math.floor(Math.random() * (max - min + 1)) + min
      
    }

    const email = document.getElementById("email")
    otpValue = generateOTP()
  
    
    let emailbody = "<h2>Your OTP is </h2>" + otpValue
    
    function validateEmail(email) {
      
      let emailPattern = /^[a-z]+\.[a-z]+@tznj\.cz$/
      
      if (emailPattern.test(email.value) && emailAlreadySent === false) {

        drawAlert("E-mail byl úspěšně odeslán na adresu " + email.value + ". Prosím, zkontrolujte složku s nevyžádanou poštou spam, pokud e-mail není v doručené poště.")
        emailAlreadySent = true
        return true

      } else if(emailAlreadySent === true){

        drawAlert("E-mail již byl úspěšně odeslán. Prosím, zkontrolujte složku s nevyžádanou poštou (spam), pokud e-mail není v doručené poště.")
        return false
    
      } else {

        drawAlert("Zadaný email není platný nebo nepatří do domény tznj.cz ve správném formátu. Zkontrolujte prosím svůj vstup a zkuste to znovu.");
        return false
      }
    }
  
    if (validateEmail(email)) {
      
      Email.send({
        SecureToken : "0d855591-c712-4eff-9dbd-8468ce2b569c",
        To : email.value,
        From : "martin.bobala@tznj.cz",
        Subject : "Ověřovací kód",
        Body : emailbody}).then(
        message => console.log(message));

    }
   
  })
  
}

function submitForm(){
  document.getElementById("form").addEventListener("submit", function() {

    function sendDataToSheets(formDataString) {

      fetch(
        "https://script.google.com/macros/s/AKfycbwVND3ufXn-_-jGzNjhbXI5USI6xuN6QlEvx-HGgfv42o2L96SDdeLcx_ZGrzPkyEL7/exec",
        {
          redirect: "follow",
          method: "POST",
          body: formDataString,
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
        }
      )
        .then(function (response) {
          
          if (response) {
            console.log("odeslano");
            return response;
          } else {
            throw new Error("Failed to submit the form.");
          }
        })
    }
   
    // check let otpUserInput = document.getElementById("otpInput").value
  
    let formData = new FormData(this);
    for (let [name, value] of formData.entries()) {
      console.log(`${name}: ${value}`);
    }
    
    let checkboxes = document.querySelectorAll('#form ul input[type="checkbox"]:checked');
    checkboxes.forEach(function(checkbox) {
        console.log(checkbox.value);
    })

  }) 
}

document.addEventListener("DOMContentLoaded", function() {
 
  sendOtp()
  submitForm()
  
})


makeBookList()




