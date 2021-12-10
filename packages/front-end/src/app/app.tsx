import React from 'react';
import CompilationLoading from '@components/CompilationLoading';
import Home from '@containers/home';
import GlobalStyles from '@utils/globalStyle';

const isDev = process.env.NODE_ENV === 'development';

const App: React.FC = () => (
	<>
		{isDev && <CompilationLoading />}
		<Home />
		<GlobalStyles />
	</>
);

export default App;
