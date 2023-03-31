import dayjs from 'dayjs'
import { useState } from 'react'

import CalendarGraph from '@lib/core'
import { dF, getDateByDays } from '@lib/core/utils/day'

import './App.css'


function getRandomRecords(year: number) {
  const days = dayjs().year(year).endOf('y').dayOfYear()
  function getRandom() {
    return Math.max(0, Math.random()*20 - Math.random()*5 >> 0)
  }
  return (new Array(days).fill(null).map(_ => getRandom()))
}


export default () => {
  const thisYear = new Date().getFullYear()

  const [year, setYear] = useState(thisYear)
  const FirstDay        = getDateByDays(year, 1)
  const EndDay          = getDateByDays(year, getDateByDays(year))

  return (
    <div>
      <h2>{dF(FirstDay)} - {dF(EndDay)}</h2>
      <div>
      {/* <select v-model="year">
        <option v-for="_y in 4" :value="(thisYear-_y+1)">
          {{ thisYear-_y+1 }}
        </option>
      </select> */}
      <select defaultValue={thisYear}
        onChange={e => {
          setYear(+e.target.value)
        }}
      >
        {
          new Array(4).fill(null).map((_, idx) => (
            <option key={idx} value={(thisYear-idx)}>
              {thisYear-idx}
            </option>
          ))
        }
      </select>
      </div>
      <CalendarGraph
        year={year}
        records={getRandomRecords(year)}
      />
      <CalendarGraph
        isDark
        year={year}
        records={getRandomRecords(year)}
      />
    </div>
  )
}

