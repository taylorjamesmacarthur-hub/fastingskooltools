# Bolt Deployment Instructions

1. Ensure your project files are committed to your repository.
2. Go to https://bolt.dev and log in or sign up.
3. Click "New Project" and connect your GitHub repo, or upload your project files.
4. Set the following environment variable:
   - DATABASE_URL=your_database_url (use SQLite, PostgreSQL, etc.)
5. For build settings, use:
   - Install command: npm install
   - Build command: npm run build
   - Start command: npm run dev or npm start
6. Click "Deploy" and wait for Bolt to build and host your app.
7. Your app will be live at the public URL Bolt provides.

If you need a sample .env file, let me know and I’ll generate one for you.