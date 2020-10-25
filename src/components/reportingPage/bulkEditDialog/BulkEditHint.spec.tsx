import React from 'react';
import { render } from '@testing-library/react';
import { BulkEditHint } from './BulkEditHint';
import { ignoreHtmlTags } from '../../../utils/testUtils';

describe('Bulk edit hint', () => {
  it('displays info when validation in progress', () => {
    const {getByText} = render(
        <BulkEditHint entriesAffected={undefined}/>
    );

    expect(getByText('Query is being validated...')).toBeInTheDocument();
  });

  it('displays hint when no entries affected', () => {
    const {getByText} = render(
        <BulkEditHint entriesAffected={0}/>
    );

    expect(getByText(ignoreHtmlTags('Hint: No worklog entries will be affected by this operation.'))).toBeInTheDocument();
  });

  it('displays hint when 1 entry affected', () => {
    const {getByText} = render(
        <BulkEditHint entriesAffected={1}/>
    );

    expect(getByText(ignoreHtmlTags('Hint: 1 worklog entry will be affected by this operation.'))).toBeInTheDocument();
  });

  it('displays hint when multiple entries affected', () => {
    const {getByText} = render(
        <BulkEditHint entriesAffected={5}/>
    );

    expect(getByText(ignoreHtmlTags('Hint: 5 worklog entries will be affected by this operation.'))).toBeInTheDocument();
  });
});
