# Changelog

All notable changes to the NextOfKin project will be documented in this file.

## [1.1.0] - 2025-06-18

### Added
- **Smart Contract Improvements**
  - Added missing `max-recipients` and `inactivity-period` read-only functions to storage contract
  - Added `withdraw` function to allow users to withdraw their deposited STX
  - Added proper error handling and validation throughout contracts
  - Fixed distribution logic to properly handle recipient allocation

- **UI Enhancements**
  - Created comprehensive UI component library with all necessary components
  - Added proper import path aliases (@/) support in Vite configuration
  - Implemented modern, responsive design with Tailwind CSS
  - Added framer-motion animations for enhanced user experience
  - Created modular component structure for better maintainability

- **Testing Infrastructure**
  - Implemented comprehensive test suite for all smart contracts
  - Added tests for storage, core, and main contract functionality
  - Ensured all contracts compile and deploy successfully
  - Added proper test configuration with Clarinet SDK

- **Documentation**
  - Updated README with accurate function names and usage instructions
  - Added comprehensive installation and setup guide
  - Documented all public and read-only contract functions
  - Added frontend application setup instructions
  - Created detailed contributing guidelines

### Fixed
- **Contract Issues**
  - Fixed typo in filename: `distrubution.clar` → `distribution.clar`
  - Corrected function calls in core contract to use proper storage functions
  - Fixed deposit logic to properly accumulate balances instead of overwriting
  - Updated Clarinet.toml to reference correct contract filenames
  - Fixed distribution logic to properly iterate through recipients

- **UI Issues**
  - Resolved missing UI component imports
  - Fixed import path resolution with proper Vite configuration
  - Added all required UI components (Card, Button, Dialog, etc.)
  - Ensured successful build process for production deployment

- **Documentation Issues**
  - Corrected function names in README to match actual implementation
  - Updated repository URL and installation instructions
  - Fixed inconsistencies between documented and actual contract functions

### Changed
- **Contract Architecture**
  - Improved separation of concerns between contracts
  - Enhanced error handling with specific error codes
  - Updated trait definitions to include new functions
  - Improved contract deployment configuration

- **Development Workflow**
  - Updated test configuration for better reliability
  - Improved build process for both contracts and UI
  - Enhanced development environment setup

### Technical Details
- **Contracts**: 5 smart contracts (main, core, storage, distribution, nok-trait)
- **Tests**: 14 passing tests across all contract functionality
- **UI Components**: 10+ reusable UI components with proper TypeScript support
- **Build System**: Vite with React, Tailwind CSS, and proper path resolution

### Dependencies
- Updated to latest compatible versions of Clarinet SDK
- Added framer-motion for animations
- Added lucide-react for icons
- Maintained compatibility with Stacks blockchain ecosystem

### Security
- Addressed development dependency vulnerabilities where possible
- Implemented proper authorization checks in smart contracts
- Added input validation and error handling throughout the system

---

## Previous Versions

### [1.0.0] - Initial Release
- Basic smart contract structure
- Initial UI implementation
- Core inheritance functionality
