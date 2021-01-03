import { fireEvent, render, RenderResult, waitFor } from '@testing-library/react';
import * as React from 'react';
import { BulkEditDialog } from './BulkEditDialog';
import MockAdapter from 'axios-mock-adapter';
import { ignoreHtmlTags } from '../../../utils/testUtils';
import { OpenTrappRestAPI } from '../../../api/OpenTrappAPI';

describe('Bulk edit dialog', () => {
  let httpMock: MockAdapter;

  const selection = () => ({
    tags: ['projects', 'nvm', 'jld'],
    employees: ['john.doe', 'tom.hanks'],
    month: {
      year: 2019,
      month: 3
    }
  });

  beforeEach(() => {
    httpMock = new MockAdapter(OpenTrappRestAPI.axios);
    httpMock
        .onGet(/\/work-log\/bulk-update\/.*$/)
        .reply(200, {entriesAffected: 1})
  });

  it('by default displays and validates query for selected tags and users', async () => {
    const {getByText, getByDisplayValue} = render(
          <BulkEditDialog userTags={['projects', 'nvm']} selection={selection()} onEdit={() => {}} username='tom'/>
    );
    fireEvent.click(getByText('Bulk edit'));
    await waitFor(() => {});

    expect(getByDisplayValue('@2019/03 #projects #nvm #jld *john.doe *tom.hanks')).toBeInTheDocument();
    expect(getByText(ignoreHtmlTags('Hint: 1 worklog entry will be affected by this operation.'))).toBeInTheDocument();
  });

  it('validates query on change', async () => {
    const container = render(
          <BulkEditDialog userTags={['projects', 'nvm']} selection={selection()} onEdit={() => {}} username='tom'/>
    );
    fireEvent.click(container.getByText('Bulk edit'));

    typeQuery(container, '@2019/03 #projects #nvm *john.doe');
    await waitFor(() => expect(httpMock.history.get.length).toEqual(2));
    expect(httpMock.history.get[1].url)
        .toEqual('/work-log/bulk-update/!date=2019:03+!project=projects+!project=nvm+!employee=john.doe');
  });

  it('updates entries on UPDATE button click', async () => {
    const onEdit = jest.fn();
    const container = render(
          <BulkEditDialog userTags={['projects', 'nvm']} selection={selection()} onEdit={onEdit} username='tom'/>
    );
    fireEvent.click(container.getByText('Bulk edit'));

    typeQuery(container, '@2019/03 #projects #nvm *john.doe');
    typeExpression(container, '-#nvm +#jld');
    fireEvent.click(container.getByText('Update'));
    await waitFor(() => {});

    expect(onEdit).toHaveBeenCalledWith({
      query: '@2019/03 #projects #nvm *john.doe',
      expression: '-#nvm +#jld'
    });
  });

  function typeQuery(container: RenderResult, query: string) {
    const queryInput = container.getByTestId('bulk-edit-query').lastChild.firstChild;
    fireEvent.change(queryInput, {target: {value: query}});
  }

  function typeExpression(container: RenderResult, expression: string) {
    const expressionInput = container.getByTestId('bulk-edit-expression').lastChild.firstChild;
    fireEvent.change(expressionInput, {target: {value: expression}});
  }
});
