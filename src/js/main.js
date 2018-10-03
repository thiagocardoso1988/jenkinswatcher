window.jQuery = window.$ = require('jquery');
require('popper.js');
require('bootstrap');
require('../js/utils.js');
require('../js/jobs.js');
// require('../js/test.js');




function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a flash,
  // so some of these are just precautions. However in IE the element
  // is visible whilst the popup box asking the user for permission for
  // the web page to copy to the clipboard.
  //

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent';


  textArea.value = text;

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
}

/*
var copyBobBtn = document.querySelector('.js-copy-bob-btn'),
  copyJaneBtn = document.querySelector('.js-copy-jane-btn');

copyBobBtn.addEventListener('click', function(event) {
  copyTextToClipboard('Bob');
});


copyJaneBtn.addEventListener('click', function(event) {
  copyTextToClipboard('Jane');
});
*/


/** save credentials *****************************************************/
$("body").on("click", "#saveSettings", function(evt) {
  evt.preventDefault()
  console.log('ok')
  setCredentials($("#inputUsername").val(), $("#inputPassword").val(), $("#inputJenkinsURL").val())
})


let runJobs = () => {
  if (!isCredentialsEmpty()) {
    // console.log("ok")
    addBsAlert('success', 'teste')
  } else {
    // console.log("oh no")
    addBsAlert('warning', 'teste')
  }
}

$("body").on("click", "#addJob", function(evt) {
  let url = $("#jobURL").val()
  appendJob(url)
  $("#jobURL").val("")
})

let rendererJobs = () => {

  let jobs = [{
    jobname: "test",
    jobid: 1,
    owner: "test1",
    estimatedDuration: "test1",
    duration: "test1",
    progress: 0.97841364,
    createdIn: "test1",
    result: "ABORTED",
    buildInfo: "test1",
    tapaslink: "test1"
  },{
    jobname: "test",
    jobid: 2,
    owner: "test2",
    estimatedDuration: "test2",
    duration: "test2",
    progress: 0.78346,
    createdIn: "test2",
    result: "UNSTABLE",
    buildInfo: "test2",
    tapaslink: "test2"
  },{
    jobname: "test",
    jobid: 3,
    owner: "test2",
    estimatedDuration: "test2",
    duration: "test2",
    progress: 1.78346,
    createdIn: "test2",
    result: "SUCCESS",
    buildInfo: "test2",
    tapaslink: "test2"
  },{
    jobname: "test",
    jobid: 3,
    owner: "test2",
    estimatedDuration: "test2",
    duration: "test2",
    progress: 1,
    createdIn: "test2",
    result: "SUCCESS",
    buildInfo: "test2",
    tapaslink: "test2"
  }]
  $('#jobs tbody').html("")
  addJobRow(jobs)
}
