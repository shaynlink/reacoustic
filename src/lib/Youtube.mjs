import { google } from 'googleapis';
const service = google.youtube('v3');

// Authentificate to google api
const auth = google.auth.fromAPIKey(process.env.GOOGLE_API_KEY);

export default class Youtube {
  // Get all videos from a playlist
  static async getPlaylistItems(playlistId) {
    const items = [];

    let lastPage = false;
    let pageToken = null;

    while (!lastPage) {
      const payload = {
        auth: auth,
        part: 'contentDetails, snippet',
        playlistId: playlistId,
        maxResults: 50
      }

      if (pageToken) {
        payload.pageToken = pageToken;
      }

      const response = await service.playlistItems.list(payload)

      items.push(...response.data.items);

      if (response.data.nextPageToken) {
        pageToken = response.data.nextPageToken;
      } else {
        lastPage = true;
      }
    }

    return items;
  }
}