# 📱 Smart Notes AI

Smart Notes AI is a cross-platform mobile application built with React Native, Expo, and Supabase.
It allows users to securely create, manage, search, and organize personal notes inside a clean and modern workspace.

This project was developed as a faculty project submission and focuses on practical mobile development concepts such as authentication, CRUD operations, secure cloud integration, and polished user experience.


The application is designed with a scalable and clean architecture, following best practices for environment management, component structure, and secure data handling.
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

- 🔐 User authentication (Register / Login / Reset Password)
- 📝 Create, edit, and delete personal notes
- 🔍 Real-time search by title and content
- 🏷️ Tag-based organization and filtering
- 🧠 Smart tag suggestions based on note content
- ☁️ Secure cloud sync with Supabase
- ⚡ Fast and responsive mobile-first UI
- 📱 Cross-platform support (Android, iOS, Web)

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

✅ Completed — Faculty Project (Production-ready structure)

---

## 👨‍💻 Author

Developed by **Muhamet Rexhepi**

---

## 📸 Screenshots

![App Screenshot](./assets/images/notes.png)
![App Screenshot](./assets/images/login.png)
![App Screenshot](./assets/images/newaccount.png)


---

## 📄 License

This project was developed for educational purposes as part of a faculty submission.
