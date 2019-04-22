import React from 'react';
import { shallow } from 'enzyme';
import { BulkEditHint } from './BulkEditHint';

describe('Bulk edit hint', () => {
  it('displays info when validation in progress', () => {
    const wrapper = shallow(
        <BulkEditHint entriesAffected={undefined} />
    );

    expect(wrapper.find('[data-hint-text]').text()).toEqual('Query is being validated...');
  });

  it('displays hint when no entries affected', () => {
    const wrapper = shallow(
        <BulkEditHint entriesAffected={0} />
    );

    expect(wrapper.find('[data-hint-text]').text()).toEqual('Hint: No worklog entries will be affected by this operation.');
  });

  it('displays hint when 1 entry affected', () => {
    const wrapper = shallow(
        <BulkEditHint entriesAffected={1} />
    );

    expect(wrapper.find('[data-hint-text]').text()).toEqual('Hint: 1 worklog entry will be affected by this operation.');
  });

  it('displays hint when multiple entries affected', () => {
    const wrapper = shallow(
        <BulkEditHint entriesAffected={5} />
    );

    expect(wrapper.find('[data-hint-text]').text()).toEqual('Hint: 5 worklog entries will be affected by this operation.');
  });
});
