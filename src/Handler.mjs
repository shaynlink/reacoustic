import express from 'express';
import cors from 'cors';
import Node from './class/Node.mjs';

export default function handler() {
  // Use express.json() to parse the body of the request
  this.app.use(express.json());

  // Use cors() to allow cross-origin requests
  this.app.use(cors());

  // Middleware to check if the user is authenticated
  this.app.use((req, res, next) => {
    if (!req.headers['x-uuid-authorization']) {
      res.status(401).json({ error: 'Need authenticate first' });
      return;
    }

    if (!this.users.has(req.headers['x-uuid-authorization'])) {
      res.status(401).json({ error: 'No user found' });
      return;
    }
    req.user = this.users.get(req.headers['x-uuid-authorization']);
    next();
  })

  // Get all users
  this.app.get('/users', (req, res) => {
    res.status(202).json(this.users.toJSON());
  })

  // Get current connected user
  this.app.get('/users/me', (req, res) => {
    res.status(202).json(req.user.toJSON());
  })

  this.app.patch('/users/me',
    // Middleware to check data integrity
    (req, res, next) => {
      if (req.body.username) {
        if (req.body.username.length < 1) {
          res.status(400).json({ error: 'Username is too short' });
          return;
        }
        if (req.body.username.length > 20) {
          res.status(400).json({ error: 'Username is too long' });
          return;
        }
      }

      if (req.body.color) {
        if (!/^#[A-Fa-f1-9]{3,6}$/.test(req.body.color)) {
          res.status(400).json({ error: 'Invalid color' });
          return;
        }
      }

      next();
    },
    // Update the user
    (req, res) => {
      req.user.setParameters(req.body);
      res.status(202).json(req.user.toJSON());
    });

  // Get all nodes
  this.app.get('/nodes', (req, res) => {
    res.status(202).json(this.nodes.toJSON());
  })

  // Create a new node
  this.app.post('/nodes', async (req, res) => {
    const node = new Node(req.user);
    this.nodes.set(node.uuid, node);
    res.status(201).json(node.toJSON());
  })

  // Get current connected node
  this.app.get('/nodes/me', (req, res) => {
    const node = this.nodes
      .find((node) => node.users.has(req.user.uuid))

    if (!node) {
      res.status(404).json({ error: 'No node found' });
      return;
    }

    res.status(202).json(node.toJSON());
  })

  // Update the current node
  this.app.patch('/nodes/me',
  // Middleware to check data integrity
  (req, res, next) => {
    if (req.body.paylistUrl) {
      if (!/https:\/\/www.youtube.com\/playlist\?list=([A-Za-z1-9-]+)/.test(req.body.paylistUrl)) {
        res.status(400).json({ error: 'Invalid playlist url' });
        return;
      }
    }

    if (req.body.songNumber) {
      if (req.body.songNumber < 1) {
        res.status(400).json({ error: 'Song number is too low' });
        return;
      }
      if (req.body.songNumber > 150) {
        res.status(400).json({ error: 'Song number is too high' });
        return;
      }
    }

    if (req.body.songExtractCount) {
      if (req.body.songExtractCount < 1) {
        res.status(400).json({ error: 'Song extract count is too low' });
        return;
      }
      if (req.body.songExtractCount > 50) {
        res.status(400).json({ error: 'Song extract count is too high' });
        return;
      }
    }

    if (req.body.numberOfChoice) {
      if (req.body.numberOfChoice < 2) {
        res.status(400).json({ error: 'Number of choice is too low' });
        return;
      }
      if (req.body.numberOfChoice > 10) {
        res.status(400).json({ error: 'Number of choice is too high' });
        return;
      }
    }

    next();
  },
  // Update the node
  (req, res) => {
    const node = this.nodes
      .find((node) => node.users.has(req.user.uuid))

    if (!node) {
      res.status(404).json({ error: 'No node found' });
      return;
    }

    node.setParameters(req.body);

    res.status(202).json(node.toJSON());
  })
}