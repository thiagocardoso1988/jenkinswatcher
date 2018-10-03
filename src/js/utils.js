let alerttmpl = '<div class="alert alert-{{classtype}} alert-dismissible fade show" role="alert">'
              + '{{message}}'
              + '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
              + '<span aria-hidden="true">&times;</span></button></div>'
let badgetmpl = '<span class="badge btn-block badge-{{classtype}}" style="margin:0px;">{{message}}</span>'
let rowtmpl = '<tr class="row">'
            + '  <th class="col-2" scope="row">{{createdin}}</th>'
            + '  <td class="col-2">{{jobtype}}</td>'
            + '  <td class="col-1">{{jobid}}</td>'
            + '  <td class="col-2">{{owner}}</td>'
            + '  <td class="col-1" style="display:flex;align-items:center">{{status}}</td>'
            + '  <td class="col-2" style="display:flex;align-items:center">{{progress}}</td>'
            + '  <td class="col-2">{{btns}}</td>'
            + '</tr>'
let btnactionstmpl = '<button type="button" class="btn btn-outline-dark btn-sm" data-toggle="tooltip" data-placement="bottom" title="Fetch status"><i class="fas fa-sync-alt"></i></button>\n'
                   + '<button type="button" class="btn btn-outline-dark btn-sm" data-toggle="tooltip" data-placement="bottom" title="Open job"><i class="fas fa-external-link-alt"></i></button>\n'
                   + '<button type="button" class="btn btn-outline-dark btn-sm js-copy-btn" copy-link="test1" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Copy Tapas link"><i class="far fa-copy"></i></button>\n'
                   + '<button type="button" class="btn btn-outline-danger btn-sm" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Unfollow this job"><i class="far fa-trash-alt"></i></button>\n'
                   + '<button type="button" class="btn btn-outline-success btn-sm" data-toggle="tooltip" data-placement="bottom" title="Show detailed info"><i class="fas fa-info"></i></button>\n'
// let progbartmpl = '<div class="progress" style="height:100%">'
let progbartmpl = '<div class="progress" style="margin:0px;width: 100%">'
               + '  <div class="progress-bar {{status}}" role="progressbar" style="font-size:.9em;width:{{width}}%" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="100">{{value}}%</div>'
               + '</div>'

let createProgbar = (value) => {
  let status
  width=value
  if (value<100) { status="bg-primary" }
  else if (value==100) { status="bg-success" }
  else { status="bg-danger"; width=100 }
  return progbartmpl.replace('{{status}}', status)
      .replace(new RegExp('{{value}}', 'g'), value)
      .replace('{{width}}', width)
}

let addBsAlert = (classtype, message) => {
  let alert = alerttmpl.replace('{{classtype}}', classtype)
      .replace('{{message}}', message)
  $('#alert-area').append(alert)
}

let addJobRow = (jobs) => {
  // for (let job of jobs) {
  jobs.forEach( (job, idx) => {
    let status = createStatusBadge(job.result)
    let progbar = createProgbar(Math.round(job.progress * 100))
    let btns = btnactionstmpl
    let jobrow = rowtmpl.replace('{{createdin}}', job.createdIn)
        .replace('{{jobtype}}', job.jobtype)
        .replace('{{jobid}}', job.jobid)
        .replace('{{owner}}', job.owner)
        .replace('{{status}}', status)
        .replace('{{progress}}', progbar)
        .replace('{{btns}}', btns)
    $('#jobs tbody').append(jobrow)
  })
  // }
}

let createStatusBadge = (status) => {
  let classtype, message=status
  switch (status) {
    case 'In Progress':
      classtype = 'primary'
      // message = 'In Progress'
      break;
    case 'SUCCESS':
      classtype = 'success'
      // message = 'In Progress'
      break;
    case 'UNSTABLE':
      classtype = 'warning'
      // message = 'In Progress'
      break;
    case 'Error':
      classtype = 'danger'
      // message = 'In Progress'
      break;
    default:
      classtype = 'dark'
      message = 'OTHER'
  }
  return badgetmpl.replace('{{classtype}}', classtype)
      .replace('{{message}}', message)
}
