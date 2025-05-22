## Project Setup for Remote Patient Monitoring App(RPM)

## FrontEnd (Reactjs)

## Available Scripts

In the project directory, you can run:

## npm install 

after this command you need to run 

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!


## Backend (NodeJs)

# Set up environment variables using the .env.example file
# (Rename or copy .env.example to .env and fill in the required values)

# Install dependencies
npm install

# Apply existing Prisma migrations to the database
npx prisma migrate deploy

# (Alternatively, to reset the database and apply migrations)
# npx prisma migrate reset

# Start the local server
npm run start


## To add and use .env file in the project root directory I have added a .env.example file in the server folder you can change this file as per your need 
.env.example
