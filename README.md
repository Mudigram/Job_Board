# 🔥 Internship & SIWES Job Board

This is a live job board built from a viral internship opportunity spreadsheet. I took it a step further by turning the static sheet into a searchable, categorized, and responsive platform.

🌍 [View Live Website](https://job-board-mudigram.vercel.app)

---

## 🚀 Overview

After discovering a Google Sheet listing over 150 internship and SIWES opportunities, I decided to make access and navigation easier for everyone. This project transforms that sheet into a modern job board application with useful features like search, filters, and dark mode.

---

## 🛠 Built With

- ⚛️ React + TypeScript
- 🎨 Tailwind CSS
- 💽 Supabase (for backend & database)
- 🧩 n8n (for automation)
- 🌙 Lucide React Icons
- ☁️ Deployed on Vercel

---

## 🔧 Features

- 💼 Categorized job listings (Internship, SIWES, Full-Time)
- 🔍 Live search & job mode filters (Remote, Hybrid, Onsite)
- 📱 Mobile-first responsive design
- 🌗 Dark/Light mode toggle
- 📧 Apply directly via recruiter’s email
- ⚙️ Scroll-to-top and modal interaction for details
- 🔄 Automation (data import via n8n workflow)
- 🧠 About modal & GitHub link for transparency

---

## ⚙️ How It Works

1. **Frontend** pulls jobs from a Supabase table.
2. **n8n workflow** fetches job listings from a public CSV/Google Sheet (once access is given).
3. Data is displayed on categorized job cards.
4. Users can search, filter, and click to view job details.
5. Modal opens with job description and recruiter contact link.

---

---

## 📦 Project Structure
job-board/
├── public/
├── src/
│ ├── components/
│ ├── lib/supabase.ts
│ └── App.tsx
├── .env
├── README.md
└── vite.config.ts


---

## 📬 Contact

Built by [@Mudigram](https://github.com/Mudigram)

Want to collaborate or hire?  
📧 [mudigram@gmail.com](mailto:mudigram@gmail.com)

---

## 📄 License

This project is open-source under the MIT License.

