import { useRef, useState } from 'react';
import request from '@utils/request';

interface requestCallConfigs {
	url: string;
	method?: 'get' | 'post' | 'put' | 'delete';
	reqData?: any;
}

interface useRequestInterface {
	isLoading: boolean;
	data: any;
	error: any;
	requestCall: (configs: requestCallConfigs) => void;
	cancelCall: (onCancel?: (config) => void) => void;
}

const useRequest = (): useRequestInterface => {
	const [isLoading, setIsLoading] = useState(false);
	const data = useRef();
	const error = useRef();

	const setData = (requestData) => {
		data.current = requestData;
	};

	const setError = (reqError) => {
		error.current = reqError;
	};

	const cancelCall = request.cancel;

	const requestCall = async ({
		url,
		method = 'get',
		reqData,
	}: requestCallConfigs) => {
		setIsLoading(true);
		setData(null);
		setError(null);
		try {
			const { data: resData } = await request[method](url, reqData);
			setData(resData);
		} catch (err) {
			setError(err?.response?.data);
		}
		setIsLoading(false);
	};

	return {
		isLoading,
		data: data.current,
		error: error.current,
		requestCall,
		cancelCall,
	};
};

export default useRequest;
