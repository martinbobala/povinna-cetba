let otpValue

function drawAlert(text) {
  alert(text)
}

function makeBookList() {

// Funkce pro generování seznamu v HTML
function generateBookList() {
  let htmlCode = "<ul>\n";
  for (let i = 0; i < booksAuthors.length; i++) {
      let book = booksAuthors[i][0];
      let author = booksAuthors[i][1];
      let lowercaseBook = book.toLowerCase().replace(/\s+/g, '_');
      htmlCode += `<li><input type='checkbox' name='${lowercaseBook}' value='${book}'><span class="book">${book}</span> <span class="author">${author}</span></li>\n`;
  }
  htmlCode += "</ul>";
  return htmlCode;
}

// Generování seznamu knih a autorů
const bookList = generateBookList();

// Vložení seznamu do konkrétního kontejneru
document.getElementById('bookListContainer').innerHTML = bookList;


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

    let otpUserInput = document.getElementById("otpInput").value

    if (otpUserInput === otpValue) {
    console.log("tigri prej nekradou a ja videl tri ja v kurici jsou ");
    
    }
    else{
    console.log("chyba se bloudil");
    }




  }) 
}


document.addEventListener("DOMContentLoaded", function() {
 
  makeBookList()
  sendOtp()
  submitForm()
 
})




