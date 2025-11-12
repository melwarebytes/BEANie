# 🫘 **BEANie — The Coffee Encyclopedia & Brew Journal**

> A handcrafted MERN stack web app for coffee lovers, home brewers, and baristas — exploring origins, brewing methods, and the science behind every perfect cup.

---

### ☕ Overview

**BEANie** is a full-stack **MERN** (MongoDB, Express, React, Node.js) web application that blends **education and design** into a digital coffee experience.  
Users can explore detailed encyclopedia entries, bean profiles, brew guides, and blogs — all in a minimalist, coffee-brown theme that feels warm and inviting.

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React + Vite + Axios + React Router |
| **Backend** | Node.js + Express |
| **Database** | MongoDB + Mongoose |
| **Styling** | TailwindCSS / Custom CSS (coffee-inspired palette) |
| **Auth** | JWT (JSON Web Token) |
| **Emailing** | Nodemailer (for Contact form jobs hook) |
| **Validation** | Express Validator + Sanitize-HTML |
| **Deployment Ready** | Vercel (Frontend) + Render / Railway (Backend) |

---

## 🚀 Features

### 👩‍💻 Frontend
- Responsive, coffee-themed interface ☕  
- Interactive homepage with featured blogs & encyclopedia entries  
- **Bean Library** — detailed origin, process, and tasting notes  
- **Encyclopedia** — searchable database with category filters  
- **Blog** — full posts with deep dives into sustainability and brewing  
- Smooth animations, clean typography, and dark-beige color harmony  
- Secure login and JWT-based authentication  
- Minimal admin dashboard for CRUD operations  

### 🧩 Backend
- RESTful API routes for `/api/blogs`, `/api/beans`, `/api/encyclopedia`, `/api/auth`
- Secure role-based authentication middleware
- Data validation and sanitization
- Modular structure (models, routes, config, middleware)
- Separate seed scripts for each collection
- Email job hooks for contact form messages

---

## 📂 Project Structure

```
BEANie/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Blog.js
│   │   ├── Bean.js
│   │   └── Encyclopedia.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── blogs.js
│   │   ├── beans.js
│   │   └── encyclopedia.js
│   ├── middleware/
│   │   └── auth.js
│   ├── scripts/
│   │   ├── seed-users.js
│   │   ├── seed-blogs.js
│   │   ├── seed-encyclopedia-full.js
│   │   ├── seed-more-beans.js
│   │   └── seed-all.js
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Blog.jsx
    │   │   ├── BlogPost.jsx
    │   │   ├── Encyclopedia.jsx
    │   │   ├── EncyclopediaItem.jsx
    │   │   ├── BeanLibrary.jsx
    │   │   ├── About.jsx
    │   │   ├── Contact.jsx
    │   │   ├── Auth.jsx
    │   │   └── Dashboard.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   └── Card.jsx
    │   ├── api/
    │   │   └── apiClient.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── vite.config.js
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/BEANie.git
cd BEANie
```

### 2️⃣ Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

---

### 3️⃣ Environment Variables

Create a `.env` file inside `/backend`:
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/beanie
JWT_SECRET=supersecretkey
```

Create a `.env.local` file inside `/frontend`:
```bash
VITE_API_BASE=http://localhost:5000
```

---

### 4️⃣ Seed the Database

Run the following commands inside `/backend`:

```bash
node scripts/seed-users.js
node scripts/seed-blogs.js
node scripts/seed-encyclopedia-full.js
node scripts/seed-more-beans.js
```

To clear and reseed everything:
```bash
node scripts/seed-all.js
```

---

### ▶️ Run the App

**Backend:**
```bash
npm run dev
```

**Frontend:**
```bash
npm run dev
```

Then visit 👉 [http://localhost:3000](http://localhost:3000)

---

### 🔑 Default Admin Login

| Email | Password |
|--------|-----------|
| `admin@beanie.local` | `password123` |

---

## 🎨 Design Aesthetic

BEANie uses a **coffee-inspired design system**:  
warm browns, soft cream tones, subtle shadows, and natural typography — giving the app a handcrafted, calm, and premium café vibe.

> _“Crafted with care for coffee lovers.”_

---

## 🔒 Security

- JWT authentication  
- Role-based admin protection  
- Input sanitization and validation  
- CORS-safe communication  
- Secure password hashing with bcrypt  

---

## 🧭 Future Enhancements

- User profiles and saved brew logs ☕  
- Comment system under blogs  
- Advanced search by origin, process, and roast level  
- Content scheduling and analytics for admins  
- Integration with coffee data APIs  

---

## 👨‍💻 Contributors

| Name | Role | GitHub |
|------|------|---------|
| **Merull Shah** | Full Stack Developer, Designer | [@melwarebytes](https://github.com/melwarebytes) |
| **Meghna Sanjeev** | Full Stack Developer, UI/UX Collaborator | [@melonmeg](https://github.com/melonmeg) |

> Together, crafting BEANie — one cup at a time ☕💻

---

## 🧡 License

This project is open-sourced under the **MIT License**.  
Feel free to fork, modify, and build upon it — responsibly and with good coffee.

---

### © 2025 BEANie
**"Crafted with care for coffee lovers."**