class RecordEditController {
  constructor (API, $state, $filter, $stateParams) {
    'ngInject'

    this.$state = $state
    this.formSubmitted = false
    this.API = API
    this.alerts = []
    this.filter = $filter

    if ($stateParams.alerts) {
      this.alerts.push($stateParams.alerts)
    }

    let recordId = $stateParams.recordId
    let RecordData = API.service('show', API.all('records'))
    RecordData.one(recordId).get()
      .then((response) => {
        this.recordeditdata = API.copy(response)
        let timestamp = Date.parse(this.recordeditdata.data.date + ' ' + this.recordeditdata.data.time)
        this.time = new Date(timestamp)
      })
  }

  save (isValid) {
    this.$state.go(this.$state.current, {}, { alerts: 'test' })
    if (isValid) {
      let $state = this.$state
      let time = this.filter('date')(this.time, 'shortTime')
      this.recordeditdata.data.time = time

      this.recordeditdata.put()
        .then(() => {
          let alert = { type: 'success', 'title': 'Success!', msg: 'Record has been updated.' }
          $state.go($state.current, { alerts: alert})
        }, (response) => {
          let alert = { type: 'error', 'title': 'Error!', msg: response.data.message }
          $state.go($state.current, { alerts: alert})
        })
    } else {
      this.formSubmitted = true
    }
  }

  $onInit () {}
}

export const RecordEditComponent = {
  templateUrl: './views/app/components/record-edit/record-edit.component.html',
  controller: RecordEditController,
  controllerAs: 'vm',
  bindings: {}
}
