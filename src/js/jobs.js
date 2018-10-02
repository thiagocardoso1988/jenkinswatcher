var _ = require('lodash');
var jenkinsapi = require('jenkins-api');

let credentials = {}
let jobs = []
let jenkins = null


let setJenkinsLogin = () => {
  let connString = "https://{{user}}:{{pass}}@{{url}}".replace('{{user}}', credentials.user)
                                                     .replace('{{pass}}', credentials.password)
                                                     .replace('{{url}}', credentials.baseurl)
  console.log('connString',connString)
  jenkins = jenkinsapi.init(connString);
}

/**
 * Check if the jenkins acessor object is already initialized
 * @return {Boolean} true if jenkins object is not null
 */
let isJenkinsAvailable = () => { return jenkins != null }

let appendJob = (url) => {
  if (!isJobAdded(url)) {
    let job = createJobEntry(url);
    console.log('appendJob', job);
    jobs.push(job)
  }
  // return new Promise( (res, rej) => {
  //   jenkins.console_output('finance_targethost_install', '9355', function(err, data) {
  //     if (err) return rej(err)
  //     return res(data)
  //   })
  // })
}

/**
 * Check if a job with the given url already exists on jobs array
 * @param  {String}  url url to be checked
 * @return {Boolean}     true if the url already exists
 */
const isJobAdded = (url) => {
  return jobs.filter(e => e.url === url).length > 0
}

const parseJobURL = (url) => {
  let regexstr = '.*/job/(.*)/([0-9]+)'
  let result = url.match(regexstr)
  return {'url': url, 'jobname': result[1], 'jobid': result[2]}
}

let createJobEntry = (url) => {
  let jobparse = parseJobURL(url)
  if (isJenkinsAvailable()) {
    getBuildInfo(jobparse['jobname'], jobparse['jobid'])
      .then( (result) => {
        return parseBuildInfo(result, jobparse)
      })
    // jenkins.build_info(jobparse['jobname'], jobparse['jobid'], function(err, data) {
    //   if (err){ return console.log(err); }
    //   return parseBuildInfo(data, jobparse)
    // });
  }
}

let getBuildInfo = (jobname, jobid) => {
  return new Promise( (res, rej) => {
    jenkins.build_info(jobname, jobid, function(err, data) {
      if (err) return rej(err)
      return res(data)
    })
  })
}

let parseBuildInfo = (response, jobdata) => {
  return new Promise( (resolve, reject) => {
    jobdata.owner = response.actions[0].causes[0].userId
    jobdata.estimatedDuration = response.estimatedDuration
    jobdata.duration = response.duration
    jobdata.progress = parseInt(response.duration)/parseInt(response.estimatedDuration)
    jobdata.createdIn = new Date(response.timestamp)
    jobdata.result = response.result
    jobdata.buildInfo = response.actions[2].parameters.reduce(function(m,v){m[v.name] = v.value; return m;}, {})
    // jobdata.tapaslink = getBuildTapasLink(jobdata['jobname'], jobdata['jobid'])
    return resolve(jobdata)
  })
  // jobdata.owner = response.actions[0].causes[0].userId
  // jobdata.estimatedDuration = response.estimatedDuration
  // jobdata.duration = response.duration
  // jobdata.progress = parseInt(response.duration)/parseInt(response.estimatedDuration)
  // jobdata.createdIn = new Date(response.timestamp)
  // jobdata.result = response.result
  // jobdata.buildInfo = response.actions[2].parameters.reduce(function(m,v){m[v.name] = v.value; return m;}, {})
  // // jobdata.tapaslink = getBuildTapasLink(jobdata['jobname'], jobdata['jobid'])
  // console.log("parseBuildInfo", jobdata)
  //
  // return jobdata
}

let getBuildTapasLink = (jobname, jobid) => {
  let regexstr = 'Web url: (https://tapas.epk.ericsson.se/#.*)'
  // jenkins.console_output(jobname, jobid, function(err, data) {
  //   if (err){ return console.log(err); }
  //   let result = data.body.match(regexstr)
  //   console.log(result)
  //   return (result != "") ? result[1] : ""
  // });

  return new Promise( (res, rej) => {
    jenkins.console_output(jobname, jobid, function(err, data) {
      if (err) return rej(err)
      // return res(data)
      return res(data.body.match(regexstr))
    })
  })
}

let getJobs = () => {
  return jobs
}

/**
 * Return the 'credentials' object
 * @return {Object}
 */
let getCredentials = () => {
  return credentials
}

/**
 * Define the structure to the object or replace an existing value of the object
 * @param {String} user     username to be used when logging on Jenkins
 * @param {String} password password to grant the login
 * @param {String} url      base url to create the logged object
 */
let setCredentials = (user, password, url) => {
  credentials.user = user
  credentials.password = password
  credentials.baseurl = url
  setJenkinsLogin()
}

/**
 * Check if the 'credentials' object is initialized and has valid data
 * @return {Boolean} true if not empty and user/password are defined
 */
let isCredentialsEmpty = () => {
  return credentials === {} || !credentials.user || !credentials.password || !credentials.baseurl
}
