export const BASE_URL = 'https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com';

async function fetchFavorites() {
  try {
    const response = await fetch(`${BASE_URL}/products/favorites`);
    if (!response.ok) {
      throw new Error(`Failed to fetch favorites: ${response.status}`);
    }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
}

fetchFavorites().then(favorites => {
  console.log('Favorite coffee products:', favorites);
});
