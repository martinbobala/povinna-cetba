
  
  

        
        document.getElementById("form").addEventListener("submit", function (e) {
          e.preventDefault(); // Prevent the default form submission
          if (true) {
            
            
            document.getElementById("message").textContent = "Submitting.."
            document.getElementById("message").style.display = "block"
            document.getElementById("submit-button").disabled = true
            
            
            let formData = new FormData(this);
            let keyValuePairs = [];
            for (let [name , value] of formData.entries()) {
              keyValuePairs.push(value)
              
            }
            function extractNameFromEmail(email) {
                  let parts = email.split('@');
                  let nameParts = parts[0].split('.');
                  let fullName = nameParts.map(function(part) {
              return part.charAt(0).toUpperCase() + part.slice(1)
                }).join(' ')
            
                return fullName;
            }
            
            
            
            keyValuePairs.splice(1, 0, extractNameFromEmail(keyValuePairs[0]))
            
            let formDataString = keyValuePairs.join("&")    
            
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
                // Check if the request was successful
                if (response) {
                  return response; // Assuming your script returns JSON response
                } else {
                  throw new Error("Failed to submit the form.");
                }
              })
              .then(function (data) {
                // Display a success message
                document.getElementById("message").textContent =
                  "Data submitted successfully!";
                document.getElementById("message").style.display = "block";
                document.getElementById("message").style.backgroundColor = "green";
                document.getElementById("message").style.color = "beige";
                document.getElementById("submit-button").disabled = false;
                document.getElementById("form").reset();
        
                setTimeout(function () {
                  document.getElementById("message").textContent = "";
                  document.getElementById("message").style.display = "none";
                }, 2600);
              })
              .catch(function (error) {
                // Handle errors, you can display an error message here
                console.error(error);
                document.getElementById("message").textContent =
                  "An error occurred while submitting the form.";
                document.getElementById("message").style.display = "block";
              });
      }});
 
  
  
  
  
  