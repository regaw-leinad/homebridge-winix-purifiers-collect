import axios from 'axios';
import inquirer from 'inquirer';

interface DeviceInfo {
    apiNo: string;
    apiGroup: string;
    deviceGroup: string;
    modelId: string;
}

interface DeviceAttributes {
    [key: string]: string | number;
}

interface RecordedAction {
    action: string;
    state: DeviceAttributes;
}

async function getDeviceInfo(deviceId: string): Promise<DeviceInfo> {
    try {
        const response = await axios.get(
            `https://us.api.winix-iot.com/common/event/sttus/devices/${deviceId}`
        );
        const { apiNo, apiGroup, deviceGroup, modelId } = response.data.body.data[0];
        return { apiNo, apiGroup, deviceGroup, modelId };
    } catch (error) {
        console.error('Failed to fetch device state', error);
        process.exit(1);
    }
}

async function getDeviceState(deviceId: string): Promise<DeviceAttributes> {
    try {
        const response = await axios.get(
            `https://us.api.winix-iot.com/common/event/sttus/devices/${deviceId}`
        );
        const attributes = response.data.body.data[0].attributes;
        return { ...attributes };
    } catch (error) {
        console.error('Failed to fetch device state', error);
        process.exit(1);
    }
}

async function recordAction(deviceId: string, action: string): Promise<RecordedAction> {
    await inquirer.prompt([
        {
            type: 'input',
            name: 'confirmation',
            message: `Please perform the action: "${action}" - then press Enter to continue.`,
        },
    ]);

    const state = await getDeviceState(deviceId);
    return { action, state };
}

async function main() {
    if (process.argv.length < 3) {
        console.error('Usage: ');
        console.error('       npm run new-purifier-collect <deviceId>');
        console.error();
        process.exit(1);
    }

    const deviceId = process.argv[2];
    const actions: RecordedAction[] = [];

    console.log('To start, please turn off the device and then turn it back on to ensure it is in its default state.');

    await inquirer.prompt([
        {
            type: 'input',
            name: 'confirmation',
            message: 'Press Enter when you have completed this step.',
        },
    ]);

    const orderedActions = [
        'Power Off',
        'Power On',
        'Turn On Sleep Mode',
        'Turn Off Sleep Mode',
        'Turn Off Plasmawave',
        'Turn On Plasmawave',
        'Press Auto Mode to Turn it Off',
        'Press Auto Mode to Turn it On',
        'Press Fan Speed Low',
        'Press Fan Speed Medium',
        'Press Fan Speed High',
        'Press Fan Speed Turbo',
        'Brighten Room to Highest Light Level (and wait 3 minutes)',
        'Darken Room to Lowest Light Level (and wait 3 minutes)',
        'Change the Air Quality, if possible (and wait 3 minutes)',
    ];

    console.log('Recording initial device state...');

    actions.push({
        action: 'Initial Device State',
        state: await getDeviceState(deviceId),
    });

    console.log();


    for (const action of orderedActions) {
        const { proceed } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'proceed',
                message: `Do you want to perform the action: "${action}"?`,
                default: true,
            },
        ]);

        if (!proceed) {
            continue;
        }

        const recordedAction = await recordAction(deviceId, action);
        actions.push(recordedAction);
    }

    // custom actions
    while (true) {
        const { performCustom } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'performCustom',
                message: 'Do you want to perform a custom action and have it recorded?',
                default: false,
            },
        ]);

        if (!performCustom) {
            break;
        }

        const { customAction } = await inquirer.prompt([
            {
                type: 'input',
                name: 'customAction',
                message: 'Enter the name of your custom action:',
            },
        ]);

        const recordedAction = await recordAction(deviceId, customAction);
        actions.push(recordedAction);
    }

    const info = await getDeviceInfo(deviceId);

    console.log();
    console.log('Thank you for your help and contribution to homebridge-winix-purifiers!');
    console.log('Send this payload to the developer:');
    console.log();
    console.log(JSON.stringify({ info, actions }));
}

process.on('uncaughtException', (error: Error) => {
    if (error.name === 'ExitPromptError') {
        console.log('Device state collection cancelled.');
    } else {
        // Rethrow unknown errors
        throw error;
    }
});

main();
