import * as React from 'react'
import { observer } from 'mobx-react'
import { scheduleStore } from '../ScheduleStore'
import { uiStore } from '../UIStore'
import Spinner from './Spinner'
import difference from 'lodash-es/difference'
import Icon from 'material-ui/Icon'
import '../styles/Validators.css'
import { loginStore } from '../LoginStore'

@observer
export default class Validators extends React.Component {
  counter = 0

  componentDidMount() {
    // force the browser to download error.svg
    // since this icon is displayed when there's a network error, you can't lazy load it
    const dummyImg = document.createElement('img')
    dummyImg.src = 'error.svg'
    dummyImg.style.display = 'none'
    document.body.appendChild(dummyImg)
    dummyImg.remove()
  }

  render() {
    const genedStyle = {
      width: Math.min(Math.floor(scheduleStore.genedsFulfilled.length / scheduleStore.GENEDS_NEEDED.length * 100), 100) + "%"
    }
    const majorCoursesStyle = {
      width: Math.min(Math.floor(scheduleStore.majorCoursesFulfilled.length / scheduleStore.majorCoursesNeeded.length * 100), 100) + "%"
    }
    const creditsStyle = {
      width: Math.min(Math.floor(scheduleStore.creditsFulfilled / scheduleStore.CREDITS_NEEDED * 100), 100) + "%"
    }
    let loadingStatusIcon, saveStatusText
    if (scheduleStore.saveStatus === 'saving') {
      loadingStatusIcon = (<Spinner radius={10} />)
      saveStatusText = 'saving schedule'
    } else if (scheduleStore.saveStatus === 'waiting') {
      loadingStatusIcon = (<img alt="error" src="error.svg" />)
      saveStatusText = 'not saved: no connection'
    } else {
      loadingStatusIcon = (<img alt="done" src="done.svg" />)
      saveStatusText = 'schedule saved'
    }

    const savingContainerClickFn = scheduleStore.saveStatus === 'waiting' ? () => scheduleStore.saveSchedule() : null
    const savingContainerStyle = scheduleStore.saveStatus === 'waiting' ? { cursor: 'pointer' } : null
    return (
      <div className="Validators">
        {loginStore.isLoggedIn &&
          <div className="saving-schedule-container" onClick={savingContainerClickFn} style={savingContainerStyle}>
            <span>{saveStatusText}</span>
            <div className="loader-container">{loadingStatusIcon}</div>
          </div>
        }
        <div className="progress-group geneds">
          <label>Gen&nbsp;Eds</label>
          <div className="progress-bar"><div className="progress-completed" style={genedStyle}></div></div>
          {scheduleStore.genedsFulfilled.length}&nbsp;out&nbsp;of&nbsp;{scheduleStore.GENEDS_NEEDED.length}
          <div className="progress-popup">
            <span>Fulfilled:</span>
            <div>{scheduleStore.genedsFulfilled.map(ge => <span className="gened-block" key={`ge-${this.counter++}`}>{ge}</span>)}</div>
            <span>Remaining:</span>
            <div>{scheduleStore.genedsRemaining.map(ge => <span className="gened-block" key={`ge-${this.counter++}`}>{ge}</span>)}</div>
          </div>
        </div>
        <div className="progress-group credits">
          <label>Credits</label>
          <div className="progress-bar"><div className="progress-completed" style={creditsStyle}></div></div>
          {scheduleStore.creditsFulfilled}&nbsp;out&nbsp;of&nbsp;{scheduleStore.CREDITS_NEEDED} 
        </div>
      </div>
    )
  }
}