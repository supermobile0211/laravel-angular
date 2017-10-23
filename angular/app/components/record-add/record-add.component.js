class RecordAddController {
  constructor (API, $state, $filter, $stateParams, AclService) {
    'ngInject'

    this.$state = $state
    this.formSubmitted = false
    this.API = API
    this.filter = $filter
    this.alerts = []

    this.hasRole = AclService.hasRole

    if ($stateParams.alerts) {
      this.alerts.push($stateParams.alerts)
    }

    if(this.hasRole('role.admin')) {
      let Consumers = API.service('consumers', API.all('users'))
      Consumers.getList()
        .then((response) => {
          let consumers = []
          let consumerResponse = response.plain()

          angular.forEach(consumerResponse, function (value) {
            consumers.push({id: value.id, name: value.name})
          })

          this.consumers = consumers
        })
    }
  }

  save (isValid) {
    this.$state.go(this.$state.current, {}, { alerts: 'test' })
    if (isValid) {
      let Records = this.API.service('records', this.API.all('users'))
      let $state = this.$state
      let time = this.filter('date')(this.time, 'shortTime')

      Records.post({
        'user_id': this.consumer,
        'date': this.date,
        'time': time,
        'description': this.description,
        'amount': this.amount,
        'comment': this.comment
      }).then(function () {
        let alert = { type: 'success', 'title': 'Success!', msg: 'Record has been added to this user.' }
        $state.go($state.current, { alerts: alert})
      }, function (response) {
        let alert = { type: 'error', 'title': 'Error!', msg: response.data.message}
        $state.go($state.current, { alerts: alert})
      })
    } else {
      this.formSubmitted = true
    }
  }

  $onInit () {}
}

export const RecordAddComponent = {
  templateUrl: './views/app/components/record-add/record-add.component.html',
  controller: RecordAddController,
  controllerAs: 'vm',
  bindings: {}
}
