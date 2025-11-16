# Public Sale launcher Platform

## 🌟 Project Overview

A cutting-edge Polkadot ecosystem presale platform that provides a seamless token purchase experience across multiple blockchain networks. Features include real-time price feeds, multi-wallet support, and intelligent referral systems.

## 🚀 Key Features

- Multi-Chain Support: Deploy across Ethereum, BSC, Polygon, Moonbeam, other Parachains + testnets
- Real-Time Price Feeds: Chainlink oracle integration for accurate USD conversions
- Multi-Wallet Integration: MetaMask, WalletConnect, TronLink, Solana wallets
- Smart Referral System: Automated on-chain reward allocation
- Cross-Chain Aggregation: Unified token balance display across all networks
- Professional UI/UX: Responsive design with dark/light themes

## 🏗 Architecture

### Frontend Stack
- Next.js 15 + React 19 + TypeScript
- Tailwind CSS v4 for styling
- Wagmi v2 + Viem for Web3 integration
- TanStack Query for state management

### Smart Contracts
- Multi-chain presale contracts
- Chainlink price feed integration
- Referral reward system
- ERC-20 token distribution

### Supported Networks
- Ethereum Mainnet & Sepolia
- BSC Mainnet & Testnet
- Polygon Mainnet & Amoy
- Moonbeam Mainnet & Alpha

## 🚦 Quick Start

### Prerequisites
Node.js 16+
Yarn package manager
Web3 wallet (Talisman, Novawallet, MetaMask, TronLink, etc.)
### Installation
### Development
# Start development server
yarn dev

# Build for production
yarn build

# Production deployment
yarn prod:deploy

## 🎯 Core Workflow

1. User Connection: Connect wallet across supported networks
2. Network Selection: Choose deployment network or auto-switch
3. Purchase Flow: Buy tokens with native currency or stablecoins
4. Referral System: Enter referral codes for rewards
5. Balance Tracking: View aggregated tokens across all chains
6. Price Updates: Real-time USD pricing via Chainlink oracles

## 🧪 Testing

# Smart contract testing
yarn test:purchase
yarn test:purchase-simple

# Manual test scenarios
- Multi-chain purchases
- Network switching
- Referral validation
- Error handling
## 📊 Key Innovations

- Cross-Chain Aggregation: Unified interface for multiple networks
- Intelligent Network Management: Automatic switching and optimization
- Oracle Integration: Real-time price feeds for accurate conversions
- Advanced Error Handling: User-friendly transaction management

## 🔮 Future Enhancements

- Layer 2 Integration (Arbitrum, Optimism)
- NFT Reward Systems
- Advanced Analytics Dashboard
- Mobile App Development
- DeFi Integration

## 📄 License

MIT License

---
