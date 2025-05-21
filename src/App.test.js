import { render, screen, waitFor, act } from '@testing-library/react';
import App from './App';
import axios from 'axios';

// Mock PetList component
jest.mock('./components/PetList', () => {
  return function MockPetList({ pets, loading, error }) {
    return (
      <div data-testid="pet-list">
        {loading && <div data-testid="loading-state">Loading...</div>}
        {error && <div data-testid="error-state">Error: {error}</div>}
        {!loading && !error && <div data-testid="pets-state">Pets count: {pets.length}</div>}
      </div>
    );
  };
});

describe('App Component', () => {
  // Setup default mock for all tests
  beforeEach(() => {
    // Ensure axios.get is mocked for ALL tests
    axios.get = jest.fn(() => new Promise(resolve => {
      // Use setTimeout to make the promise resolve asynchronously
      // This gives React time to process updates properly
      setTimeout(() => resolve({ data: [] }), 0);
    }));
  });

  afterEach(() => {
    // Clear mock calls between tests
    jest.clearAllMocks();
  });

  test('renders header correctly', async () => {
    render(<App />);
    
    // Make sure we're finding the header text
    expect(screen.getByText('Pet Store')).toBeInTheDocument();
    expect(screen.getByText('Find your perfect pet companion')).toBeInTheDocument();
    
    // Wait for all pending promises to resolve
    await act(async () => {
      await Promise.resolve(); // Wait for all pending state updates
    });
  });

  test('displays loading state initially', () => {
    // Override default mock for this specific test
    axios.get.mockImplementationOnce(() => new Promise(resolve => {
      // Don't resolve immediately to ensure loading state is visible
      setTimeout(() => resolve({ data: [] }), 100);
    }));
    
    render(<App />);
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
  });

  test('displays pets after successful API call', async () => {
    const mockPets = [
      { id: 1, name: 'Buddy', status: 'available' },
      { id: 2, name: 'Max', status: 'available' }
    ];
    
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: mockPets }));
    
    render(<App />);
    
    // Use waitFor to properly handle async updates
    await waitFor(() => {
      expect(screen.getByTestId('pets-state')).toBeInTheDocument();
    });
    
    expect(axios.get).toHaveBeenCalledWith('/api/pets/random/10');
  });

  test('displays error when API call fails', async () => {
    const errorMessage = 'Network Error';
    axios.get.mockImplementationOnce(() => Promise.reject({ message: errorMessage }));
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });
  });
});
