# Navotar and RENTALL Clone

![GitHub open issues](https://img.shields.io/github/issues/SeanCassiere/nv-rental-clone)
![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/SeanCassiere/nv-rental-clone)
![GitHub contributors](https://img.shields.io/github/contributors/SeanCassiere/nv-rental-clone)
![GitHub stars](https://img.shields.io/github/stars/SeanCassiere/nv-rental-clone?style=social)
![GitHub forks](https://img.shields.io/github/forks/SeanCassiere/nv-rental-clone?style=social)

A recreation of the Car Rental Management platforms [Navotar](https://navotar.com) and [RENTALL](https://rentallsoftware.com) for educational purposes.

**⚠️ Important: This project is solely an exercise in education and is not intended for commercial purposes. It does not use production data.**

![nv-rental-clone - dashboard](https://github.com/SeanCassiere/nv-rental-clone/assets/33615041/d8463614-1e3a-4ec7-8884-bfc78dfddc83)

This project is written in Typescript, using React for the UI library, and Tailwindcss for styling. UI components from [ui.shadcn.com](https://ui.shadcn.com) are integrated throughout the web app. The web app employs OAuth2 OIDC authentication, Tanstack Router for routing, and Tanstack Query for server-state management.

## Table of Contents

- [Navotar and RENTALL Clone](#navotar-and-rentall-clone)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [Authors](#authors)
  - [License](#license)

## Installation

1. Clone the repository: `git clone https://github.com/SeanCassiere/nv-rental-clone.git`
2. Navigate to the project directory: `cd nv-rental-clone`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

## Usage

1. Copy the `.env.example` file and rename it as `.env`.

2. Obtain a valid ClientID from the OAuth2 authority ([https://testauth.appnavotar.com](https://testauth.appnavotar.com)). Ensure that the correct `allowed_origin`, `redirect_uri`, and `post_logout_redirect_uri` are set to the values in the `.env` file.

3. Set the correct API URL in the `.env` file.

## Contributing

Contributions are always welcome!

If you'd like to contribute to this project, please follow these guidelines:

1. Fork the project.
2. Create your feature branch (`git checkout -b Username/YourFeature`).
3. Commit your changes using the [Conventional Commits standard](https://www.conventionalcommits.org/). Please ensure meaningful and well-formatted commit messages.

   - If you are using VSCode, you can install the [Conventional Commits extension](https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits) to help you with this.
   - An example of a commit message: `feat: add a new feature`

4. Push to the branch (`git push origin Username/YourFeature`).
5. Open a pull request with a title following the Conventional Commits standard.

Please follow the [CODE OF CONDUCT](CODE_OF_CONDUCT.md).

## Authors

- [@SeanCassiere](https://www.github.com/SeanCassiere)

## License

This project is licensed under the [MIT License](LICENSE).
