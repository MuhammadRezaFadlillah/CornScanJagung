# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

```
cornScan-main
├─ .babelrc
├─ .env
├─ cornScan-main.zip
├─ eslint.config.mjs
├─ index.html
├─ jsconfig.json
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ postcss.config.mjs
├─ public
│  ├─ assets
│  │  ├─ download.jpeg
│  │  └─ loading.lottie
│  ├─ favicon.ico
│  ├─ favicon.svg
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ index.html
│  ├─ logo.png
│  ├─ logo192.png
│  ├─ logo512.png
│  ├─ manifest.json
│  ├─ model
│  │  ├─ group1-shard1of4.bin
│  │  ├─ group1-shard2of4.bin
│  │  ├─ group1-shard3of4.bin
│  │  ├─ group1-shard4of4.bin
│  │  └─ model.json
│  ├─ model_hasil_konversi_graph
│  │  ├─ group1-shard1of4.bin
│  │  ├─ group1-shard2of4.bin
│  │  ├─ group1-shard3of4.bin
│  │  ├─ group1-shard4of4.bin
│  │  └─ model.json
│  ├─ next.svg
│  ├─ robots.txt
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ server.js
├─ src
│  ├─ app
│  │  ├─ dashboard
│  │  │  └─ page.js
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.js
│  │  ├─ login
│  │  │  └─ page.js
│  │  ├─ page.js
│  │  ├─ penyakit
│  │  │  └─ page.js
│  │  ├─ register
│  │  │  └─ page.js
│  │  └─ riwayat
│  │     └─ page.js
│  ├─ App.css
│  ├─ App.jsx
│  ├─ App.test.js
│  ├─ assets
│  │  └─ loading.lottie
│  ├─ components
│  │  ├─ about
│  │  │  ├─ BenefitsSection.jsx
│  │  │  ├─ DiseaseSection.jsx
│  │  │  ├─ FaqSection.jsx
│  │  │  ├─ MissionPointsSection.jsx
│  │  │  ├─ StatisticsSection.jsx
│  │  │  └─ TechnologySection.jsx
│  │  ├─ AboutSection.jsx
│  │  ├─ CameraTab.jsx
│  │  ├─ Card.jsx
│  │  ├─ ErrorDisplay.jsx
│  │  ├─ FileInput.jsx
│  │  ├─ ImagePreview.jsx
│  │  ├─ LoadingSpinner.jsx
│  │  ├─ ModelStatus.jsx
│  │  ├─ Navigation.jsx
│  │  ├─ PredictionResult.jsx
│  │  ├─ ProtectedRoute.jsx
│  │  └─ UploadTab.jsx
│  ├─ css
│  │  ├─ AuthPage.css
│  │  ├─ DashboardPage.css
│  │  ├─ HistoryPage.css
│  │  └─ ProfilePage.css
│  ├─ data
│  │  └─ aboutPageData.js
│  ├─ hooks
│  │  ├─ useCamera.js
│  │  ├─ usePrediction.js
│  │  └─ useTensorFlowModel.js
│  ├─ index.css
│  ├─ index.js
│  ├─ logo.svg
│  ├─ pages
│  │  ├─ AboutPage.jsx
│  │  ├─ CornLeafDetectionPage.jsx
│  │  ├─ DashboardPage.jsx
│  │  ├─ ForgotPasswordPage.jsx
│  │  ├─ HistoryPage.jsx
│  │  ├─ HomePage.jsx
│  │  ├─ LoginPage.jsx
│  │  ├─ ProfilePage.jsx
│  │  ├─ RegisterPage.jsx
│  │  ├─ ResetPasswordPage.jsx
│  │  └─ Team.jsx
│  ├─ reportWebVitals.js
│  ├─ services
│  │  └─ predictionService.js
│  ├─ setupTests.js
│  └─ utils
│     ├─ detectionUtils.js
│     ├─ labels.js
│     └─ recommendations.js
├─ tailwind.config.js
└─ webpack.config.js

```