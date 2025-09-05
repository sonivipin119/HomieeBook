# Homiee | Home Reservation System
 "**HomieeBook** is a **modern web application** designed to make book sharing, renting, and management simple and efficient."
 "It connects **guests (readers)** and **hosts (owners)**, creating a community-driven platform where users can **exchange books, manage collections, and explore** new reads easily."
 " "
 "This project is built to help users who struggle with finding affordable books or sharing their own books with others in a **secure, user-friendly environment**."
 
---
 
# 🚀 Features
 "- 📖 **Browse & Search Books** – Explore a large collection of books by genre, author, or title."
 "- 👤 **Guest & Host Roles** – Guests can borrow/rent books, while hosts can upload/manage their collections."
 "- 🖼 **Upload Book Photos** – Hosts can showcase book covers and details for better visibility."
 "- 🔐 **User Authentication** – Secure login & signup system for safe access."
 "- 📊 **Dashboard** – Manage personal book collections, borrowed books, and requests."
 "- 📱 **Responsive Design** – Works seamlessly on desktop and mobile devices."
 "- ⚡ **Fast & Modern UI** – Clean design with smooth user experience."
 
---
 
# 📸 Screenshots

![App Screenshot]()
![App Screenshot]()
![App Screenshot]()
![App Screenshot]()

---

# ⚙️ Installation
"Follow these steps to set up HomieeBook locally:"
 Clone the repository:
 ```
 git clone https://github.com/sonivipin119/HomieeBook.git
 cd HomieeBook
 ```
 Install dependencies:
 ```
 npm install
 ```
 
 Create a .env file in the server directory and add the following:
 ```
 SESSION_SECRET=scr3t_k3y_here
 PORT=port_number_here
 GOOGLE_CLIENT_ID=your_google_client_id_here
 GOOGLE_CLIENT_SECRET=your_google_client_secret_here
 DB_PATH=your_database_connection_url_here
 CLOUDINARY_CLOUD_NAME=Cloudinary_cloud_name_here
 CLOUDINARY_API_KEY=Cloudinary_api_key_here
 CLOUDINARY_API_SECRET=Cloudinary_api_secret_here
 ```
 
 Start the development server:
 ```
 npm start
 ```

 Open in browser
 ```
 http://localhost:Port_Number
 ```
---

# 📖 Usage
- ## Guest User
 - Browse books
 - Request/borrow from hosts
 - View borrowing history
- ## Host User
 - Upload books with images & details
 - Manage availability
 - Approve/reject borrow requests.

---

## 📑 Software Requirement Specification (SRS) – Summary  

### 🔹 Problem Statement  
Many readers find it difficult to access books affordably or to share their own collections effectively.  
There is a need for a **community-driven platform** that bridges this gap.  

---

### 🔹 Users  

- **Guest (Reader):** Can browse, search, borrow, and interact with hosts.  
- **Host (Book Owner):** Can upload, manage, and lend books.  

---

### 🔹 Flow of Application  

1. **Signup/Login** as Guest or Host.  
2. Guests **search for books** by categories.  
3. Hosts **upload books** with cover images and details.  
4. Guests **send requests** to borrow books.  
5. Hosts **approve/deny requests**.  
6. Both parties manage their history via the **dashboard**.  

---

## 📌 Tech Stack  

- **Frontend:** Html 
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT / OAuth
- **File Storage:** Cloudinary + Multer
- **Email Service:** Email.js
- **Hosting:** Vercel / Netlify / Heroku  

---

## 🤝 Contributing  

Contributions are welcome! 🎉  

1. Fork the repo  
2. Create a feature branch  
3. Commit your changes  
4. Submit a pull request  

---

## ✨ Author  

👤 **Vipin Soni**  
- GitHub: [@sonivipin119](https://github.com/sonivipin119)  
- LinkedIn: [Your LinkedIn Profile](https://www.linkedin.com/)  
