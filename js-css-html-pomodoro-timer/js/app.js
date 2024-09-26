const taskContainer = document.querySelector('.task-container')
const submitButton = document.querySelector('.submit-button')
const timeLeftDisplay = document.querySelector('#time-left')
const sliderFill = document.querySelector('.fill')

const startCount = 25 * 60
let timeLeft = startCount
let timerId

let tasks = [
  {
    name: 'Practise CSS Animations',
    priority: 0,
  },
  {
    name: 'Dev Community Work',
    priority: 2,
  },
  {
    name: 'Algoritm Studies',
    priority: 1,
  },
]

// sort by priority
const descendingTasks = tasks.sort(
  (taskA, taskB) => taskA.priority - taskB.priority
)

// convert seconds to minute format for display
function convertToMin(secondsLeft) {
  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft - minutes * 60
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}

// handle the start/pause functionality
function handleClick(button) {
  switch (button.textContent) {
    case 'ACTIVE':
      button.textContent = 'PAUSED'
      clearInterval(timerId)
      break
    case 'PAUSED':
      button.textContent = 'ACTIVE'
      countDown(button)
      break
    default:
      const allButtons = document.querySelectorAll('.controller-button')
      allButtons.forEach((button) => {
        button.textContent = 'START'
        button.classList.remove('active-button')
        clearInterval(timerId)
        timeLeft = startCount
        timeLeftDisplay.textContent = convertToMin(timeLeft)
      })

      button.textContent = 'ACTIVE'
      button.classList.add('active-button')
      countDown(button)
      break
  }
}

// countdown timer
function countDown(button) {
  timerId = setInterval(() => {
    timeLeft--
    timeLeftDisplay.textContent = convertToMin(timeLeft)
    sliderFill.style.width = (timeLeft / startCount) * 100 + '%'
    if (timeLeft <= 0) {
      clearInterval(timerId)
      delete descendingTasks[button.id]
      button.parentNode.remove()
      timeLeft = startCount
      timeLeftDisplay.textContent = convertToMin(timeLeft)
    }
  }, 1000)
}

// create tasks in the array
function render() {
  descendingTasks.forEach((task, index) => {
    const taskBlock = document.createElement('div')
    const deleteElement = document.createElement('p')
    const title = document.createElement('p')
    const controller = document.createElement('button')

    taskBlock.classList.add('task-block')
    deleteElement.classList.add('delete-icon')
    controller.classList.add('controller-button')

    deleteElement.textContent = '☒'
    title.textContent = task.name
    controller.textContent = 'START'

    controller.id = index

    deleteElement.addEventListener('click', deleteTask)
    controller.addEventListener('click', () => handleClick(controller))

    taskBlock.append(deleteElement, title, controller)
    taskContainer.append(taskBlock)
  })
}
render()

// delete a task
function deleteTask(e) {
  e.target.parentNode.remove()
  delete descendingTasks[e.target.parentNode.lastChild.id]
}

// add a task
function addTask() {
  const inputElement = document.querySelector('input')
  const value = inputElement.value
  if (value) {
    taskContainer.innerHTML = ''
    inputElement.value = ''
    tasks.push({
      name: value,
      priority: tasks.length,
    })
    render()
  }
}
submitButton.addEventListener('click', addTask)
