import React, { useState } from 'react';
import { isEmpty } from 'lodash';
import ErrorIcon from '@material-ui/icons/Error';
import './ValidationStatus.scss'
import OkIcon from '@material-ui/icons/CheckCircle';
import { ParsedWorkLog } from '../../../workLogExpressionParser/ParsedWorkLog';
import { Popover, Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";

interface ValidationStatusProps {
  workLog: ParsedWorkLog;
}

export const ValidationStatus = ({workLog}: ValidationStatusProps) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = event => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const validationResult = workLog.validate();
  if (validationResult.valid) {
    return (
        <OkIcon htmlColor='#5BC440' data-testid='ok-indicator'/>
    )
  } else if (!isEmpty(workLog.expression)) {
    return (
        <React.Fragment>
          <IconButton aria-label='Help' onClick={handleClick} data-testid='error-indicator'>
            <ErrorIcon color='error'/>
          </IconButton>
          <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
              transformOrigin={{vertical: 'top', horizontal: 'center'}}>
            {
              validationResult.errors.map(error =>
                  <Typography className='validation-error' key={error}>{error}</Typography>
              )
            }
          </Popover>
        </React.Fragment>
    )
  }
  return null;
};
