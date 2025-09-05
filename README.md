# 🏠 HomieeBook | Home Reservation System  

**HomieeBook** is a **modern web application** designed to make **home reservation, renting, and management simple and efficient**.  

It connects **guests (renters)** and **hosts (owners)**, creating a community-driven platform where users can **explore homes, book stays, and manage reservations** easily.  

This project is built to help users who struggle with **finding affordable homes** or **managing their rental properties** in a secure, user-friendly environment.  

---

## 🌍 Live Demo  
Check out the live version of HomieeBook here:  
👉 [HomieeBook on Vercel](https://homiee-book-9a2u.vercel.app/)

---
## 🚀 Features  

- 🏡 **Browse & Search Homes** – Explore available homes by location, type, or price range.  
- 👤 **Guest & Host Roles** – Guests can book homes, while hosts can upload/manage their listings.  
- 🖼 **Upload Home Photos** – Hosts can showcase property images and details for better visibility.  
- 🔐 **User Authentication** – Secure login & signup system for safe access.  
- 📊 **Dashboard** – Manage bookings, reservations, and property details.  
- 📱 **Responsive Design** – Works seamlessly on desktop and mobile devices.  
- ⚡ **Fast & Modern UI** – Clean design with smooth user experience.  

---

## 📸 Screenshots  

![Homepage](https://github.com/sonivipin119/HomieeBook/blob/main/assets/Screenshot%202025-09-05%20100250.png)  
![Dashboard](https://github.com/sonivipin119/HomieeBook/blob/main/assets/Screenshot%202025-09-05%20100324.png) 
![SignUp/Login](https://github.com/sonivipin119/HomieeBook/blob/main/assets/Screenshot%202025-09-05%20100525.png)
![Favourite](https://github.com/sonivipin119/HomieeBook/blob/main/assets/Screenshot%202025-09-05%20100558.png)
![Bookings](https://github.com/sonivipin119/HomieeBook/blob/main/assets/Screenshot%202025-09-05%20100614.png)
![Details](https://github.com/sonivipin119/HomieeBook/blob/main/assets/Screenshot%202025-09-05%20100649.png)
![Deatils2](https://github.com/sonivipin119/HomieeBook/blob/main/assets/Screenshot%202025-09-05%20100701.png)

---

# ⚙️ Installation

Follow these steps to set up HomieeBook locally:
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

## 📖 Usage

- 👤 Guest User
 - Browse homes
 - Filter/search by location & budget
 - Request/book a home
 - View booking history

- 🏠 Host User
 - Upload property details with images
 - Manage availability & reservations
 - Approve/reject booking requests

---

## 📑 Software Requirement Specification (SRS) – Summary  

### 🔹 Problem Statement  
Many users face challenges in finding affordable and trusted homes, while property owners struggle to manage reservations efficiently.
There is a need for a **community-driven platform** that bridges this gap.

---

### 🔹 Users  

- **Guest (Reader):** Can browse, search, and book homes..  
- **Host (Book Owner):** Can upload, manage, and rent out homes.  

---

### 🔹 Flow of Application  

1. **Signup/Login** as Guest or Host.  
2. Guests **search for homes** by location.  
3. Hosts **upload property details** with images and availability
4. Guests **send requests** to booking homes.  
5. Hosts **approve/deny requests**.  
6. Both parties manage their history via the **dashboard**.  

---

## 📌 Tech Stack  

- **Frontend:** Html, Tailwind CSS
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT / OAuth
- **File Storage:** Cloudinary + Multer
- **Email Service:** Email.js
- **Hosting:** Vercel / Netlify 

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
- LinkedIn: [Your LinkedIn Profile](https://www.linkedin.com/in/vipin-soni-416a61257/)  
