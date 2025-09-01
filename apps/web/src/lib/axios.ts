import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_HTTP_BACKEND_URL!}/api/v1`,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

const refreshAccessToken = async () => {
	try {
		await axios.post(
			`${process.env.NEXT_PUBLIC_HTTP_BACKEND_URL!}/api/v1/auth/refresh`,
			{},
			{
				withCredentials: true,
			}
		);

		return true;
	} catch (error) {
		return null;
	}
};

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			const newAccessToken = await refreshAccessToken();

			if (!newAccessToken) return Promise.reject(error);

			if (newAccessToken) {
				return axiosInstance(originalRequest, {
					withCredentials: true,
				});
			}
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;
