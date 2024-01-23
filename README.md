<p align="center"><img
  src="logo.svg"
  alt="shopicsv logo" /></p>
 
 <p align="center">
 <img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/ZyriabDsgn/shopicsv">
<img alt="GitHub code size in bytes" src="https://img.shields.io/github/languages/code-size/zyriabdsgn/shopicsv">
<img alt="GitHub" src="https://img.shields.io/github/license/zyriabdsgn/shopicsv">
</p>

An awesome and non-intrusive business-oriented SaaS especially crafted to edit Shopify's CSV files without destroying your shop while maximizing your productivity. 

## Installation

_This guide assumes you have basic knowledge about NPM (also that it's installed) and possess an Auth0 and AWS account._

Automatic CI/CD using GH Actions is not covered in this readme.

First you need to clone this repo, then you can follow along the instructions below 😉

### Buckaroo
You can check [Buckaroo's readme](https://www.github.com/ZyriabDsgn/Buckaroo#readme) in order to set it up.

**Note**: You can also save everything in your browser local storage (check how it's done in the [demo](https://github.com/ZyriabDsgn/ShopiCSV/blob/demo/editor/src/utils/tools/demo/saveFileLocally.utils.ts) and look around to see the difference, or just clone the demo and unlock the upload functionality).

### Auth0

_This is not necessary if you use the demo but note that it won't necessarily get the latest updates and probably won't showcase all features either._

The best place to start is the [Auth0 React SDK Quickstarts](https://auth0.com/docs/quickstart/spa/react/interactive).

*Make sure ShopiCSV and Buckaroo are in the same tenant.*

In the application's settings:
  
  - Make sure "Rotation" is enabled
  - Make sure "Inactivity Expiration" is enabled
 
In "Advanced Settings" ("Application Metadata" tab):

  - Add the following metadata:
    - Key: `tenant`
    - Value: AES encrypted tenant name (i.e.: `shopicsv`)

**Note**: You can also remove the authentication from Buckaroo (it's just an Express middleware you can tweak) as well as in ShopiCSV (a bit more work but if you don't want to bother with auth in your local implementation, that's a solution).

### ShopiCSV

First of, if you want to run the app locally you can run `npm start` in the API's directory and check the debug console for any error, don't forget to create a `.env` file (or remove the "example" from `.env.example`) and put in the following lines:

- `NODE_ENV=development`
- `PORT=3000` <-- Feel free to change this value if this port is already in use.
- `REACT_APP_TENANT=AES_encrypted_tenant_name` (i.e.: encrypt "shopicsv", will be used to determine the bucket's name by Buckaroo)
- `REACT_APP_AUTH0_DOMAIN=your_auth0_domain`
- `REACT_APP_AUTH0_CLIENT_ID=your_auth0_client_ID`
- `REACT_APP_AUTH0_AUDIENCE=buckaroo_auth0_audience`
- `REACT_APP_BUCKAROO_URL=your_buckaroo_lambda_url` (or `localhost:PORT` if running buckaroo locally)
- `BROWSER=none` (optional, will prevent `npm run start` from automatically opening a new tab in your default web browser)

## Usage

Run the command `npm run start` and go to `localhost:3000` (replace `3000` by the value you gave to the environment variable named `PORT`).  
You should arrive on a simple page prompting you to log in, once it is done, you can click on the hamburger menu on the top left and click on "Translations".  
From there, you can use the file explorer and editor freely.

## Contributing

Feel free to send a PR, this is a work in progress and if you spot any error in the code or README, I would appreciate your help 🙂

## License

This software is under the [MIT](https://choosealicense.com/licenses/mit/) license, a short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code. (Do whatever you want with it 🤙).
