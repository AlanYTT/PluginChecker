import inquirer from 'inquirer';
import fetch from 'node-fetch';
import chalk from 'chalk';
import { clear } from 'console';

const getServerStatus = async (serverIP, serverPort) => {
    try {
        const response = await fetch(atob('aHR0cHM6Ly9hcGkubWNzcnZzdGF0LnVzLzIv') + `${serverIP}:${serverPort}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al obtener el estado del servidor');
        }

        return data;
    } catch (error) {
        throw new Error(`Error de conexión: ${error.message}`);
    }
};

const showPluginsAndPlayers = async () => {
    clear();
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'serverIP',
            message: 'Ingresa la dirección IP o el nombre de dominio del servidor:',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Por favor, ingresa una dirección IP o nombre de dominio.';
                }
            }
        },
        {
            type: 'input',
            name: 'serverPort',
            message: 'Ingresa el puerto del servidor:',
            default: 19132,
            validate: function (value) {
                const valid = !isNaN(parseFloat(value)) && isFinite(value);
                return valid || 'Por favor, ingresa un puerto válido.';
            },
            filter: Number
        }
    ]);

    try {
        const serverData = await getServerStatus(answers.serverIP, answers.serverPort);

        if (serverData.plugins && serverData.plugins.names) {
            console.log('Lista de plugins:', chalk.yellow(serverData.plugins.names.join(', ')));
            console.log('Script by alanYTT');
        } else {
            console.log('No se encontraron plugins.');
            console.log('Puede ser un error de api multi version.');
        }

        if (serverData.players && serverData.players.online > 0) {
            console.log('Lista de jugadores:');
            serverData.players.list.forEach(player => {
                console.log(chalk.green(player));
            });
        } else {
            console.log('No hay jugadores conectados en este momento.');
        }
    } catch (error) {
        console.error(chalk.red(error.message));
    }
};

showPluginsAndPlayers();
