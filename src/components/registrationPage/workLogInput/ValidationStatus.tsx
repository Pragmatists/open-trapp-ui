import React from 'react';
import { isEmpty } from 'lodash';
import ErrorIcon from '@material-ui/icons/Error';
import OkIcon from '@material-ui/icons/CheckCircle';
import { ParsedWorkLog } from '../../../workLogExpressionParser/ParsedWorkLog';

interface ValidationStatusProps {
    workLog: ParsedWorkLog;
}

export const ValidationStatus = ({workLog}: ValidationStatusProps) => {
    if (workLog.valid) {
        return (
            <OkIcon nativeColor='#5BC440' data-ok-indicator />
        )
    } else if (!isEmpty(workLog.expression)) {
        return (
            <ErrorIcon color='error' data-error-indicator />
        )
    }
    return null;
};