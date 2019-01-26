import * as React from 'react';
import {HeaderUserContext} from "./HeaderUserContext";
import { shallow as enzymeShallow } from 'enzyme';
import createShallow from "@material-ui/core/test-utils/createShallow";

describe('HeaderUserContext', () => {
    let shallow: typeof enzymeShallow;

    beforeAll(() => {
        shallow = createShallow();
    });

    it('should render LOGIN button when unauthorized', () => {
        const component = shallow(<HeaderUserContext/>);

        expect(component.find('[data-login-button]').childAt(0).text()).toEqual('Login');
    });

    it('should render user icon when logged in', () => {
        const component = shallow(<HeaderUserContext/>);

        expect(component.find('[data-user-icon]')).toBeDefined();
    });
});

