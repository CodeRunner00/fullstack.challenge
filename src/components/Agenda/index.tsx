import React, { ReactElement, useContext, useMemo, useState } from 'react'
import { DateTime } from 'luxon'
import Select from 'react-select'

import greeting from 'lib/greeting'

import Calendar from 'src/models/Calendar'
import Event from 'src/models/Event'
import AccountContext from 'src/context/accountContext'

import List from './List'
import EventCell from './EventCell'

import style from './style.scss'

type AgendaItem = {
  calendar: Calendar
  event: Event
}

const compareByDateTime = (a: AgendaItem, b: AgendaItem) =>
  a.event.date.diff(b.event.date).valueOf()

/**
 * Agenda component
 * Displays greeting (depending on time of day)
 * and list of calendar events
 */

const Agenda = (): ReactElement => {
  const account = useContext(AccountContext)
  const events: AgendaItem[] = useMemo(
    () =>
      account.calendars
        .flatMap((calendar) =>
          calendar.events.map((event) => ({ calendar, event })),
        )
        .sort(compareByDateTime),
    [account],
  )

  // const [selectOption, setSelectOption] = useState<string>('all')
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>(events)

  console.log(DateTime.local().zoneName)
  const currentHour = DateTime.local().setZone('America/New_York').hour
  const title = useMemo(() => greeting(currentHour), [currentHour])
  let options = account.calendars.map((cal, idx) => {
    return { label: `Calendar #${idx + 1}`, value: cal.id }
  })
  options = [...options, { label: 'All Calendars', value: 'all' }]

  const handleCalendarSelection = (selection: any) => {
    console.log('handleCalendar selction ', selection)
    if (selection.value === 'all') {
      setAgendaItems(events)
    } else {
      const newEvents = events.filter((agenda) => {
        return agenda.calendar.id === selection.value
      })
      console.log('New events ', newEvents)
      setAgendaItems(newEvents)
    }
  }

  const getColor = (id: string) => {
    if (id === 'all') return 'grey'
    const item = account.calendars.find((cal) => cal.id === id)
    return item.color
  }

  const customStyles = {
    option: (provided: any, state: any) => {
      console.log('state is ', state)
      return {
        ...provided,
        zIndex: '10',
        backgroundColor: getColor(state.data.value),
        opacity: 0.8,
        borderBottom: '1px dotted pink',
        color: 'black',
        padding: 20,
        borderRadius: '5px',
      }
    },
    menu: (base: any) => ({
      ...base,
      zIndex: 100,
      borderRadius: '5px',
    }),
    control: (styles: any) => ({ ...styles, backgroundColor: 'white' }),
    singleValue: (provided: any, state: { isDisabled: boolean }) => {
      const opacity = state.isDisabled ? 0.5 : 1
      return { ...provided, opacity }
    },
  }

  return (
    <div className={style.outer}>
      <div className={style.container}>
        <div className={style.header}>
          <span className={style.title}>{title}</span>
          <Select
            defaultValue={options[3]}
            options={options}
            onChange={handleCalendarSelection}
            styles={customStyles}
          />
        </div>

        <List>
          {agendaItems.map(({ calendar, event }) => (
            <EventCell key={event.id} calendar={calendar} event={event} />
          ))}
        </List>
      </div>
    </div>
  )
}

export default Agenda
