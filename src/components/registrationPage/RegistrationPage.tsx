import React from 'react';
import {withWidth} from "@material-ui/core";
import {isWidthUp} from "@material-ui/core/withWidth";
import {RegistrationPageDesktop} from "./RegistrationPage.desktop";
import {RegistrationPageMobile} from "./RegistrationPage.mobile";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";

interface RegistrationPageLayoutProps {
    width: Breakpoint;
}

const  RegistrationPageLayout = ({width}: RegistrationPageLayoutProps) =>
    isWidthUp('md', width) ? <RegistrationPageDesktop/> : <RegistrationPageMobile/>;

export const RegistrationPage = withWidth()(RegistrationPageLayout);
