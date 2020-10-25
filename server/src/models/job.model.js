const { Schema, model } = require("mongoose");

const JobSchema = new Schema({
    source: {
        type: String,
        required: true,
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
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        default: null
    },
    companyTitle: {
        type: String,
        default: null
    },
    jobTitle: {
        type: String,
        required: true,
        default: null
    },
    jobProfession: [{
        type: String,
        default: null
    }],
    jobUrl: {
        type: String,
        required: true,
        unique: true,
        default: null
    },
    jobSalary: {
        type: String,
        default: null
    },
    jobExpirationDate: {
        type: String,
        default: null
    },
    jobYearsofExperience: {
        type: String,
        default: null
    },
    jobDescription: [{
        type: String,
        default: null
    }],
    jobBenefit: [{
        type: String,
        default: null
    }],
    jobTags: [{
        type: String,
        default: null
    }],
    jobRequirement: [{
        type: String,
        default: null
    }],
    jobType: [{
        type: String,
        default: null
    }],
    jobAcademicDegree: [{
        type: String,
        default: null
    }],
    jobSkill: [{
        type: String,
        default: null
    }],
    jobSubmitDate: {
        type: String,
        default: null
    },

    jobPosition: {
        type: String,
        default: null
    },

    jobLocation: {
        type: String,
        default: null
    },
    jobLanguage: {
        type: String,
        default: null
    },

});


const JobModel = model("Job", JobSchema);

module.exports = JobModel;