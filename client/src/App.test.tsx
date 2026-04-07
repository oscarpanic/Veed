import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    })
  ) as jest.Mock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders the app header', () => {
  render(<App />);
  expect(screen.getByText(/VEED Video Library/i)).toBeInTheDocument();
});
