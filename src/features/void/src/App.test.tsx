import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock child components to avoid deep rendering issues and focus on App logic
vi.mock('../components/Header', () => ({
    Header: () => <div data-testid="header">Header</div>
}));
vi.mock('../components/Footer', () => ({
    Footer: () => <div data-testid="footer">Footer</div>
}));
vi.mock('../components/pages/HomePage', () => ({
    HomePage: () => <div data-testid="home-page">Home Page</div>
}));

describe('App Component', () => {
    it('renders without crashing', () => {
        render(<App />);
        expect(document.body).toBeInTheDocument();
    });

    it('renders the header and footer', async () => {
        render(<App />);
        // Since we are mocking, we expect these to be present
        expect(await screen.findByTestId('header')).toBeInTheDocument();
        expect(await screen.findByTestId('footer')).toBeInTheDocument();
    });
});
