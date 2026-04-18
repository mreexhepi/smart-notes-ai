# 📱 Smart Notes AI

Smart Notes AI is a cross-platform mobile application built with React Native, Expo, and Supabase.
It allows users to securely create, manage, search, and organize personal notes inside a clean and modern workspace.

This project was developed as a faculty project submission and focuses on practical mobile development concepts such as authentication, CRUD operations, secure cloud integration, and polished user experience.

---

## 🚀 Project Overview

The goal of Smart Notes AI is to provide a simple but professional personal notes app with:

* Secure user authentication
* Personal private workspace
* Note creation, editing, and deletion
* Tag-based organization
* Search and filtering
* Password reset flow
* Responsive and clean UI

The app uses Supabase for authentication and database storage, while Expo and React Native provide cross-platform support for Android, iOS, and web.

---

## ✨ Features

* User registration and login
* Secure Supabase authentication
* Forgot password flow
* Reset password flow
* Create new notes
* Edit existing notes
* Delete notes
* Manual tags support
* Smart tag suggestions based on note content
* Search notes by title/content
* Filter notes by tags
* Clean modern mobile-first UI
* Cross-platform support with Expo

---

## 🛠️ Tech Stack

* **Frontend:** React Native
* **Framework:** Expo
* **Routing:** Expo Router
* **Backend / BaaS:** Supabase
* **Language:** TypeScript
* **Authentication:** Supabase Auth
* **Database:** Supabase Postgres

---

## 📂 Project Structure

```bash
app/
  _layout.tsx
  index.tsx
  forgot-password.tsx
  reset-password.tsx

assets/
  images/

components/
hooks/
constants/

lib/
  supabase.ts

src/
  components/
  constants/
  utils/

.env.example
.gitignore
README.md
app.json
package.json
```

---

## ⚙️ Setup & Installation

1. Clone the repository:

```bash
git clone https://github.com/mreexhepi/smart-notes-ai.git
cd smart-notes-ai
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

Create a `.env` file in the root and add:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the app:

```bash
npx expo start
```

---

## 🔐 Environment Variables

This project uses environment variables for security.

Make sure to never commit your `.env` file.
Use `.env.example` as a reference.

---

## 📌 Status

🚧 In development — built as a faculty project with production-level structure.

---

## 👨‍💻 Author

Developed by **Your Name**

---

## 📸 Screenshots (Optional)

You can add screenshots of your app here to showcase UI:

```md
![App Screenshot](./assets/images/screenshot.png)
```

---

## 📄 License

This project is for educational purposes.
