import axios, { AxiosInstance } from 'axios';

const AxiosCancelToken = axios.CancelToken;

class Request {
	private token: string | null;

	private axiosInstance: AxiosInstance;

	private cancellation: any;

	private onCancel: (config: any) => void;

	constructor() {
		this.token = null;
		this.axiosInstance = axios.create();

		this.axiosInstance.interceptors.response.use(
			(response) => response,
			(error) => {
				if (error.message === 'CANCELED') {
					this.onCancel(this.cancellation.config);
				} else this.handleErrors(error);
				return Promise.reject(error);
			},
		);
	}

	setToken = (token) => {
		this.token = token;
	};

	removeToken = () => {
		this.token = null;
	};

	get = (url, data = {}) => {
		const apiUrl = this.getApiUrl(url);
		return this.requestAxios('GET', apiUrl, data);
	};

	post = (url, data = {}) => {
		const apiUrl = this.getApiUrl(url);
		return this.requestAxios('POST', apiUrl, data);
	};

	cancel = (onCancel) => {
		this.cancellation.cancel('CANCELED');
		if (onCancel) this.onCancel = onCancel;
	};

	private requestAxios = (method, url, data) =>
		this.axiosInstance({
			url,
			method,
			headers: this.getHeaders(),
			[method === 'POST' ? 'data' : 'params']: data,
			cancelToken: new AxiosCancelToken((cancel) => {
				this.cancellation = {
					cancel,
					config: { url, method, data },
				};
			}),
		});

	private getHeaders = () => ({
		'Content-Type': 'application/json; charset=utf-8',
		...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
	});

	private getApiUrl = (url) => `${process.env.API_BASE}${url}`;

	private handleErrors = (error: any) => {
		switch (error.response.status) {
			case 500:
				throw new Error('500 error');
			case 429:
				throw new Error('429 error');
			case 401:
				document.dispatchEvent(new CustomEvent('logout'));
				break;
			default:
				break;
		}
		return false;
	};
}

export default new Request();
