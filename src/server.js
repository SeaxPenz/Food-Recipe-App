import express from 'express';
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favoritesTable } from './db/schema.js';
import { and, eq } from 'drizzle-orm';
import job from './config/cron.js';

// Removed duplicate imports

const app = express();
const PORT = ENV.PORT || 5001;

// Start cron job only in production and only if it's available
if (ENV.NODE_ENV === 'production') {
  try {
    if (job && typeof job.start === 'function') {
      job.start();
    } else {
      console.warn('Cron job not started: invalid export from ./config/cron.js');
    }
  } catch (e) {
    console.error('Error starting cron job:', e);
  }
}

// Parse JSON but keep the raw body for debugging malformed JSON
app.use(express.json({
  verify: (req, res, buf) => {
    try {
      req.rawBody = buf.toString();
    } catch (e) {
      req.rawBody = '';
    }
  }
}));

// // Root route so GET / doesn't return "Cannot GET /"
// app.get('/', (req, res) => {
//   return res.status(200).send('OK');
// });

// app.get('/api/health', (req, res) => {
//   res.status(200).json({ success: true, message: 'API is healthy' });
// });

app.get('/api/favorites/:userId/:recipeId', async (req, res) => {
  try {
    const { userId, recipeId } = req.params;

    const userFavorites = await db.select().from(favoritesTable).where(eq(favoritesTable.userId, userId));

    res.status(200).json(userFavorites);

  } catch (error) {
    console.error('Error fetching favorite recipe:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/favorites', async (req, res) => {
  // Logic to add a new favorite recipe
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body;
    if (!userId || !recipeId || !title || !image || !cookTime || !servings) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const newFavorites = await db
      .insert(favoritesTable)
      .values({ userId, recipeId, title, image, cookTime, servings })
      .returning();

    return res.status(201).json({ success: true, data: newFavorites });
  } catch (error) {
    console.error('Error adding favorite recipe:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/favorites/:userId/:recipeId', async (req, res) => {
  // Logic to remove a favorite recipe by ID
  try {
    const { userId, recipeId } = req.params;

    // await db.delete(favoritesTable)
    //   .where({ userId, recipeId })
    //   .returning();

    await db.delete(favoritesTable)
      .where(and(eq(favoritesTable.userId, userId), eq(favoritesTable.recipeId, parseInt(recipeId))));

    res.status(200).json({ message: 'Favorite recipe removed successfully' });
  } 
  
  catch (error) {
    console.error('Error removing favorite recipe:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log('Server is running on PORT:', PORT)
});

// Error handler for malformed JSON bodies
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Malformed JSON received:', req.rawBody);
    return res.status(400).json({ success: false, message: 'Malformed JSON in request body' });
  }
  next(err);
});