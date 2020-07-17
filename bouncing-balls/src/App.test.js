/**
 * Modifies the simple default test to check that the App is rendered as expected.
 */
import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders title', () => {
  const { getByText } = render(<App />);
  const titleElement = getByText(/Yieldify/i);
  expect(titleElement).toBeInTheDocument();
})
