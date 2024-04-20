import sequelize from './sequelize';
import MonitoringData from '../src/models/MonitoringData.model';

async function run() {
    await MonitoringData.sync();
}

export default { run };