import React from 'react';
import { isNil } from 'lodash';
import './BulkEditHint.scss';

interface BulkEditHintProps {
  className?: string;
  entriesAffected?: number;
}

export const BulkEditHint = ({entriesAffected, className}: BulkEditHintProps) => {
  const affectedText = (numberOfEntries: number) => {
    if (numberOfEntries === 0) {
      return (
          <div>Hint: <span className='number-of-entries'>No </span>worklog entries will be affected by this operation.</div>
      );
    } else if (numberOfEntries === 1) {
      return (
          <div>Hint: <span className='number-of-entries'>1 </span>worklog entry will be affected by this operation.</div>
      );
    }
    return (
        <div>Hint: <span className='number-of-entries'>{numberOfEntries} </span>worklog entries will be affected by this operation.</div>
    )
  };

  return (
      <div className={className ? ` ${className} bulk-edit-hint` : 'bulk-edit-hint'} data-hint-text>
        {
          isNil(entriesAffected) ? 'Query is being validated...' : affectedText(entriesAffected)
        }
      </div>
  );
};