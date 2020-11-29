import React, {ReactElement} from 'react';
import { ReportWorkloadCell } from './ReportCell';
import { render } from '@testing-library/react';
import moment from 'moment';

describe('Report Cells', () => {
  describe('ReportWorkloadCell', () => {
    it('displays workload if defined', () => {
      const day = {
        id: '2012/12/01',
        weekend: false,
        holiday: false
      }
      const {getByText} = renderInTableRow(
          <ReportWorkloadCell workload={100} day={day} onClick={() => {}}/>
      );

      expect(getByText('1.67')).toBeInTheDocument();
    });

    it('displays empty cell if no workload and current month', () => {
      const day = {
        id: moment().format('YYYY/MM/DD'),
        weekend: false,
        holiday: false
      }
      const {queryByTestId} = renderInTableRow(
          <ReportWorkloadCell workload={undefined} day={day} onClick={() => {}}/>
      );

      expect(queryByTestId('missing-workload-icon')).not.toBeInTheDocument();
    });

    it('displays icon if no workload and previous month', () => {
      const day = {
        id: moment().subtract(1, 'month').format('YYYY/MM/DD'),
        weekend: false,
        holiday: false
      }
      const {getByTestId} = renderInTableRow(
          <ReportWorkloadCell workload={undefined} day={day} onClick={() => {}}/>
      );

      expect(getByTestId('missing-workload-icon')).toBeInTheDocument();
    });
  });

  function renderInTableRow(cell: ReactElement) {
    return render(
        <table>
          <tbody>
            <tr>
              {cell}
            </tr>
          </tbody>
        </table>
    )
  }
});
