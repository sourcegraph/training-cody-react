import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import PetDetails from './PetDetails';

describe('PetDetails Component', () => {
  const mockPetId = '10';
  const mockPet = {
    id: mockPetId,
    name: 'Cooper',
    category: { id: 26, name: 'Dog' },
    photoUrls: ['/images/Dog.jpg'],
    tags: [{ id: 60, name: 'Neutered' }],
    status: 'available'
  };

  // Setup default mock for all tests
  beforeEach(() => {
    // Mock fetch for all tests
    global.fetch = jest.fn(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPet)
      })
    );

    // Mock window.history.back
    window.history.back = jest.fn();
  });

  afterEach(() => {
    // Clear mock calls between tests
    jest.clearAllMocks();
  });

  test('displays loading state initially', async () => {
    // Create a promise that we'll resolve manually to control timing
    let resolvePromise;
    const fetchPromise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    
    global.fetch.mockImplementationOnce(() => fetchPromise);
    
    await act(async () => {
      render(<PetDetails petId={mockPetId} />);
    });
    
    expect(screen.getByText('Loading pet details...')).toBeInTheDocument();
    
    // Now resolve the fetch
    await act(async () => {
      resolvePromise({
        ok: true,
        json: () => Promise.resolve(mockPet)
      });
    });
  });

  test('displays pet details after successful API call', async () => {
    await act(async () => {
      render(<PetDetails petId={mockPetId} />);
    });
    
    // Use waitFor to properly handle async updates
    await waitFor(() => {
      expect(screen.getByText('Cooper')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Category:')).toBeInTheDocument();
    expect(screen.getByText('Dog')).toBeInTheDocument();
    expect(screen.getByText('Tags:')).toBeInTheDocument();
    expect(screen.getByText('Neutered')).toBeInTheDocument();
    expect(screen.getByText('available')).toBeInTheDocument();
    
    expect(global.fetch).toHaveBeenCalledWith(`/api/pets/${mockPetId}`);
  });

  test('displays error when API call fails', async () => {
    const errorMessage = 'Failed to fetch pet details';
    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: false,
      statusText: 'Not Found'
    }));
    
    await act(async () => {
      render(<PetDetails petId={mockPetId} />);
    });
    
    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  test('handles image loading error', async () => {
    await act(async () => {
      render(<PetDetails petId={mockPetId} />);
    });
    
    await waitFor(() => {
      expect(screen.getByAltText('Cooper')).toBeInTheDocument();
    });
    
    // Simulate image load error
    await act(async () => {
      fireEvent.error(screen.getByAltText('Cooper'));
    });
    
    // Check if the src was updated to the default image
    expect(screen.getByAltText('Cooper').src).toContain('placeholder.com');
  });

  test('calls back function when back button is clicked', async () => {
    await act(async () => {
      render(<PetDetails petId={mockPetId} />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Back to pets')).toBeInTheDocument();
    });
    
    await act(async () => {
      fireEvent.click(screen.getByText('Back to pets'));
    });
    
    expect(window.history.back).toHaveBeenCalled();
  });

  test('refreshes pet data when refresh button is clicked', async () => {
    await act(async () => {
      render(<PetDetails petId={mockPetId} />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Refresh')).toBeInTheDocument();
    });
    
    // Clear previous fetch calls to better track the refresh call
    global.fetch.mockClear();
    
    await act(async () => {
      fireEvent.click(screen.getByText('Refresh'));
    });
    
    expect(global.fetch).toHaveBeenCalledWith(`/api/pets/${mockPetId}`);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('handles pet not found when API returns no data', async () => {
    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(null)
    }));
    
    await act(async () => {
      render(<PetDetails petId={mockPetId} />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Pet not found')).toBeInTheDocument();
    });
  });

  test('loads pet when petId changes', async () => {
    let { rerender } = render(<PetDetails petId={mockPetId} />);
    
    await waitFor(() => {
      expect(screen.getByText('Cooper')).toBeInTheDocument();
    });
    
    // Clear previous fetch calls
    global.fetch.mockClear();
    
    // Change the petId prop
    const newPetId = '20';
    await act(async () => {
      rerender(<PetDetails petId={newPetId} />);
    });
    
    expect(global.fetch).toHaveBeenCalledWith(`/api/pets/${newPetId}`);
  });
});