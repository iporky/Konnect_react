// Weather API service using Open-Meteo (completely free, no API key required)
const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1';
const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';

class WeatherAPI {
  // Get weather by coordinates
  async getWeatherByCoords(lat, lon) {
    try {
      const response = await fetch(
        `${WEATHER_BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=sunrise,sunset&timezone=auto`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      return this.formatOpenMeteoData(data, lat, lon);
    } catch (error) {
      console.error('Error fetching weather by coordinates:', error);
      throw error;
    }
  }

  // Get weather by city name (default: Seoul)
  async getWeatherByCity(city = 'Seoul') {
    try {
      // First, get coordinates for the city
      const geoResponse = await fetch(
        `${GEOCODING_BASE_URL}/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
      );
      
      if (!geoResponse.ok) {
        throw new Error(`Geocoding API error: ${geoResponse.status}`);
      }
      
      const geoData = await geoResponse.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error(`City not found: ${city}`);
      }
      
      const { latitude, longitude, name } = geoData.results[0];
      const weatherData = await this.getWeatherByCoords(latitude, longitude);
      // Override location name with the searched city name
      weatherData.location = name || city;
      return weatherData;
    } catch (error) {
      console.error('Error fetching weather by city:', error);
      throw error;
    }
  }

  // Get user's location weather
  async getCurrentLocationWeather() {
    try {
      // Try to get user's geolocation
      const position = await this.getCurrentPosition();
      return await this.getWeatherByCoords(position.coords.latitude, position.coords.longitude);
    } catch (error) {
      console.log('Geolocation failed, falling back to Seoul:', error);
      // Fallback to Seoul if geolocation fails
      return await this.getWeatherByCity('Seoul');
    }
  }

  // Helper function to get current position
  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          timeout: 10000,
          enableHighAccuracy: true,
          maximumAge: 300000 // 5 minutes cache
        }
      );
    });
  }

  // Format Open-Meteo weather data for consistent usage
  async formatOpenMeteoData(data, lat, lon) {
    const current = data.current;
    const daily = data.daily;
    const weatherCode = current.weather_code;
    
    // Determine if it's day or night
    const currentTime = new Date(current.time);
    const sunrise = daily?.sunrise?.[0] ? new Date(daily.sunrise[0]) : null;
    const sunset = daily?.sunset?.[0] ? new Date(daily.sunset[0]) : null;
    
    const isDay = this.isDayTime(currentTime, sunrise, sunset);
    const weatherInfo = this.getWeatherInfo(weatherCode, isDay);
    
    // Get location name using a more reliable reverse geocoding service
    let locationName = 'Unknown Location';
    try {
      // Use Nominatim (OpenStreetMap) for reverse geocoding - more reliable
      const reverseGeoResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`
      );
      if (reverseGeoResponse.ok) {
        const reverseGeoData = await reverseGeoResponse.json();
        if (reverseGeoData && reverseGeoData.display_name) {
          // Extract city name from the display name
          const address = reverseGeoData.address;
          locationName = address?.city || address?.town || address?.village || 
                       address?.county || address?.state || 'Unknown Location';
        }
      }
    } catch (error) {
      console.warn('Could not get location name:', error);
      // Fallback: try to determine city from coordinates
      if (lat >= 37.4 && lat <= 37.7 && lon >= 126.8 && lon <= 127.2) {
        locationName = 'Seoul';
      } else if (lat >= 35.0 && lat <= 35.3 && lon >= 128.9 && lon <= 129.4) {
        locationName = 'Busan';
      }
    }
    
    return {
      location: locationName,
      country: '', // Open-Meteo doesn't provide country in weather response
      temperature: Math.round(current.temperature_2m || 0),
      feelsLike: Math.round(current.apparent_temperature || 0),
      description: weatherInfo.description,
      main: weatherInfo.main,
      icon: weatherInfo.icon,
      humidity: Math.round(current.relative_humidity_2m || 0),
      windSpeed: Math.round((current.wind_speed_10m || 0) * 10) / 10, // Round to 1 decimal
      pressure: null, // Not available in current request
      visibility: null, // Not available in current request
      timestamp: Date.now(),
      sunrise: sunrise?.toISOString() || null,
      sunset: sunset?.toISOString() || null
    };
  }

  // Helper method to determine if it's day or night
  isDayTime(currentTime, sunrise, sunset) {
    // If we don't have sunrise/sunset data, use a simple time-based approach
    if (!sunrise || !sunset) {
      const hour = currentTime.getHours();
      return hour >= 6 && hour < 18; // Assume day from 6 AM to 6 PM
    }
    
    return currentTime >= sunrise && currentTime < sunset;
  }

  // Get weather info from WMO weather code with day/night consideration
  getWeatherInfo(weatherCode, isDay = true) {
    const suffix = isDay ? 'd' : 'n';
    
    const weatherCodes = {
      0: { main: 'Clear', description: 'clear sky', icon: `01${suffix}` },
      1: { main: 'Clear', description: 'mainly clear', icon: `01${suffix}` },
      2: { main: 'Clouds', description: 'partly cloudy', icon: `02${suffix}` },
      3: { main: 'Clouds', description: 'overcast', icon: `03${suffix}` },
      45: { main: 'Fog', description: 'fog', icon: `50${suffix}` },
      48: { main: 'Fog', description: 'depositing rime fog', icon: `50${suffix}` },
      51: { main: 'Drizzle', description: 'light drizzle', icon: `09${suffix}` },
      53: { main: 'Drizzle', description: 'moderate drizzle', icon: `09${suffix}` },
      55: { main: 'Drizzle', description: 'dense drizzle', icon: `09${suffix}` },
      56: { main: 'Drizzle', description: 'light freezing drizzle', icon: `09${suffix}` },
      57: { main: 'Drizzle', description: 'dense freezing drizzle', icon: `09${suffix}` },
      61: { main: 'Rain', description: 'slight rain', icon: `10${suffix}` },
      63: { main: 'Rain', description: 'moderate rain', icon: `10${suffix}` },
      65: { main: 'Rain', description: 'heavy rain', icon: `10${suffix}` },
      66: { main: 'Rain', description: 'light freezing rain', icon: `13${suffix}` },
      67: { main: 'Rain', description: 'heavy freezing rain', icon: `13${suffix}` },
      71: { main: 'Snow', description: 'slight snow fall', icon: `13${suffix}` },
      73: { main: 'Snow', description: 'moderate snow fall', icon: `13${suffix}` },
      75: { main: 'Snow', description: 'heavy snow fall', icon: `13${suffix}` },
      77: { main: 'Snow', description: 'snow grains', icon: `13${suffix}` },
      80: { main: 'Rain', description: 'slight rain showers', icon: `09${suffix}` },
      81: { main: 'Rain', description: 'moderate rain showers', icon: `09${suffix}` },
      82: { main: 'Rain', description: 'violent rain showers', icon: `09${suffix}` },
      85: { main: 'Snow', description: 'slight snow showers', icon: `13${suffix}` },
      86: { main: 'Snow', description: 'heavy snow showers', icon: `13${suffix}` },
      95: { main: 'Thunderstorm', description: 'thunderstorm', icon: `11${suffix}` },
      96: { main: 'Thunderstorm', description: 'thunderstorm with slight hail', icon: `11${suffix}` },
      99: { main: 'Thunderstorm', description: 'thunderstorm with heavy hail', icon: `11${suffix}` }
    };
    
    return weatherCodes[weatherCode] || { main: 'Unknown', description: 'unknown', icon: `01${suffix}` };
  }

  // Get weather icon URL (using a free icon service)
  getWeatherIconUrl(iconCode, size = '64') {
    // Using OpenWeatherMap's free icons (no API key required for icons)
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  // Mock weather data for development/fallback
  getMockWeatherData() {
    const currentTime = new Date();
    const isDay = this.isDayTime(currentTime, null, null);
    const weatherInfo = this.getWeatherInfo(2, isDay); // Partly cloudy
    
    return {
      location: 'Seoul',
      country: 'KR',
      temperature: 18,
      feelsLike: 16,
      description: weatherInfo.description,
      main: weatherInfo.main,
      icon: weatherInfo.icon,
      humidity: 65,
      windSpeed: 3.2,
      pressure: null,
      visibility: null,
      timestamp: Date.now(),
      sunrise: null,
      sunset: null
    };
  }
}

export const weatherAPI = new WeatherAPI();
export default weatherAPI;