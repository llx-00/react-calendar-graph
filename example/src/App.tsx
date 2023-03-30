import CalendarGraph from '@lib/core'

import './App.css'


function App() {
  const thisYear = new Date().getFullYear()


  return (
    <div>
      <CalendarGraph year={thisYear} />
    </div>
  )
}

export default App
