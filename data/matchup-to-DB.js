const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Matchup = require('./../models/Matchup')

dotenv.config({ path: './config.env' })

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
)

mongoose.connect(DB).then((con) => {
  console.log('DB connection successful')
})

//READ JSON FILE

const matchups = JSON.parse(
  fs.readFileSync(`/hockey-matchups-2025.json`, 'utf-8')
)

console.log(matchups)
//IMPORT DATA INTO DATABASE

const importData = async () => {
  try {
    await Matchup.create(matchups)
    console.log('Data successfully loaded')
    process.exit()
  } catch (err) {
    console.log(err)
  }
}

//DELETE ALL DATA FROM THE TOURS COLLECTION

const deleteData = async () => {
  try {
    await Matchup.deleteMany()
    console.log('Data successfully deleted')
    process.exit()
  } catch (err) {
    console.log(err)
  }
}

if (process.argv[2] === '--import') {
  importData()
}
if (process.argv[2] === '--delete') {
  deleteData()
}
