# Homebridge Winix Purifiers Data Collection Tool

This project helps collect data to support more models of Winix purifiers for
the [homebridge-winix-purifiers](https\://github.com/regaw-leinad/homebridge-winix-purifiers) Homebridge plugin. Follow
the steps below to clone, set up, and run the tool to contribute data.

## How It Works

- **Step 1**: The script will prompt you to power off and then power on your device to ensure it is in its default
  state.
- **Step 2**: Follow each prompt to perform specific actions in the Winix app for the purifier, then hit Enter to record
  the state after each action. You can also skip any action if it is not applicable.
- **Step 3**: You can add custom actions if needed to ensure all functionalities are covered.
- **Step 4**: At the end, the tool will provide a JSON payload with all recorded data.
- **Step 5**: Create a new issue in this repository and attach the JSON payload from the script. This will help me
  manage new data contributions effectively.

## Prerequisites

- Node.js (version 14 or higher recommended)
- npm or Yarn package manager

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/regaw-leinad/homebridge-winix-purifiers-collector.git
cd homebridge-winix-purifiers-collector
```

### 2. Install Dependencies

Install the required dependencies for the project.

#### Using npm:

```sh
npm install
```

#### Using Yarn:

```sh
yarn
```

### 3. Run the Data Collection Script

To run the data collection script, use the following command with your device ID:

#### Using npm:

```sh
npm run collect <deviceId>
```

#### Using Yarn:

```sh
yarn collect <deviceId>
```

> **Note**: You will need to provide the `deviceId` as an argument to the command.

### 4. Getting Your Device ID

**[Placeholder for instructions on how to get the Device ID]**

### 5. Create a New Issue

Create a new issue HERE and fill in the template with all the required information.

---

Thank you for your contribution!

