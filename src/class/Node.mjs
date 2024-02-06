import { v4 } from 'uuid';
import Collection from '../helpers/Collection.mjs';
import Youtube from '../lib/Youtube.mjs';
import { shortSafeId } from '../helpers/id.mjs';

export default class Node {
  constructor(user) {
    // Create a unique identifier for the node
    this.uuid = v4();

    // Create a unique short identifier for the connexion
    this.connexionID = shortSafeId();

    // Data storage
    this.users = new Collection();

    // Set the master user
    this.masterUUID = user.uuid;
    // Add the master user to the node
    this.users.set(user.uuid, this.getBaseUserData());

    // Set the default parameters
    this.paylistUrl = 'https://www.youtube.com/playlist?list=PL4fGSI1pDJn7bK3y1Hx-qpHBqfr6cesNs';
    this.songNumber = 10;
    this.songExtractCount = 10;
    this.numberOfChoice = 4;

    // Parsed videos from the playlist
    this.videos = [];
    //this.timerPerSong = 10;
  }

  // Prepare the node before starting the game
  async prepare() {
    // Get the videos from the playlist
    const playlistId = /https:\/\/www.youtube.com\/playlist\?list=([A-Za-z1-9-]+)/.exec(this.paylistUrl)[1];
    const videos = await Youtube.getPlaylistItems(playlistId);
    // Suffle the videos
    for (let i = videos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [videos[i], videos[j]] = [videos[j], videos[i]];
    }
    // Extract songs
    this.videos = videos.slice(0, this.songNumber);
  }

  // Get the base user data
  getBaseUserData() {
    return {
      points: 0,
      answers: [],
    }
  }

  // Set the node parameters
  setParameters({ paylistUrl, songNumber, songExtractCount, numberOfChoice }) {
    this.paylistUrl = paylistUrl ?? this.paylistUrl;
    this.songNumber = songNumber ?? this.songNumber;
    this.songExtractCount = songExtractCount ?? this.songExtractCount;
    this.numberOfChoice = numberOfChoice ?? this.numberOfChoice;
  }

  // Add a user to the node
  addUser(user) {
    this.users.set(user.uuid, this.getBaseUserData())
    return this.users.get(user.uuid);
  }

  // Remove a user from the node
  removeUser(user) {
    this.users.delete(user.uuid);
  }

  // Get node data json compatible
  toJSON() {
    return {
      uuid: this.uuid,
      connexionID: this.connexionID,
      masterUUID: this.masterUUID,
      paylistUrl: this.paylistUrl,
      songNumber: this.songNumber,
      songExtractCount: this.songExtractCount,
      numberOfChoice: this.numberOfChoice,
      users: this.users.toJSON(),
      videos: this.videos,
    }
  }
}