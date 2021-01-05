# CS Chat app

## Requirements

- [ ] User can register/login with email and password
- [ ] User can log in with Fb/Google account
- [ ] User stay logged in across browser refresh
- [ ] User can see a list of other users
- [ ] User can search other users by name

Socket.io:

- [ ] User can open a conversation by clicking on the other's name
- [ ] User can chat in a global room
- [ ] User will recieve a notification if someone send him/her a message
- [ ] User can see who is online/offline
- [ ] User can see number of online users

## Implementation

- DB Design
  - User Model: name, email, password, avatarUrl
  - Message Model: from (ref User), to (ref User), body, conversation (ref: Conversation)
  - Conversation Model: users [user], lastMessage, lastMessageUpdatedAt
  - GlobalMessage Model: user (ref User), body
- Backend
  - Setup project
    - npx express-generator --no-view
    - npm i nodemon, add: "dev": "nodemon bin/www"
    - npm i dotenv cors, add them to app.js
    - remove everthing in public/
    - .env: PORT=5000, MONGODB_URI=mongodb://localhost:27017/cs-chat-app
    - Put in helpers/utils.helper.js
    - Put error handlers in app.js
    - Put in mongoose connect
    - Setup endpoints: POST api/auth/login, POST api/auth/login/facebook, POST api/auth/login/google, GET api/users/me, GET api/users, GET api/conversations
    - Create controllers: user.controler.js, auth.controler.js
    - Middlewares: authentication, passport
    - Socket.io
- Frontend
  - Setup React app with Login/Register, redux
  - Get Current user when the app restart
  - Add Fb/Google Login
  - UI
  - Get the list of users
  - Get the list of conversations
  - Socket.io
