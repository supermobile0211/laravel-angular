class UserReportsController {
  constructor ($scope, $state, $compile, DTOptionsBuilder, DTColumnBuilder, API, AclService) {
    'ngInject'
    this.API = API
    this.$state = $state
    this.$scope = $scope
    this.$compile = $compile
    this.DTOptionsBuilder = DTOptionsBuilder
    this.DTColumnBuilder = DTColumnBuilder

    this.hasRole = AclService.hasRole

    this.dateFrom = ''
    this.dateTo = ''

    this.showRecords()
  }

  showRecords() {
    this.displayTable = false

    let Records = this.API.service('records', this.API.one('users'))
    let params = {
      'from': this.dateFrom,
      'to': this.dateTo
    }

    Records.getList({query: params})
      .then((response) => {
        let dataSet = response.plain()

        this.total = dataSet.reduce((value, current) => {return value + current.amount}, 0);
        this.avg = (this.total/dataSet.length).toFixed(2)
        this.total = this.total.toFixed(2)

        this.dtOptions = this.DTOptionsBuilder.newOptions()
          .withOption('data', dataSet)
          .withOption('createdRow', createdRow)
          .withOption('responsive', true)
          .withBootstrap()

        this.dtColumns = [
          this.DTColumnBuilder.newColumn('id').withTitle('ID'),
          this.DTColumnBuilder.newColumn('date').withTitle('Date'),
          this.DTColumnBuilder.newColumn('time').withTitle('Time'),
          this.DTColumnBuilder.newColumn('description').withTitle('Description').withOption('width', '50%'),
          this.DTColumnBuilder.newColumn('amount').withTitle('Amount ($)'),
          this.DTColumnBuilder.newColumn('comment').withTitle('Comment').withOption('width', '20%')
        ]

        this.displayTable = true
      })

    let createdRow = (row) => {
      this.$compile(angular.element(row).contents())(this.$scope)
    }
  }

  print() {
    print()
    // let content = $('section.content').html()
    // var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    // WinPrint.document.write(content);
    // WinPrint.document.close();
    // WinPrint.focus();
    // WinPrint.print();
    // WinPrint.close();
  }

  $onInit () {}
}

export const UserReportsComponent = {
  templateUrl: './views/app/components/user-reports/user-reports.component.html',
  controller: UserReportsController,
  controllerAs: 'vm',
  bindings: {}
}
