# Next of Kin Smart Contract

The Next of Kin smart contract is built on the Stacks blockchain using the Clarity language. This contract allows users to deposit their STX tokens and assign recipients who will receive the tokens in the event of user inactivity for a specified period. 

## Key Features

1. **STX Deposits**: Users can deposit their STX tokens into the smart contract securely. The deposited tokens are locked within the contract until they are either claimed by the user or distributed to the recipients.
2. **Assign Recipients**: Users can assign up to 10 recipients, specifying the amount of STX each recipient should receive in the event of inactivity. This ensures that the user's assets are distributed according to their wishes.
3. **Inactivity Detection**: The smart contract utilizes chainhooks to detect user inactivity for a period of one year. Chainhooks are a powerful functionality that target events on the Bitcoin and Stacks blockchains that are crucial to your use case, allowing actions to be triggered based on these events. [Learn more about chainhooks](https://docs.hiro.so/stacks/chainhook/installation).
4. **Automatic Transfers**: Once the inactivity period of one year elapses, the smart contract automatically sends the specified amounts of STX to the assigned recipients. This ensures that the user's assets are managed and transferred without requiring manual intervention.
5. **Future Feature - STX Staking**: In future updates, a feature will be added that allows users to stake their STX in pools. This will enable users to earn staking rewards on their deposited STX while maintaining the core functionality of the Next of Kin smart contract.

## How It Works

1. **Deposit STX**: Users deposit their STX tokens into the smart contract by calling the `deposit-stx` function and specifying the amount to deposit.
2. **Assign Recipients**: Users can assign up to 10 recipients by calling the `assign-recipients` function and providing the recipient addresses and corresponding amounts. The smart contract stores this information securely.
3. **Inactivity Monitoring**: The smart contract continuously monitors user activity. If no activity is detected for a period of one year, it triggers the chainhook event.
4. **Trigger Action**: Upon detecting inactivity, the chainhook triggers the smart contract to execute the `distribute-stx` function, which transfers the specified amounts of STX to the assigned recipients.
5. **Future Staking**: In upcoming updates, users will be able to call the `stake-stx` function to stake their deposited STX in pools, earning rewards while ensuring their assets are managed appropriately.

## Installation and Usage

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/next-of-kin-smart-contract.git
    cd next-of-kin-smart-contract
    ```

2. **Deploy the Smart Contract**:
    - Use the Stacks CLI or your preferred method to deploy the smart contract on the Stacks blockchain.
    - Ensure you have sufficient STX for deployment and transaction fees.

3. **Deposit STX and Assign Recipients**:
    - Call the `deposit` function to deposit your STX tokens.
    - Call the `set-designated-recipient` function to specify up to 10 recipients and their respective amounts.

4. **Monitor Activity**:
    - The smart contract will automatically monitor your wallet activity.
    - If no activity is detected for one year, the contract will trigger the distribution of STX to your assigned recipients.

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