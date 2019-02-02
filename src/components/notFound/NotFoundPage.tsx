import React from 'react';
import { Grid } from '@material-ui/core';
import './NotFoundPage.css'

export const NotFoundPage = () => (
  <div>
    <Grid container justify='center' xs={12} spacing={24}>
      <Grid item container xs={9}>
        <Grid item xs={12}>
          <div className='not-found__code'>404</div>
        </Grid>
        <Grid item xs={12}>
          <div className='not-found__text'>Page not found</div>
        </Grid>
      </Grid>
    </Grid>
  </div>
);