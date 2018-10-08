window.jQuery = window.$ = require('jquery');
require('popper.js');
require('bootstrap');
require('../js/utils.js');
require('../js/jobs.js');
// require('../js/test.js');
var shell = require('electron').shell;

const REFRESH_INTERVAL = 10 * 1000 // refresh interval for fetch new data over the added jobs
const DELETE_OPERATION = false // ensures that when a deletion is happening, no update will proceed



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
  setCredentials($("#inputUsername").val(), $("#inputPassword").val(), $("#inputJenkinsURL").val())
})

$("body").on("click", "#btnUpdateAll", function(evt) {
  evt.preventDefault()
  refreshJobs()
})

let refreshJobs = () => {
  // if (jobs.length > 0 && !DELETE_OPERATION) {
    updateJobs()
    rendererJobs()
  // }
}

let addMissingCredAlert = () => {
  addBsAlert("danger", 'You need to set your credentials before proceding. <a href="#" data-toggle="modal" data-target="#settingsModal" class="alert-link">Click here</a> to set it.')
}

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
  if (!isCredentialsEmpty()) {
    let urls = $("#jobURL").val().split(";")
    addJobs(urls)
  } else {
    addMissingCredAlert()
  }
  $("#jobURL").attr("style", "").val("")
})

// async function addJobs (urls) {
//   console.log(urls)
  // for (let url of urls) {
  //   appendJob(url)
  // }
// }

let addJobs = async (urls) => {
  // let jobs = await addJobs('t')
  for (let url of urls) {
    let job = await appendJob(url)
  }
}

let rendererJobs = () => {
  $('#jobs tbody').html("")
  addJobRow(jobs)
}

let getJobById = (id) => {
  // console.log(id);
  return jobs.find( j => { return parseInt(j.jobid) == parseInt(id) })
}


let showJobInfo = (job) => {
  // console.log(job)
  let jobinfo
  $("#jobInfoModal #jobInfoTitle").html("Job "+job.jobid)
  try {
    // console.log(job.buildInfo)
    jobinfo = job.buildInfo.reduce(function(m,v){m[v.name] = v.value; return m;}, {})
  } catch (e) {
    jobinfo = "No info available"
  }
  $("#jobInfoModal pre").html(JSON.stringify(jobinfo, null, 2))
  // $("#jobInfoModal").modal(show=true)
}

/**
 * Calls function to show job information when clicking button info
 * @param  {Event} evt click-event information
 * @return {Null}
 */
$("body").on("click", ".job-info-btn", function(evt) {
  evt.preventDefault()
  let jobid = $(this).parent().siblings(".jobid").text()
  let job = getJobById(jobid)
  showJobInfo(job)
})

/**
 * Calls function for update jobs info on screen continuously
 * @return {Null}
 */
setInterval(function() {
  console.info('Scheduled jobs refresh')
  refreshJobs()
}, REFRESH_INTERVAL)

/**
 * Get job information and open the job url in a new native browser
 * @param  {Event} evt click-event information
 * @return {Null}
 */
$("body").on("click", ".open-new-window-btn", function(evt) {
 evt.preventDefault()
 let jobid = $(this).parent().siblings(".jobid").text()
 let job = getJobById(jobid)
 shell.openExternal(job.url)
})

$("body").on("click", ".delete-job-btn", function(evt) {
  // DELETE_OPERATION=!DELETE_OPERATION
  evt.preventDefault()
  let jobid = $(this).parent().siblings(".jobid").text()
  let job = getJobById(jobid)
  // for (var idx in jobs) {
  //   console.log(idx, jobs[idx], job.jobid)
  //   if (jobs[idx].jobid == job.jobid) {
  //     jobs.splice(idx, 1)
  //   }
  // }
  let idx = jobs.indexOf(job)
  // console.log('idx', idx)
  jobs.splice(idx, 1)
  refreshJobs()
  // DELETE_OPERATION=!DELETE_OPERATION
})
