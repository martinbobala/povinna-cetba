let otpValue
let email
let bookList

const criteria = [
  { name: "World literature (20th and 21st century)", count: 4, currentCount: 0 },
  { name: "Česká literatura 20. a 21. století", count: 5, currentCount: 0 },
  { name: "Světová a česká literatura 19. století", count: 3, currentCount: 0 },
  { name: "Světová a česká literatura do konce 18. století", count: 2, currentCount: 0 },
  { name: "próza", count: 2, currentCount: 0 },
  { name: "poesie", count: 2, currentCount: 0 },
  { name: "drama", count: 2, currentCount: 0 },
  { name: "počet knih", count: 20, currentCount: 0 },
]


function drawAlert(text) {
  alert(text)
}

function makeBookList() {
  
  fetch("https://script.google.com/macros/s/AKfycbwcnwHAjGUjS5OIApbrkRqbuqhIqE_B9MriFo3ofsQqftPAhi4hGcbYFNetHz1XLP4w/exec")
    .then(res=> res.json())
    .then(data => {
      
      bookList = data.data
      
      bookList.forEach(book => {
        
        if (book.genre !== "" || book.category !== "") {
          
          const listItem = document.createElement('li')
          
          listItem.innerHTML = `<input type='checkbox' value='${book.name}'><span class="book">${book.name}</span> <span class="author">${book.autor}(${book.genre})</span>`
          
          document.getElementById(book.category).appendChild(listItem);
        }
        
        else{
          console.log("Chybí kategorie nebo žánr Knihy, Prosím zkontrolujte Google tabulku povinna cetba a jeji hodnoty u knihy " + book.name )
        }
      })
      
      onCheckboxChange()
    
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

    email = document.getElementById("email")
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

function getObjectByName(name, arr) {
  return arr.find(item => item.name === name)
}


function onCheckboxChange() {
  
  let checkedCheckboxes = [];
  
  
  function handleCheckboxChange(event) {
    
    const checkBoxValue = event.target.value
    
    
    if (event.target.checked) {
      
      const book = getObjectByName(checkBoxValue, bookList)

      const genreCriterium = getObjectByName(book.genre, criteria)
      const categoryCriterium = getObjectByName(book.category, criteria)
      const countCriterium = getObjectByName("počet knih", criteria)

      const criteriaArr = [genreCriterium, categoryCriterium, countCriterium]
      
      criteriaArr.forEach(criterum =>{

        criterum.currentCount =+ 1

      })
      
     
      console.log(criteriaArr);
      
      
      
      checkedCheckboxes.push(checkBoxValue)
      
    } else {
      
      const index = checkedCheckboxes.indexOf(checkBoxValue)
      if (index !== -1) {
        checkedCheckboxes.splice(index, 1)
      }
    }
    
    
    
    //console.log("Checked checkboxes:", checkedCheckboxes)
  }
  
  
  const checkBoxes = document.querySelectorAll('input[type="checkbox"]')
  
  checkBoxes.forEach(checkbox => {
    checkbox.addEventListener("change", handleCheckboxChange)
    
  })
  
}



function submitForm(){
  document.getElementById("form").addEventListener("submit", function(e) {
    e.preventDefault()
    
    
    
    let missingCriteria = [];
    
    
    
  }) 
}

document.addEventListener("DOMContentLoaded", function() {
  
  
  sendOtp()
  submitForm()
})


makeBookList()




