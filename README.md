# King of The Fools (KoTF) Frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Instructions

### Requirements
- Metamask extension
- BlockScout explorer
- Local Ganache instance
- KoTF smart contracts deployed to running ganache

### BlockScout explorer

```bash
# Clone BlockScout repo
git clone https://github.com/blockscout/blockscout.git
# Start Blokscout container at http://localhost:4000
docker-compose -f ./blockscout/docker-compose/docker-compose-no-build-ganache.yml up -d
```
### Clone the KoTF smart contracts repo and install

```bash
git clone https://github.com/CosmicDNA/king-of-the-fools
cd king-of-the-fools
yarn
```

### Start Ganache

Select an arbiray network id (it defaults to `1337` for Ganache) and start Ganache with the network id parameter. In this example I am using the network id of number `1234567`.

```bash
yarn ganache:start --networkId 1234567
```

### Set mnemonic environment variable

From the terminal copy the mnemonic from the output of the previous command and paste to a `.env` or `.envrc` file. Make sure the `MNEMONIC` environment variable is loading appropriately.

### Metamask setup
 Befre importing in Metamask the Ganache mnemonic, make sure to backup your keys just in case. Then you can safely import the mnemonic to Metamask.

 Additionally configure the network as follows:

Parameter | Value
------ | ------
Network name | Ganache
New RPC URL | http://localhost:8545
Chain ID | 1234567
Currency symbol | ETH
Block explorer URL   | http://localhost:4000/

In this example I am using the network id of number `1234567`, adjust with your selected network id accordingly.

### Deploy KoTF contract

Run the following command to deploy
```bash
yarn deploy ganache
```

### Paste Deployment Artifact KinOfTheFools.json
Within the folder `deployments`, a new folder `ganache` was just created with the files `.chainId` and `KingOfTheFools.json`.

Exit the folder and clone this repo.
```bash
cd ..
git clone https://github.com/CosmicDNA/kotf-frontend
# paste KingOfTheFools.json to contract folder of this repo
cp ./king-of-the-fools/deployments/ganache/KingOfTheFools.json ./kotf-frontend/src/contract
# Enter the frontend folder
cd ./kotf-frontend
```

### Create a .env.local file
Based on the file `.env.local.sample` create a `.env.local` file adjusting accordingly to your selected network id.

### Verify KoTF contract

From the `king-of-the-fools` root folder run the following command to flatten the contract files into a monolithic file:

```bash
yarn flatten KingOfTheFools
```

This command creates a file called `FlatKingOfTheFools.sol` at the root of the project. Remove unecessary lines from the flattened file to make sure the verification at BlockScout succeeds. A good strategy here is to leave a single pragma line and a single SPDX line as well.

In your browser navigate to https://localhost:4000/ then search for the addresss of the contract present in the file `KingOfTheFools.json`. Once the contract tab opens, click on Verify tab, insert the flatenned contract source code and adjust the settings accordingly to the compilation switches used to compile KoTF smart contracts.

### Run the frontend

```bash
# Install node dependencies
yarn
# Start the development server at http://localhost:3000
yarn start
```

With Metamask, at this stage you should be able to interact with the application running on a local private network and with BlockScout explorer. If you click on View on block explorer, Metamask should open the transaction in BlockScout.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

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

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
