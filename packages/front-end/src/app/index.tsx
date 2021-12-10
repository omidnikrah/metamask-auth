import React from 'react';
import ReactDom from 'react-dom';
import App from './app';

ReactDom.render(
	<React.Suspense fallback={<span>Loading...</span>}>
		<App />
	</React.Suspense>,
	document.getElementById('app'),
);
