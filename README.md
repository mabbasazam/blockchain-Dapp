Todo DApp
A decentralized application (DApp) for managing todo tasks on the Ethereum blockchain, built with React, TypeScript, Vite, and Tailwind CSS. This project integrates with Ethereum smart contracts using ethers.js and @usedapp/core, providing a modern development setup with Hot Module Replacement (HMR) and type-aware ESLint rules.
Features

Create, view, and complete todo tasks stored on the Ethereum blockchain.
Connect to Ethereum wallets (e.g., MetaMask) for secure interactions.
Type-safe development with TypeScript and ESLint.
Responsive UI styled with Tailwind CSS.
Fast development experience with Vite’s HMR.

Prerequisites

Node.js (v18 or later recommended)
pnpm or npm
MetaMask browser extension
An Ethereum network (e.g., Hardhat, Ganache, or Sepolia testnet)

Installation

Clone the repository:
git clone https://github.com/your-username/todo-dapp.git
cd todo-dapp


Install dependencies:
pnpm install
# or
npm install


Start the development server:
pnpm dev
# or
npm run dev

The app will be available at http://localhost:5173.


Available Scripts

pnpm dev or npm run dev: Runs the development server with HMR.
pnpm build or npm run build: Compiles TypeScript and builds the production bundle.
pnpm lint or npm run lint: Runs ESLint to check code quality.
pnpm preview or npm run preview: Previews the production build locally.

Project Setup
This project uses Vite for fast builds and development, with the following plugins:

@vitejs/plugin-react: Enables Fast Refresh using Babel.
@tailwindcss/vite: Integrates Tailwind CSS for styling.

ESLint Configuration
To enable type-aware linting, update eslint.config.js as follows:
import tseslint from 'typescript-eslint';
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ],
  plugins: {
    'react-x': reactX,
    'react-dom': reactDom,
  },
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
});

Dependencies

react, react-dom (^19.1.0): For building the user interface.
ethers (^5.8.0): For Ethereum blockchain interactions.
@usedapp/core (^1.2.16): Simplifies smart contract interactions.
tailwindcss (^4.1.7): For utility-first CSS styling.

Dev Dependencies

typescript (~5.8.3): For type-safe development.
vite (^6.3.5): For fast builds and HMR.
eslint (^9.25.0): For linting with React and TypeScript rules.
@vitejs/plugin-react (^4.4.1): For React Fast Refresh.

Smart Contract Integration
This DApp is designed to interact with an Ethereum smart contract (e.g., a Voting or Todo contract). To connect to a smart contract:

Deploy your contract using tools like Remix or Hardhat.
Update your React components with the contract address and ABI:import { useContractFunction, useEthers } from '@usedapp/core';
import { Contract } from 'ethers';
import TodoABI from './Todo.json'; // Your contract ABI

const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const contract = new Contract(contractAddress, TodoABI);


Use @usedapp/core hooks to call contract functions, such as adding or completing todos.

Example Smart Contract
For practice, you can use a simple smart contract like the one below (deployed separately):
pragma solidity ^0.8.0;

contract Todo {
    struct Task {
        string description;
        bool completed;
    }
    mapping(uint => Task) public tasks;
    uint public taskCount;

    function addTask(string memory _description) public {
        tasks[taskCount] = Task(_description, false);
        taskCount++;
    }

    function completeTask(uint _taskId) public {
        require(_taskId < taskCount, "Task does not exist");
        tasks[_taskId].completed = true;
    }
}

Extending the Project

Add task categories or deadlines to the smart contract.
Implement wallet-based user authentication.
Enhance the UI with Tailwind CSS components.
Add error handling for failed blockchain transactions.

Troubleshooting

MetaMask connection issues: Ensure MetaMask is installed and connected to the correct network.
TypeScript errors: Check tsconfig.json for correct paths and settings.
Linting errors: Run pnpm lint to identify and fix issues.
Contract interaction fails: Verify the contract address and ABI are correct.

For more information, visit:

Vite Documentation
ethers.js Documentation
@usedapp/core Documentation

