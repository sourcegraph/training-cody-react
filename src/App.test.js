import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock PetList component
jest.mock('./components/PetList', () => {
  return function MockPetList({ pets, loading, error }) {
    return (
      <div role="list" aria-label="Pet list">
        {loading && <div role="status" aria-label="Loading pets">Loading...</div>}
        {error && <div role="alert">Error: {error}</div>}
        {!loading && !error && <div role="status" aria-label="Pets count">Pets count: {pets.length}</div>}
      </div>
    );
  };
});

describe('App Component', () => {
  // Setup default mock for all tests
  beforeEach(() => {
    // Mock fetch for all tests
    global.fetch = jest.fn(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    );
  });

  afterEach(() => {
    // Clear mock calls between tests
    jest.clearAllMocks();
  });

  test('renders header correctly', async () => {
    render(<App />);
    
    // Make sure we're finding the header text
    expect(screen.getByRole('heading', { name: 'Pet Store' })).toBeInTheDocument();
    expect(screen.getByText('Find your perfect pet companion')).toBeInTheDocument();
    
    // Wait for all pending promises to resolve
    await waitFor(() => {
      // Wait for component to finish rendering
    });
  });

  test('displays loading state initially', () => {
    // Override default mock for this specific test
    global.fetch.mockImplementationOnce(() => new Promise(resolve => {
      // Don't resolve immediately to ensure loading state is visible
      setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve([])
      }), 100);
    }));
    
    render(<App />);
    expect(screen.getByRole('status', { name: 'Loading pets' })).toBeInTheDocument();
  });

  test('displays pets after successful API call', async () => {
    const mockPets = [
      { id: 1, name: 'Buddy', status: 'available' },
      { id: 2, name: 'Max', status: 'available' }
    ];
    
    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockPets)
    }));
    
    render(<App />);
    
    // Use waitFor to properly handle async updates
    await waitFor(() => {
      expect(screen.getByRole('status', { name: 'Pets count' })).toBeInTheDocument();
    });
    
    expect(global.fetch).toHaveBeenCalledWith('/api/pets/random/10');
  });

  test('displays error when API call fails', async () => {
    const errorMessage = 'Failed to fetch pets: Not Found';
    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: false,
      statusText: 'Not Found'
    }));
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
    });
  });

  test('loads pets on component mount', async () => {
    render(<App />);
    
    // Verify the API was called on mount
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/pets/random/10');
    });
  });
});
