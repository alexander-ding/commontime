# Quote of the Week

This is the source code of [Commonwealth School](https://www.commschool.org/)'s scheduling app/website.

It is built using React.js and Redux with a Google Firebase backend.

## Getting Started

### Requirements

First of all, if you want to contribute to the project, contact a current developer to add you the as a collaborator to the Firebase project.

Install [Node.js](https://nodejs.org/en/download/), and use it to install React by running

```npm install -g create-react-app```

Install the firebase CLI by running

```npm install -g firebase-tools```

Then sign into Firebase using your Google account by running

```firebase login```

Make sure that you're signing in with the Google account that has edit access to the Firebase project.

Clone this repository and cd into it. Install the npm packages for both the root directory (for the frontend) and the `functions` directory.

```npm install && cd functions && npm install```

Now that you're in the `functions` directory, run

```firebase functions:config:get > .runtimeconfig.json```

to clone the environmental variables set on the cloud to your local machine for development.

### Local Development

My preferred setup is to have two shells open to the root directory of the project. On one, run `npm start` for the React development server. On another, run `firebase emulators:start --only functions` to start the Firebase function emulators.

You may access the [Firebase cloud console](https://console.firebase.google.com/) to play with the database.

**Please remember**: since the Firebase Firestore emulator is not well-supported yet, the local environment directly uses the production Cloud Firestore.

To deploy the build, simply run

```firebase deploy```

## Code Structure

The website frontend's source code is in `src`, and the Firebase cloud functions code is available in `functions`. `public` provides some static files for React to build the website with.
