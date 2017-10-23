class RecordListsController {
  constructor ($scope, $state, $compile, DTOptionsBuilder, DTColumnBuilder, API, AclService) {
    'ngInject'
    this.API = API
    this.$state = $state
    this.$scope = $scope
    this.$compile = $compile
    this.DTOptionsBuilder = DTOptionsBuilder
    this.DTColumnBuilder = DTColumnBuilder

    this.hasRole = AclService.hasRole

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

    this.showRecords()
  }

  showRecords() {
    this.displayTable = false

    let Records = this.API.service('records', this.API.all('users'))
    if(this.consumer)
      Records = this.API.service('records', this.API.one('users', this.consumer))
   
    Records.getList()
      .then((response) => {
        let dataSet = response.plain()

        this.dtOptions = this.DTOptionsBuilder.newOptions()
          .withOption('data', dataSet)
          .withOption('createdRow', createdRow)
          .withOption('responsive', true)
          .withBootstrap()

        this.dtColumns = [
          this.DTColumnBuilder.newColumn('id').withTitle('ID'),
          this.DTColumnBuilder.newColumn('date').withTitle('Date'),
          this.DTColumnBuilder.newColumn('time').withTitle('Time'),
          this.DTColumnBuilder.newColumn('description').withTitle('Description').withOption('width', '40%'),
          this.DTColumnBuilder.newColumn('amount').withTitle('Amount ($)'),
          this.DTColumnBuilder.newColumn('comment').withTitle('Comment').withOption('width', '10%'),
          this.DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
        ]

        this.displayTable = true
      })

    let createdRow = (row) => {
      this.$compile(angular.element(row).contents())(this.$scope)
    }

    let actionsHtml = (data) => {
      return `
                <a class="btn btn-xs btn-warning" ui-sref="app.recordedit({recordId: ${data.id}})">
                    <i class="fa fa-edit"></i>
                </a>
                &nbsp
                <button class="btn btn-xs btn-danger" ng-click="vm.delete(${data.id})">
                    <i class="fa fa-trash-o"></i>
                </button>`
    }
  }

  delete (recordId) {
    let API = this.API
    let $state = this.$state

    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, delete it!',
      closeOnConfirm: false,
      showLoaderOnConfirm: true,
      html: false
    }, function () {
      API.one('records', recordId).remove()
        .then(() => {
          swal({
            title: 'Deleted!',
            text: 'Expense record has been deleted.',
            type: 'success',
            confirmButtonText: 'OK',
            closeOnConfirm: true
          }, function () {
            $state.reload()
          })
        })
    })
  }

  $onInit () {}
}

export const RecordListsComponent = {
  templateUrl: './views/app/components/record-lists/record-lists.component.html',
  controller: RecordListsController,
  controllerAs: 'vm',
  bindings: {}
}
