# Inner Circle 🕵️‍♂️

**Inner Circle** is a full-stack web application that enables users to anonymously share and view messages, with membership-based access control and administrative privileges. It is designed using a layered MVC architecture and leverages authentication, session management, and PostgreSQL for a dynamic user experience.

---

##  Features

-  Anonymous message posting
-  Local authentication using `Passport.js`
-  Role-based access: `Joinee`, `Elite`, and `Admin`
-  Elite members can view usernames and timestamps of messages
-  Admins can delete inappropriate messages
-  Timestamped messages with sorted display
-  Obfuscated content for non-elite users
-  Session persistence across routes (with `express-session`)
-  Form validation with `express-validator`

## 🛠️ Tech Stack

### Backend:
- **Node.js** – Runtime environment
- **Express.js** – Web framework
- **Passport.js** – Local authentication
- **pg (node-postgres)** – PostgreSQL driver for Node.js
- **express-session** – Session management
- **connect-flash** – Flash messages (optional)
- **express-validator** – Input validation and sanitization

### Frontend:
- **EJS** – Embedded JavaScript templating
- **HTML5 & CSS3** – Layout and styling
- **Flexbox & Grid** – Responsive UI
- **Custom JavaScript** – Client-side enhancements

### Database:
- **PostgreSQL** – Relational database
- **Neon.tech** – Serverless PostgreSQL hosting (in deployment)
- Normalized schema with foreign key relations

Made with ❤️ by Lakshya Tyagi


