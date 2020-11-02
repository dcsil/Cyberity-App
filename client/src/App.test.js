import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
    const { getByTestId } = render(<App />);
    const linkElement = getByTestId('test-logo');
    expect(linkElement).toBeInTheDocument();
});
