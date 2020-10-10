const { Schema, model } = require("mongoose")

const ConfigSchema = new Schema({
    id: {
        type: String,
        default: null
    },
    data: {},

})


const ConfigModel = model("Config", ConfigSchema)

module.exports = ConfigModel