import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'

import { getDateByDays, dF, getMonthDays, getMouthFirstDay } from '../utils/day'
import { classNames } from '../utils/tools'

import defalutValue from './default.json'
import './index.scss'


type TypeColorKey = 0 | 1 | 2 | 3 | 4
type TypeLevels   = 1 | 2 | 3 | 4

type TypeRecord = {
  days : number
  count: number
}
type TypePorps = {
  year   : number
  isDark?: boolean
  colors?: { [key in TypeColorKey]: string }
  levels?: { [key in TypeLevels]: number }

  /** Sort by days, need consecutive */
  records?: number[]

  recordHandle?: (record: TypeRecord) => (any)
  renderTootip?: (record: TypeRecord) => string
}

function showWeek(week: string) {
  return ['Mon', 'Wed', 'Fri'].includes(week) ? week : null
}

function getMouthColspan(year: number, month: number) {
  const days = getMonthDays(year, month)
  const firstDay = getMouthFirstDay(year, month)
  return (
    Math.ceil((days - 7 + firstDay) / 7)
    + (month === 0 ? 1 : 0)
    + (firstDay === 0 && month !== 0 ? 1 : 0)
  )
}


export default (porps: TypePorps) => {

  function getLevel(count: number) {
    const levels = porps.levels || defalutValue.levels
    if (count > levels[4]) return 4
    if (count > levels[3]) return 3
    if (count > levels[2]) return 2
    if (count > levels[1]) return 1
    return 0
  }
  function getFillColor(count: number) {
    return porps.colors
      ? (porps.colors[getLevel(count)])
      : defalutValue.colors[getLevel(count)][porps.isDark ? 'dark' : 'light']
  }
  function getPaletteColors() {
    const keys: TypeColorKey[] = [0, 1, 2, 3, 4]
    return porps.colors
      ? keys.map(key => porps.colors![key])
      : keys.map(key => defalutValue.colors[key][porps.isDark ? 'dark' : 'light'])
  }

  function getMap(year: number) {
    const map = [] as TypeRecord[]
    const monthFirstDay = getMouthFirstDay(year, 0)
    map.push(...new Array(monthFirstDay).fill(null).map(
      (_, idx) => ({ count: 0, days: idx - monthFirstDay })
    ))
    const days = dayjs().year(year).endOf('y').dayOfYear()
    for (let i = 0; i < days; i++) map.push({
      days : i + 1,
      count: porps.records?.[i] || 0
    })
    return map
  }

  function getTootipText(record: TypeRecord) {
    return (
      porps.renderTootip
        ? porps.renderTootip(record)
        : `${record.count || 'No'} contributions on ${dF(getDateByDays(porps.year, record.days))}`
    )
  }

  const [dataMap, setDataMap] = useState<{
    year: number
    map : TypeRecord[]
  }>({
    year: porps.year,
    map : getMap(porps.year)
  })
  useEffect(() => {
    if (porps.year !== dataMap.year) {
      setDataMap({
        year: porps.year,
        map: getMap(porps.year)
      })
    }
  }, [porps])

  const sortByWeek = useMemo(() => {
    const data = new Array(7).fill(null).map(_ => ([] as TypeRecord[]))
    dataMap.map.forEach((i, idx) => { data[idx % 7].push(i) })
    return data
  }, [dataMap.map])

  return (
    <div
      className={classNames([
        'calendar-graph-container',
        porps.isDark ? 'dark' : null,
      ])}
    >
      <table>
        <thead>
          <tr className="months">
            <td></td>
            {
              (new Array(12).fill(null)).map((_, idx) => (
                <td key={idx} colSpan={getMouthColspan(porps.year, idx)}>
                  {dayjs().month(idx).format("MMM")}
                </td>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {
            (new Array(7).fill(null).map((_, week) => (
              <tr key={week}>
                <td>{showWeek(dayjs().day(week).format('ddd'))}</td>
                {
                  sortByWeek[week].map((record, idx) => (
                    record.days > 0
                      ? (
                        <td
                          key={idx}
                          className="record"
                          title={getTootipText(record)}
                          style={{ backgroundColor: getFillColor(record.count) }}
                          onClick={() => {
                            if (porps.recordHandle) {
                              porps.recordHandle(record)
                            }
                          }}
                        />
                      )
                      : <td key={idx} className="last-year" />
                  ))
                }
              </tr>
            )))
          }
        </tbody>
      </table>
      <div className="footer">
        <div className="palette">
          <span>Less</span>
          <div className="svgs">
            {
              getPaletteColors().map(color => (
                <svg width={10} height={10} key={color}>
                  <rect width={10} height={10} fill={color} />
                </svg>
              ))
            }
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  )
}
