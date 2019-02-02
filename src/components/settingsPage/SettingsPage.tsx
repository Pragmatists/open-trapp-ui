import React from 'react';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { isWidthUp } from '@material-ui/core/withWidth';
import { withWidth } from '@material-ui/core';
import { SettingsPageDesktop } from './SettingsPage.desktop';
import { SettingsPageMobile } from './SettingsPage.mobile';

interface SettingsPageLayoutProps {
  width: Breakpoint;
}

const  SettingsPageLayout = ({width}: SettingsPageLayoutProps) =>
  isWidthUp('md', width) ? <SettingsPageDesktop/> : <SettingsPageMobile/>;

export const SettingsPage = withWidth()(SettingsPageLayout);