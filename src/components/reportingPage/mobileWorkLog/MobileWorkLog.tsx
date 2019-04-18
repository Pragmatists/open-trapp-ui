import React, { Component } from 'react';
import { ReportingWorkLogDTO } from '../../../api/dtos';
import { Card } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import './MobileWorkLog.scss'
import { formatWorkload } from '../../../utils/workLogUtils';

interface MobileWorkLogProps {
  workLog: ReportingWorkLogDTO;
}

export class MobileWorkLog extends Component<MobileWorkLogProps, {}> {
  render() {
    return (
        <Card className='mobile-work-log'>
          <CardContent>
            <Day day={this.props.workLog.day}/>
            <Workload workload={this.props.workLog.workload}/>
            <ProjectNames projectNames={this.props.workLog.projectNames}/>
          </CardContent>
        </Card>
    );
  }
}

const Day = ({day}: { day: string }) => (
    <div data-work-log-day>{day}</div>
);

const Workload = ({workload}: { workload: number }) => (
    <div data-work-log-workload>{formatWorkload(workload)}</div>
);

const ProjectNames = ({projectNames}: { projectNames: string[] }) => (
    <div data-work-log-project-names>{projectNames.join(", ")}</div>
);
