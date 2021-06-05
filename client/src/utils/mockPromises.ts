const AVAILABLE_USERNAMES = ["pp", "test", "tc"];
const AVAILABLE_PASSWORDS = ["test", "example", "123"];
const AVAILABLE_EMAILS = ["test@example.com", "a@a.com", "admin@example.com"];

export const mockUserLogInPromise = (username: string, password: string) => {
	return new Promise<{
		message: string;
		token: string;
		// user: User;
	}>((resolve, reject) => {
		setTimeout(() => {
			if (!AVAILABLE_USERNAMES.includes(username)) reject({ message: "credentials are invalid" });
			if (!AVAILABLE_PASSWORDS.includes(password)) reject({ message: "credentials are invalid" });

			// const user: User = {
			// 	_id: "8075a2b8-a678-4831-84bb-6f9fe798e9ff",
			// 	userName: username,
			// 	firstName: "John",
			// 	lastName: "Smith",
			// 	password,
			// };
			resolve({
				message: "success",
				// user,
				token:
					"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI1NjVhZmM2LWViNDctNGRhNS1hZmRkLWUyOWM2MDg4MTRjNCIsImlzQWRtaW4iOmZhbHNlfQ.18gh2mW3g2CWWMdmbLS79Z5-IGCNJo-Z3n6iX3_-vSg",
			});
		}, 2000);
	});
};

export const mockForgotPasswordPromise = (username: string, email: string) => {
	return new Promise<{
		message: string;
	}>((resolve, reject) => {
		setTimeout(() => {
			if (!AVAILABLE_USERNAMES.includes(username)) reject({ message: "credentials are invalid" });
			if (!AVAILABLE_EMAILS.includes(email)) reject({ message: "credentials are invalid" });

			resolve({ message: "success" });
		}, 2000);
	});
};
