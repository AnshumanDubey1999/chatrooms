# Chatrooms <img alt="gitleaks badge" src="https://img.shields.io/badge/protected%20by-gitleaks-blue">

Welcome to the Chatrooms project! This repository contains the source code for a simple chat application (for now).

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/chatrooms.git
   ```
2. Navigate to the project directory:
   ```bash
   cd chatrooms
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Setup a variables.sh file to store all env variables:
   ```bash
   export MONGO_DB_URI='XX'
    export DB_NAME='XX'
    export JWT_SECRET='XX'
    export PORT=3000
   ```
2. Start the development server:
   ```bash
   npm start
   ```
3. Try the below curl to register
   ```bash
   curl --request POST \
        --url http://localhost:3000/register \
        --header 'Content-Type: application/json' \
        --data '{
            "name": "Name"
        }'
   ```
4. Try the below curl to create room with token from above curl
   ```bash
   curl --request POST \
        --url http://localhost:3000/rooms \
        --header 'Authorization: Bearer XX' \
        --header 'Content-Type: application/json' \
        --data '{
            "roomType": "TTT"
        }'
   ```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For questions or feedback, please contact [anshumandubey@proton.me].
