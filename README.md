# Smart Notes AI

Smart Notes AI is a cross-platform mobile application built with React Native, Expo, and Supabase.  
It allows users to securely create, manage, search, and organize personal notes inside a clean and modern workspace.

This project was developed as a fakultet project submission and focuses on practical mobile development concepts such as authentication, CRUD operations, secure cloud integration, and polished user experience.

---

## Project Overview

The goal of Smart Notes AI is to provide a simple but professional personal notes app with:

- secure user authentication
- personal private workspace
- note creation, editing, and deletion
- tag-based organization
- search and filtering
- password reset flow
- responsive and clean UI

The app uses Supabase for authentication and database storage, while Expo and React Native provide cross-platform support for Android, iOS, and web.

---

## Features

- User registration and login
- Secure Supabase authentication
- Forgot password flow
- Reset password flow
- Create new notes
- Edit existing notes
- Delete notes
- Manual tags support
- Smart tag suggestions based on note content
- Search notes by title/content
- Filter notes by tags
- Clean modern mobile-first UI
- Cross-platform support with Expo

---

## Tech Stack

- **Frontend:** React Native
- **Framework:** Expo
- **Routing:** Expo Router
- **Backend / BaaS:** Supabase
- **Language:** TypeScript
- **Authentication:** Supabase Auth
- **Database:** Supabase Postgres

---

## Project Structure

```bash
app/
  _layout.tsx
  index.tsx
  forgot-password.tsx
  reset-password.tsx

lib/
  supabase.ts

src/
  components/
  constants/
  utils/