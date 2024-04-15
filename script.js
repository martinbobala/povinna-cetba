let otpValue
let emailG
let bookList

const criteria = [
  { name: "Světová literatura 20. a 21. století", count: 4, currentCount: 0, errorMessage: "Vyberte minimálně 4 knihy z kategorie Světová literatura 20. a 21. století." },
  { name: "Česká literatura 20. a 21. století", count: 5, currentCount: 0, errorMessage: "Vyberte minimálně 5 knih z kategorie Česká literatura 20. a 21. století." },
  { name: "Světová a česká literatura 19. století", count: 3, currentCount: 0, errorMessage: "Vyberte minimálně 3 knihy z kategorie Světová a česká literatura 19. století."},
  { name: "Světová a česká literatura do konce 18. století", count: 2, currentCount: 0, errorMessage: "Vyberte minimálně 2 khihy z kategorie Světová a česká literatura do konce 18. století." },
  { name: "próza", count: 2, currentCount: 0, errorMessage: "Vyberte minimálně 2 díla z kategorie próza." },
  { name: "poezie", count: 2, currentCount: 0, errorMessage: "Vyberte minimálně 2 díla z kategorie poesie."},
  { name: "drama", count: 2, currentCount: 0, errorMessage: "Vyberte minimálně 2 díla z kategorie drama."},
  { name: "počet knih", count: 20, currentCount: 0, errorMessage:"Vyberte alespoň 20 knih." },
  { name: "autoři", currentCount: [], count: 2, errorMessage: "Můžete vybrat maximálně dvě knihy od stejného autora." },

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

    otpValue = generateOTP()
    
    
    let emailbody = "<h2>Your OTP is </h2>" + otpValue
    let emailValue = document.getElementById("email")
    
    function validateEmail(email) {
      
      let emailPattern = /^[a-z]+\.[a-z]+@tznj\.cz$/
      
      if (emailPattern.test(email.value) && emailAlreadySent === false) {

        drawAlert("E-mail byl úspěšně odeslán na adresu " + email.value + ". Prosím, zkontrolujte složku s nevyžádanou poštou spam, pokud e-mail není v doručené poště.")
        emailAlreadySent = true
        emailG = emailValue
        return true

      } else if(emailAlreadySent === true){

        drawAlert("E-mail již byl úspěšně odeslán. Prosím, zkontrolujte složku s nevyžádanou poštou (spam), pokud e-mail není v doručené poště.")
        return false
    
      } else {
        
        drawAlert("Zadaný email není platný nebo nepatří do domény tznj.cz ve správném formátu. Zkontrolujte prosím svůj vstup a zkuste to znovu.");
        return false
      }
    }
    
    if (validateEmail(emailValue)) {
      
      Email.send({
        SecureToken : "0d855591-c712-4eff-9dbd-8468ce2b569c",
        To : emailG.value,
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
  
   
  function handleCheckboxChange(event) {
    
    const book = getObjectByName(event.target.value, bookList)

    const genreCriterium = getObjectByName(book.genre, criteria)
    const categoryCriterium = getObjectByName(book.category, criteria)
    const countCriterium = getObjectByName("počet knih", criteria)

    const autorCriterium = getObjectByName("autoři", criteria)
    const autorArr = autorCriterium.currentCount

    const criteriaArr = [genreCriterium, categoryCriterium, countCriterium]
    

    function removeData(){
      const index = autorArr.indexOf(book.autor);
        if (index !== -1) {
          autorArr.splice(index, 1)
        }
    
      criteriaArr.forEach(criterum =>{

        criterum.currentCount -= 1
      })

    }
    
    if (event.target.checked) {
      
      autorArr.push(book.autor)

      criteriaArr.forEach(criterum =>{

        criterum.currentCount += 1
      })
      
      const count = {}

      autorArr.forEach(autor => {
        count[autor] = (count[autor] || 0) +1
        if (count[autor] > autorCriterium.count) {
          removeData()
          event.target.checked = false
          drawAlert(autorCriterium.errorMessage)
        }
        
      })
      
    } else {
      
      removeData()
      
    }
    
  }
  
  
  const checkBoxes = document.querySelectorAll('input[type="checkbox"]')
  
  checkBoxes.forEach(checkbox => {
    checkbox.addEventListener("change", handleCheckboxChange)
    
  })
  
}



function submitForm(){
  document.getElementById("submitButton").addEventListener("click", function(e) {
    e.preventDefault()

    let missingCriteria = []
    
    function checkCriteria() {
      criteria.slice(0, -1).forEach(criterium => {
        if (criterium.count <= criterium.currentCount) {
          
          
        }else{
         
          missingCriteria.push(criterium.errorMessage)
          
        }
      })

      if (missingCriteria.length == []) {
        return true
      } else {
        console.log(missingCriteria)
        return false
      }
    }
    
    console.log(checkCriteria());

   


  
  }) 
}

document.addEventListener("DOMContentLoaded", function() {
  
  
  sendOtp()
  submitForm()
})


makeBookList()




