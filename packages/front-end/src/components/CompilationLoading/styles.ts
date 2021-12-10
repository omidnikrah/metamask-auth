import styled, { keyframes } from 'styled-components';

const rotateAnimation = keyframes`
  100% {
    transform: rotate(360deg);  
  }
`;

export default styled.div`
	position: fixed;
	bottom: 20px;
	left: 20px;
	width: 50px;
	height: 50px;
	border-radius: 10rem;
	z-index: 100;
	background: black;
	display: flex;
	align-items: center;
	justify-content: center;
	svg {
		width: 30px;
		height: 30px;
		margin: 0;
		padding: 0;
		transform-origin: center;
		animation: ${rotateAnimation} 1s ease infinite;
		fill: #fff;
	}
`;
