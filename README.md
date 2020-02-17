# Commercetools extensions for ContentStack

## Overview
Contentstack™ is a headless content management system (CMS) category. commercetools is also a headless system, providing commerce APIs. This project helps to bring both together to build integrated headless solutions.
It is built on top of create-react-app (CRA) template and uses `ngrok` to simplify development and debugging processes.

![demo](/docs/demo.gif)

## Installation
### Package code
Packaging process is fully compatible цер the original CRA template. Run the following command to build your project. 
``` bash
yarn build
```
All files required for deployment will appear in `/build` in the root of your repository.

### Deployment & Hosting
This extension is in fact SPA. So to host it you need to deploy it at minimum to a static web-share (e.g. Netlify or AWS S3 static websites).

### Contentstack configuration
The detailed process of configuring Contentstack Field extensions is described [here](https://www.contentstack.com/docs/developers/create-custom-fields/create-new-custom-field), so I would skip a few details.

#### Parameters
To connect to commerce tools this extension will need the following variables:
``` JSON
{
    "project_key": "<CT project name>",
    "domain": "commercetools.co",
    "client_id": "< client ID for CT API access >",
    "client_secret": "< client secret for CT API access >",
    "type": "< field type >"
}
```
Currently, two field types are supported `category` and `product`

#### Hosting for the local machine (for development)
When you developing an extension of modifying it is very useful to use [ngrok](https://ngrok.com/), which is a dynamic proxy for your application.

Its setup is as easy as running `npm i -g` command.
``` bash
npm i ngrok -g
ngrok http 3000 # as CRA will start your dev setup on this port by default
```
Once ngrok started you need to put its address into Contentstack extension configuration and save it.
You most likely will need to do this every time you restart the proxy as it will generate the address dynamically.


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Development

In the project directory, you can run:

```
yarn start
```

Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.<br/>
The page will reload if you make edits. You will also see any lint errors in the console.
```
yarn build
```
Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes.

```
yarn test
```
Launches the test runner in the interactive watch mode. See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Contribution
If you want to contribute or fix something in this project, feel free to open pull requests.