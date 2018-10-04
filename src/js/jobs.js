var _ = require('lodash');
var jenkinsapi = require('jenkins-api');

let credentials = {}
let jobs = []
let jenkins = null


function setJenkinsLogin () {
  let connString = "https://{{user}}:{{pass}}@{{url}}"
          .replace('{{user}}', credentials.user)
          .replace('{{pass}}', credentials.password)
          .replace('{{url}}', credentials.baseurl)
  jenkins = jenkinsapi.init(connString);
}

function setCredentials (user, password, url) {
  credentials.user = user
  credentials.password = password
  credentials.baseurl = url
  setJenkinsLogin()
}

/**
 * Check if the 'credentials' object is initialized and has valid data
 * @return {Boolean} true if not empty and user/password are defined
 */
function isCredentialsEmpty () {
  return credentials === {} || !credentials.user || !credentials.password || !credentials.baseurl
}

/**
 * Return the 'credentials' object
 * @return {Object}
 */
function getCredentials () {
  return credentials
}

/**
 * Check if the jenkins acessor object is already initialized
 * @return {Boolean} true if jenkins object is not null
 */
function isJenkinsAvailable () {
  return jenkins != null
}

async function appendJob (url) {
  if (!isJobAdded(url) && isJenkinsAvailable()) {
    let job = createJobEntry(url).then( (info) => {
      jobs.push(info)
      rendererJobs()
    })
  }
}

/**
 * Check if a job with the given url already exists on jobs array
 * @param  {String}  url url to be checked
 * @return {Boolean}     true if the url already exists
 */
function isJobAdded (url) {
  return jobs.filter(e => e.url === url).length > 0
}

function parseJobURL (url) {
  let regexstr = '.*/job/(.*)/([0-9]+)'
  let result = url.match(regexstr)
  return {'url': url, 'jobname': result[1], 'jobid': result[2]}
}

async function createJobEntry (url) {
  let jobparse = parseJobURL(url)
  return getJobInfo(jobparse)
}

async function updateJobs () {
  console.log('updateJobs')
  if (isJenkinsAvailable()) {
    for (let job of jobs) {
      console.log(job.jobid);
      job = getJobInfo(job)
      rendererJobs()
    }
  }
}

async function getJobInfo (jobdata) {
  let rawinfo = await getBuildInfo(jobdata['jobname'], jobdata['jobid'])
  let info = await parseBuildInfo(rawinfo, jobdata)
  return info
}

function getBuildInfo (jobname, jobid) {
  return new Promise( (res, rej) => {
    jenkins.build_info(jobname, jobid, function(err, data) {
      if (err) return rej(err)
      return res(data)
    })
  })
}

function parseBuildInfo (response, jobdata) {
  console.log(response)
  return new Promise( (resolve, reject) => {
    jobdata.owner = getJobOwner(response)
    jobdata.estimatedDuration = response.estimatedDuration
    jobdata.duration = (response.duration==0) ? parseInt(new Date().getTime()-response.timestamp) : parseInt(response.duration)
    jobdata.progress = jobdata.duration/jobdata.estimatedDuration
    jobdata.createdIn = new Date(response.timestamp)
    jobdata.result = (response.building) ? 'BUILDING' : response.result
    // jobdata.buildInfo = getJobBuildParameters(response).reduce(function(m,v){m[v.name] = v.value; return m;}, {})
    jobdata.buildInfo = getJobBuildParameters(response)
    // jobdata.tapaslink = await getBuildTapasLink(jobdata['jobname'], jobdata['jobid'])
    getBuildTapasLink(jobdata['jobname'], jobdata['jobid']).then( data => {
      jobdata.tapaslink = data
    })
    console.log(jobdata);
    return resolve(jobdata)
  })
}

/**
 * Find the object that contains the user who started the jobs
 * @param  {Array}  response response object returned by Jenkins API
 * @return {Object}          user data object
 */
function getJobOwner (response) {
  for (let action of response.actions) {
    if (action._class != undefined
          && action.causes != undefined
          && action.causes[0].userId != undefined) {
      return action.causes[0]
    }
  }
}

function getJobBuildParameters (response) {
  for (let action of response.actions) {
    if (action._class != undefined
          && action.parameters != undefined
          && action.parameters.length > 0) {
      return action.parameters
    }
  }
}

function getBuildTapasLink (jobname, jobid) {
  let regexstr = 'Web url: (https://tapas.epk.ericsson.se/#.*)'
  return new Promise( (res, rej) => {
    jenkins.console_output(jobname, jobid, function(err, data) {
      if (err) return rej(err)
      return res(data.body.match(regexstr))
    })
    // return res("ok")
  })
}
