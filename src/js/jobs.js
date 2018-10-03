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
  console.log('connString',connString)
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
  console.log('jenkins != null', jenkins != null)
  return jenkins != null
}

function appendJob (url) {
  if (!isJobAdded(url) && isJenkinsAvailable()) {
    let job = createJobEntry(url).then( (info) => {
      console.log(info)
      jobs.push(info)
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
  let rawinfo = await getBuildInfo(jobparse['jobname'], jobparse['jobid'])
  let info = await parseBuildInfo(rawinfo, jobparse)
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
  // console.log('parseBuildInfo', jobdata)
  return new Promise( (resolve, reject) => {
    jobdata.owner = response.actions[0].causes[0].userId
    jobdata.estimatedDuration = response.estimatedDuration
    jobdata.duration = response.duration
    jobdata.progress = parseInt(response.duration)/parseInt(response.estimatedDuration)
    jobdata.createdIn = new Date(response.timestamp)
    jobdata.result = response.result
    jobdata.buildInfo = response.actions[2].parameters.reduce(function(m,v){m[v.name] = v.value; return m;}, {})
    // jobdata.tapaslink = await getBuildTapasLink(jobdata['jobname'], jobdata['jobid'])
    getBuildTapasLink(jobdata['jobname'], jobdata['jobid']).then( data => {
      jobdata.tapaslink = data
    })
    return resolve(jobdata)
  })
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
