const express = require("express");
const bodyParser = require('body-parser');
const request = require('request');

const https = require("https");

const app = express();

const keys = require(__dirname + "/keys.json");

app.use(bodyParser.urlencoded({extended: true}));

// use static files on express server by declaring the static folder
app.use(express.static("public"));


app.get("/", function(req,res){
  res.sendFile(__dirname + "/signup.html");

})

app.post("/", function(req,res){
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstname,
          LNAME: lastname
        }
      }
    ]
  }
  
  var jsonData = JSON.stringify(data);

  

  const url = "https://us19.api.mailchimp.com/3.0/lists/" + keys.listID;
  const authentication = "anything:" + keys.api;

  // console.log(authentication);
  // console.log(url);
  

  const options = {
    method: "POST",
    auth: authentication
  }

  const request = https.request(url, options, function(response){
    if(response.statusCode == 200){
      res.sendFile(__dirname + "/success.html");
    }else{
      res.sendFile(__dirname + "/failure.html");
      console.log(response.statusCode)
      console.log(response.statusMessage)
      
    }
    
    response.on("data", function(data){
      // console.log(JSON.parse(data))
    })

  })

  request.write(jsonData);
  request.end();

  // res.send("Success!");

})

app.post("/failure", function(req,res){
  
  // redirects to home route which triggers app.get("/" ...)
  res.redirect("/")


})


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started");

})

