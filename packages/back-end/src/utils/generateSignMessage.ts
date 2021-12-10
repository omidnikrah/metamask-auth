const generateSignMessage = (publicAddress: string, nonce: number) => `
  Welcome to MetaMaskAuth!
  
  Click "Sign" to sign in. No password needed!
  This request will not trigger a blockchain transaction or cost any gas fees.
  
  Your authentication status will be reset after 24 hours.
  
  Wallet address:
  ${publicAddress}
  
  Nonce:
  ${nonce}
`;

export default generateSignMessage;
