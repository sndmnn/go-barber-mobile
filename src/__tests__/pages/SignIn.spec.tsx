import React from 'react';
import { render } from 'react-native-testing-library';

import SignIn from '../../pages/SignIn';

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: jest.fn(),
  };
});

describe('SignIn Page', () => {
  it('should be able to render sign in page', () => {
    const { getByPlaceholder } = render(<SignIn />);

    expect(getByPlaceholder('E-mail')).toBeTruthy();
  });
});
