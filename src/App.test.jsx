import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const weatherPayload = {
  cod: 200,
  name: 'Test City',
  main: { temp: 72 },
  weather: [{ main: 'Rain', description: 'light rain' }],
}

function jsonResponse(data) {
  return Promise.resolve({
    json: () => Promise.resolve(data),
  })
}

function installGeolocation(getCurrentPositionImpl) {
  Object.defineProperty(navigator, 'geolocation', {
    value: { getCurrentPosition: getCurrentPositionImpl },
    configurable: true,
    writable: true,
  })
}

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => jsonResponse(weatherPayload)),
    )
    installGeolocation(
      vi.fn((success) => {
        success({ coords: { latitude: 40.7128, longitude: -74.006 } })
      }),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    Reflect.deleteProperty(navigator, 'geolocation')
  })

  it('loads weather for the current location on mount', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Test City')).toBeInTheDocument()
    })

    expect(screen.getByText('72')).toBeInTheDocument()
    expect(screen.getByText('Rain')).toBeInTheDocument()
    expect(screen.getByText('light rain')).toBeInTheDocument()

    expect(fetch).toHaveBeenCalled()
    const url = fetch.mock.calls[0][0]
    expect(url).toContain('lat=40.7128')
    expect(url).toContain('lon=-74.006')
    expect(url).toContain('appid=test-api-key')
  })

  it('shows a message when location access is denied', async () => {
    installGeolocation(
      vi.fn((_success, error) => {
        error()
      }),
    )

    render(<App />)

    await waitFor(() => {
      expect(
        screen.getByText('Location access denied. Please search for a city'),
      ).toBeInTheDocument()
    })
  })

  it('validates empty city search', async () => {
    const user = userEvent.setup()
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Test City')).toBeInTheDocument()
    })

    await user.clear(screen.getByRole('textbox'))
    await user.click(screen.getByRole('button', { name: /search/i }))

    expect(
      await screen.findByText('Please enter a valid city'),
    ).toBeInTheDocument()
  })

  it('fetches weather by city name when searching', async () => {
    const user = userEvent.setup()
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Test City')).toBeInTheDocument()
    })

    vi.mocked(fetch).mockClear()
    vi.mocked(fetch).mockImplementation(() => jsonResponse({
      ...weatherPayload,
      name: 'Boston',
      main: { temp: 55 },
    }))

    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.type(input, 'Boston')
    await user.click(screen.getByRole('button', { name: /search/i }))

    await waitFor(() => {
      expect(screen.getByText('Boston')).toBeInTheDocument()
    })

    expect(screen.getByText('55')).toBeInTheDocument()

    const searchCall = fetch.mock.calls.find(([u]) =>
      String(u).includes('q=Boston'),
    )
    expect(searchCall).toBeDefined()
    expect(String(searchCall[0])).toContain('appid=test-api-key')
  })

  it('shows city not found when the API returns a non-200 cod', async () => {
    vi.mocked(fetch).mockImplementation(() =>
      jsonResponse({ cod: '404', message: 'city not found' }),
    )

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('City not found')).toBeInTheDocument()
    })
  })

  it('shows a generic error when fetch fails', async () => {
    vi.mocked(fetch).mockImplementation(() => Promise.reject(new Error('network')))

    render(<App />)

    await waitFor(() => {
      expect(
        screen.getByText('Something went wrong - please try again'),
      ).toBeInTheDocument()
    })
  })

  it('shows loading while a request is in flight', async () => {
    let resolveJson
    vi.mocked(fetch).mockImplementation(() =>
      Promise.resolve({
        json: () =>
          new Promise((resolve) => {
            resolveJson = resolve
          }),
      }),
    )

    render(<App />)

    expect(await screen.findByText('Loading...')).toBeInTheDocument()

    resolveJson(weatherPayload)

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })
    expect(screen.getByText('Test City')).toBeInTheDocument()
  })
})
