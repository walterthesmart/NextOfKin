# Next of Kin Smart Contract

The Next of Kin smart contract is built on the Stacks blockchain using the Clarity language. This contract allows users to deposit their STX tokens and assign recipients who will receive the tokens in the event of user inactivity for a specified period. 

## Key Features

1. **STX Deposits**: Users can deposit their STX tokens into the smart contract securely. The deposited tokens are locked within the contract until they are either claimed by the user or distributed to the recipients.
2. **Assign Recipients**: Users can assign up to 10 recipients, specifying the amount of STX each recipient should receive in the event of inactivity. This ensures that the user's assets are distributed according to their wishes.
3. **Inactivity Detection**: The smart contract utilizes chainhooks to detect user inactivity for a period of one year. Chainhooks are a powerful functionality that target events on the Bitcoin and Stacks blockchains that are crucial to your use case, allowing actions to be triggered based on these events. [Learn more about chainhooks](https://docs.hiro.so/stacks/chainhook/installation).
4. **Automatic Transfers**: Once the inactivity period of one year elapses, the smart contract automatically sends the specified amounts of STX to the assigned recipients. This ensures that the user's assets are managed and transferred without requiring manual intervention.
5. **Future Feature - STX Staking**: In future updates, a feature will be added that allows users to stake their STX in pools. This will enable users to earn staking rewards on their deposited STX while maintaining the core functionality of the Next of Kin smart contract.

## How It Works

1. **Deposit STX**: Users deposit their STX tokens into the smart contract by calling the `deposit` function and specifying the amount to deposit.
2. **Assign Recipients**: Users can assign up to 10 recipients by calling the `assign-recipients` function and providing the recipient addresses and corresponding amounts. The smart contract stores this information securely.
3. **Inactivity Monitoring**: The smart contract continuously monitors user activity. If no activity is detected for a period of one year (52,560 blocks), it triggers the distribution process.
4. **Trigger Action**: Upon detecting inactivity, the smart contract can execute the `check-and-distribute` function, which transfers the specified amounts of STX to the assigned recipients.
5. **Withdraw Funds**: Users can withdraw their deposited STX at any time by calling the `withdraw` function, as long as they have sufficient balance.

## Installation and Usage

### Prerequisites
- Node.js (v16 or higher)
- Clarinet CLI
- Stacks Wallet

### Setup

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/walterthesmart/NextOfKin.git
    cd NextOfKin
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    cd "NextOfkin UI"
    npm install
    ```

3. **Run Tests**:
    ```bash
    npm test
    ```

4. **Deploy the Smart Contract**:
    ```bash
    clarinet deployments apply -p deployments/default.testnet-plan.yaml
    ```

### Smart Contract Functions

#### Public Functions
- `deposit(amount: uint)` - Deposit STX tokens into the contract
- `withdraw(amount: uint)` - Withdraw STX tokens from your balance
- `assign-recipients(recipients: list)` - Set up to 10 recipients for inheritance
- `check-and-distribute(user: principal)` - Check inactivity and distribute funds if applicable

#### Read-Only Functions
- `get-balance(user: principal)` - Get user's deposited balance
- `get-recipients(user: principal)` - Get user's assigned recipients
- `get-last-activity(user: principal)` - Get user's last activity timestamp

### Frontend Application

1. **Start the UI**:
    ```bash
    cd "NextOfkin UI"
    npm run dev
    ```

2. **Connect Your Wallet**:
    - Open the application in your browser
    - Connect your Stacks wallet
    - Start depositing and managing your inheritance settings

## Contributing

We welcome contributions! If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License.
## Acknowledgements

- [Stacks Blockchain](https://stacks.co/) for providing the blockchain infrastructure.
- [Clarity Language](https://clarity-lang.org/) for the smart contract language.
- [Chainhook Documentation](https://docs.hiro.so/stacks/chainhook/installation) for the detailed information on using chainhooks.