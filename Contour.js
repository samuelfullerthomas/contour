/**
*   Contour 1.0.0
*   By Sam Thomas & Omari Wallace
*   The MIT License (MIT)
*   Copyright (c) 2016 Samuel Thomas & Omari Wallace
**/

var request = require('request')
var fs = require('fs')
var say = require('say')

// ************************ START EDIT ************************************
//  This is where you get your own api key! You can get it here:
//  https://developers.google.com/maps/documentation/geocoding/get-api-key

var apiKey = 'Get a key! It is fun and easy'

//  Put your array just here, where the current test array is. You can do it!
//  we believe in you!

var addressesArray = ['28 E 28th St, New York, NY 10016',
'35 King Street London WC2E 8JG UK',
'230 W. Superior Street, Chicago IL 60654 USA']

//  That's it! That is the end of the things you need to edit!
// ************************ END EDIT ************************************

if (apiKey === 'Get a key! It is fun and easy') {
  say.speak('Victoria', 'Please, get an API key, insert it into the file, then try again', 1)
  console.log('Forget something? Like the API key?')
} else {
  getLatLong(addressesArray)
}

// Main func
function getLatLong (arr, latArr, num, errorCount) {
  latArr = latArr || []
  errorCount = errorCount || 0
  num = num || 0
  var length = arr.length - 1
  if (num <= length) {
    request('https://maps.googleapis.com/maps/api/geocode/json?address=' + arr[num].replace(/\s/g, '+') + '&key=' + apiKey, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        body = JSON.parse(body)
        if (body && body.results && body.results[0] && body.results[0].geometry && body.results[0].geometry.location) {
          latArr.push(body.results[0].geometry.location)
        } else {
          //  logs out any addresses that couldn't be looked up and didn't throw an error, for whatever reason
          var errorMessage = 'Error on ' + arr[num] + '. Error message as follows: "' + body.error_message + '"'
          if (errorCount === 0) {
            say.speak('Victoria', 'Error. Please consult the console.', 1)
          }
          errorCount++
          console.log(errorMessage)
        }
        if (num === length && errorCount === 0) {
          fs.writeFile('resultslatlong.txt', JSON.stringify(latArr), function (err) {
            if (err) {
              //  errors thrown here
              return console.log(err)
            }
            say.speak('Victoria', 'You\'re the man now dog', 1)
            //  checks to see if the results are the same as the the expected length
            console.log(latArr.length + ' === ' + arr.length)
            console.log('Congrats, it looks like everything went according to plan...')
            console.log('Now run: `open resultslatlong.txt`')
          })
        }
        if (num < length) {
          num++
          getLatLong(arr, latArr, num, errorCount)
        }
      } else {
        console.log(error)
      }
    })
  }
  /**
  * Developer's note: I mean, could and should I have done this with promises?
  * Yes, of course. Did I? No. I wrote this in about 10 minutes because I had
  * a project to do, and then commented it for a bit longer than that because
  * commenting is fun. If you want to refactor it, by all means, be my guest!
  **/
}
