# Navotar Redesign with RSuiteJS

My personal design preference of the Navotar platform using React and the RSuiteJS library for the styles and components.

## API Reference

Get the full API Documentation at https://api.appnavotar.com/docs

#### Obtaining the Auth Token

```http
  POST https://auth.appnavotar.com/connect/token

  Content-Type: application/x-www-form-urlencoded

  Request Body:
    grant_type = client_credentials
    client_id = [YOUR CLIENT ID]
    client_secret = [YOUR CLIENT SECRET]
    scope = Api
```

The above authentication is already handled by the TypeScript-NodeJS server.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env files in both the `project/client` and `project/server` directories.

#### Client Environment Variables

In the `project/client` directory, you will need to set up the following environment variables.

You can find a template for this in the `project/client/.env.example` file.

`REACT_APP_SERVER_URL`

`REACT_APP_BASE_URL`

#### Server Environment Variables

In the `project/server` directory, you will need to set up the following environment variables.

You can find a template for this in the `project/server/.env.example` file.

`PORT`

`NODE_ENV`

`JWT_SECRET`

`AUTH_URL`

`BASE_URL`

`JSON_SERVER_URL`

You will also need to configure the `db.json` file in the root of the project.

```json
{
	"users": [
		{
			"id": "",
			"username": "",
			"password": "",
			"email": "",
			"nav_client_id": "",
			"api_client_id": "",
			"api_client_secret": ""
		}
	]
}
```

## Run Locally

Clone the project

```bash
  git clone https://github.com/SeanCassiere/nv-v3-redesign.git my-project
```

Go to the project directory

```bash
  cd my-project
```

Install base development dependancies

```bash
  npm install

```

Install TypeScript-NodeJS server dependancies

```bash
  cd server
  npm install
  cd ../
```

Install React client dependancies

```bash
  cd client
  npm install
  cd ../
```

Run the project

```bash
  npm run dev
```
