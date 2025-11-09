// Booking Services API
const API_BASE_URL = 'https://dev.konnect.kr/api/v1';

class BookingServices {
  // Get available service offerings
  async getServiceOfferings(page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc') {
    try {
      const response = await fetch(
        `${API_BASE_URL}/offerings/?page=${page}&limit=${limit}&sort_by=${sortBy}&sort_order=${sortOrder}`,
        {
          method: 'GET',
          headers: {
            'accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch service offerings: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching service offerings:', error);
      throw error;
    }
  }

  // Submit booking request to actual API
  async submitBookingRequest(bookingData) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/bookings/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to submit booking request: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error submitting booking request:', error);
      throw error;
    }
  }

  // Check if user has already submitted a request (based on IP or email)
  async checkExistingRequest(identifier) {
    try {
      // Note: This endpoint might need to be created on the backend
      const response = await fetch(
        `${API_BASE_URL}/service-requests/check/?identifier=${encodeURIComponent(identifier)}`,
        {
          method: 'GET',
          headers: {
            'accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return { exists: false };
        }
        throw new Error(`Failed to check existing request: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking existing request:', error);
      // Return false by default if check fails
      return { exists: false };
    }
  }

  // Get user's IP address for duplicate checking
  async getUserIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      if (!response.ok) {
        throw new Error('Failed to get IP address');
      }
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error getting IP address:', error);
      return null;
    }
  }

  // Format service offerings for dropdown display
  formatServiceOfferings(offerings) {
    if (!offerings || !offerings.items) {
      return [];
    }

    return offerings.items.map(offering => ({
      value: offering.key,
      label: offering.name,
      description: offering.description,
      businessName: offering.business_name,
      businessEmail: offering.business_email,
      id: offering.id
    }));
  }


}

export const bookingServices = new BookingServices();
export default bookingServices;