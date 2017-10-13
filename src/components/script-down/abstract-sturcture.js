let HEADER = {
  $type: 'header',
  title: '',
  level: 0,
  options: {}
}

let COMMAND = {
  $type: 'command',
  name: '',
  argus: [],
  options?: {}
}

let ACTION = {
  $type: 'action',
  argus: [],
  name: '',
  options?: {}
}

let ACT = {
  $type: 'act',
  message: '',
  subjectMovementList: {
    $array: [
      {
        $type: 'subjectMovement',
        movement: [
          {
            $type: 'movement',
            methods: [COMMAND, ACTION],
            options: {}
          }
        ],
        subject: {
          $type: 'subject',
          name: '',
          variety: ''
        }
      }
    ]
  }
}