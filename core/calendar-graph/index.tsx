import dayjs from 'dayjs'
import React, { useEffect, useMemo, useState } from 'react'

import { getDateByDays, dF, getMouthFirstDay, getMouthColspan, showWeek } from '../utils/day'
import { classNames } from '../utils/tools'

import defalutValue from './default.json'
import './index.scss'


type TypeColorKey = 0 | 1 | 2 | 3 | 4
type TypeLevels   = 1 | 2 | 3 | 4

type TypeRecord = {
  /** The nth day of the year */
  days : number
  /** Count of the day */
  count: number
}
type TypeProps = {
  year   : number
  isDark?: boolean
  colors?: { [key in TypeColorKey]: string }
  levels?: { [key in TypeLevels]: number }

  /** Sort by days, need consecutive */
  records?: number[]

  /** The function runs when you click the `<rd/>` element */
  recordHandle?: (record: TypeRecord) => (any)

  /** When you hove `<rd/>` element, the result of running the function is displayed */
  renderTootip?: (record: TypeRecord) => string
}


export default (props: TypeProps) => {

  function getLevel(count: number) {
    const levels = props.levels || defalutValue.levels
    if (count > levels[4]) return 4
    if (count > levels[3]) return 3
    if (count > levels[2]) return 2
    if (count > levels[1]) return 1
    return 0
  }
  function getFillColor(count: number) {
    return props.colors
      ? (props.colors[getLevel(count)])
      : defalutValue.colors[getLevel(count)][props.isDark ? 'dark' : 'light']
  }
  function getPaletteColors() {
    const keys: TypeColorKey[] = [0, 1, 2, 3, 4]
    return props.colors
      ? keys.map(key => props.colors![key])
      : keys.map(key => defalutValue.colors[key][props.isDark ? 'dark' : 'light'])
  }

  function getMap(year: number) {
    const map = [] as TypeRecord[]
    const day = getMouthFirstDay(year, 0)

    map.push(...new Array(day).fill(null).map(
      (_, idx) => ({ count: 0, days: idx-day })
    ))

    const days = dayjs().year(year).endOf('y').dayOfYear()
    for (let i = 0; i < days; i++) map.push({
      days : i + 1,
      count: props.records?.[i] || 0
    })
    return map
  }

  function getTootipText(record: TypeRecord) {
    return props.renderTootip
      ? props.renderTootip(record)
      : (
        (record.count || 'No')
        + ' contributions on '
        + dF(getDateByDays(props.year, record.days))
      )
  }

  const [dataMap, setDataMap] = useState<{
    year: number
    map : TypeRecord[]
  }>({
    year: props.year,
    map : getMap(props.year)
  })
  useEffect(() => {
    if (props.year !== dataMap.year) {
      setDataMap({
        year: props.year,
        map: getMap(props.year)
      })
    }
  }, [props])

  const sortByWeek = useMemo(() => {
    const data = new Array(7).fill(null).map(_ => ([] as TypeRecord[]))
    dataMap.map.forEach((i, idx) => { data[idx % 7].push(i) })
    return data
  }, [dataMap.map])

  return (
    <div
      className={classNames([
        'calendar-graph-container',
        props.isDark ? 'dark' : null,
      ])}
    >
      <table>
        <thead>
          <tr className="months">
            <td></td>
            {
              (new Array(12).fill(null)).map((_, idx) => (
                <td
                  key={idx}
                  colSpan={getMouthColspan(props.year, idx)}
                >
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
                            if (props.recordHandle) {
                              props.recordHandle(record)
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
