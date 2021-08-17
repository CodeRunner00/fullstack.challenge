import React, { ReactElement } from 'react'
import Event from 'src/models/Event'
import Calendar from 'src/models/Calendar'
import SectionHeader from '../SectionHeader'
import List from '../List'
import EventCell from '../EventCell'

/**
 * Agenda section header component
 */

interface Props {
  events: AgendaItem[]
}

interface AgendaItem {
  calendar: Calendar
  event: Event
}

interface Departments {
  [key: string]: Array<AgendaItem>
}

const DepartmentView = ({ events }: Props): ReactElement => {
  const departmentsMap: Departments = {}
  events.forEach((agendaItem: AgendaItem) => {
    const {
      event: { department },
    } = agendaItem
    if (!department) {
      if (departmentsMap['Other']) {
        departmentsMap['Other'].push(agendaItem)
      } else {
        departmentsMap['Other'] = []
        departmentsMap['Other'].push(agendaItem)
      }
    } else {
      if (departmentsMap[department]) {
        departmentsMap[department].push(agendaItem)
      } else {
        departmentsMap[department] = []
        departmentsMap[department].push(agendaItem)
      }
    }
  })
  return (
    <>
      {Object.keys(departmentsMap).map((department) => {
        return (
          <div key={department}>
            <SectionHeader label={department} />
            <List>
              {departmentsMap[department].map(({ calendar, event }) => (
                <EventCell key={event.id} calendar={calendar} event={event} />
              ))}
            </List>
          </div>
        )
      })}
    </>
  )
}

export default DepartmentView
