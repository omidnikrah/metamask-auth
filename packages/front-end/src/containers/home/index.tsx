import React, { useEffect, useState } from 'react';
// eslint-disable-next-line import/extensions
import Web3 from 'web3/dist/web3.min.js';
import useRequest from '@hooks/useRequest';
import HomeWrapper from './styles';

const Home: React.FC = () => {
	const [isWeb3Initialized, setIsWeb3Initialized] = useState(false);
	const [publicAddress, setPublicAddress] = useState(null);
	const [signature, setSignature] = useState(null);
	const [isLogin, setIsLogin] = useState(false);
	const {
		requestCall: getSignMessage,
		isLoading: getSignMessageLoading,
		data: signMessageData,
	} = useRequest();
	const {
		requestCall: loginUser,
		isLoading: loginLoading,
		data: loginData,
	} = useRequest();

	useEffect(() => {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			setIsWeb3Initialized(true);
		}
	}, []);

	useEffect(() => {
		if (publicAddress) {
			getSignMessage({
				url: '/account/getSignMessage',
				method: 'post',
				reqData: {
					publicAddress,
				},
			});
		}
	}, [publicAddress]);

	useEffect(() => {
		if (signMessageData) {
			window.web3.eth.personal
				.sign(signMessageData?.data?.signMessage, publicAddress)
				.then((data) => {
					setSignature(data);
				});
		}
	}, [signMessageData]);

	useEffect(() => {
		if (signature) {
			loginUser({
				url: '/account/auth',
				method: 'post',
				reqData: {
					publicAddress,
					signature,
				},
			});
		}
	}, [signature]);

	useEffect(() => {
		if (loginData?.data?.token) {
			setIsLogin(true);
		}
	}, [loginData]);

	const handleLogin = () => {
		if (isWeb3Initialized) {
			window.ethereum.enable().then((data) => {
				if (data[0]) {
					setPublicAddress(data[0]);
				}
			});
		}
	};

	return (
		<HomeWrapper>
			{isLogin ? (
				<span id='login-message'>You have been logged in</span>
			) : (
				<button id='login-btn' type='button' onClick={handleLogin}>
					Login with MetaMask
				</button>
			)}
		</HomeWrapper>
	);
};

export default Home;
