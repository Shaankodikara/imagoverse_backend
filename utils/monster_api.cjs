const { default: MonsterApiClient } = require("monsterapi");
require('dotenv').config()
const client = new MonsterApiClient(process.env.MONSTER_API_KEY);

module.exports = client