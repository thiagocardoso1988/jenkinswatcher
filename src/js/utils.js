let alerttmpl = '<div class="alert alert-{{classtype}} alert-dismissible fade show" role="alert">'
              + '{{message}}'
              + '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
              + '<span aria-hidden="true">&times;</span></button></div>'

let badgetmpl = '<span class="badge btn-block badge-{{classtype}}">{{message}}</span>'
let rowtmpl = '<tr class="row">'
            + '  <th class="col-1" scope="row">{{id}}</th>'
            + '  <td class="col-3">{{jobtype}}</td>'
            + '  <td class="col-1">{{jobid}}</td>'
            + '  <td class="col-2">{{owner}}</td>'
            + '  <td class="col-1">{{status}}</td>'
            + '  <td class="col-2">{{lastupdate}}</td>'
            + '  <td class="col-2">{{btns}}</td>'
            + '</tr>'
let btnactionstmpl = '<button type="button" class="btn btn-outline-dark btn-sm" data-toggle="tooltip" data-placement="bottom" title="Fetch status"><i class="fas fa-sync-alt"></i></button>'
                   + '<button type="button" class="btn btn-outline-dark btn-sm" data-toggle="tooltip" data-placement="bottom" title="Open job"><i class="fas fa-external-link-alt"></i></button>'
                   + '<button type="button" class="btn btn-outline-dark btn-sm js-copy-btn" copy-link="test1" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Copy Tapas link"><i class="far fa-copy"></i></button>'
                   + '<button type="button" class="btn btn-outline-danger btn-sm" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Unfollow this job"><i class="far fa-trash-alt"></i></button>'
                   + '<button type="button" class="btn btn-outline-success btn-sm" data-toggle="tooltip" data-placement="bottom" title="Show detailed info"><i class="fas fa-info"></i></button>'

let addBsAlert = (classtype, message) => {
  let alert = alerttmpl.replace('{{classtype}}', classtype).replace('{{message}}', message)
  $('#alert-area').append(alert)
}

let addJobRow = (job) => {
}

let createStatusBadge = (status) => {
  let classtype, message
  switch (status) {
    case 'In Progress':
      classtype = 'primary'
      message = 'In Progress'
      break;
    case 'Success':
      classtype = 'success'
      message = 'In Progress'
      break;
    case 'Unstable':
      classtype = 'warning'
      message = 'In Progress'
      break;
    case 'Error':
      classtype = 'danger'
      message = 'In Progress'
      break;
    default:
      classtype = 'dark'
      message = 'Other'
  }
  return badgetmpl.replace('{{classtype}}', classtype).replace('{{message}}', message)
}
