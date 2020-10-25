const { Schema, model } = require("mongoose");

const CompanySchema = new Schema({
    source: {
        type: String,
        default: null
    },
    createdDate: {
        type: Date,
        default: null
    },
    updatedDate: {
        type: Date,
        default: null
    },
    companyTitle: {
        type: String,
        required: true,
        unique: true,
    },
    companyInfo: [{
        type: String,
        default: null
    }],
    companyImage: [{
        type: String,
        default: null
    }],

    companySize: {
        type: String,
        default: null
    },
    companyAddress: {
        type: String,
        default: null
    },
    companyCity: {
        type: String,
        default: null
    },
    companyDistrict: {
        type: String,
        default: null
    },
    companyUrl: {
        type: String,
        default: null
    },
    companyWebsite: {
        type: String,
        default: null
    },
    companyPhone: {
        type: String,
        default: null
    },
    companyEmail: {
        type: String,
        default: null
    },
    companyBusiness: [{
        type: String,
        default: null
    }],
    companyContactName: {
        type: String,
        default: null
    },
    companyContactPosition: {
        type: String,
        default: null
    },

    companyContactEmail: {
        type: String,
        default: null
    },
    companyContactMobile: {
        type: String,
        default: null
    },
});

const CompanyModel = model("Company", CompanySchema);

module.exports = CompanyModel;