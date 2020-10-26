const { Schema, model } = require("mongoose");

const CandidateSchema = new Schema({
    source: {
        type: String,
        required: true,
        default: null
    },
    candidateIdFromSource: {
        type: String,
        unique: true,
        required: true,
        default: null,
        index: true
    },
    createdDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedDate: {
        type: Date,
        default: null
    },
    candidateUrl: {
        type: String,
        unique: true,
        required: true,
        default: null,
        index: true
    },
    candidateName: {
        type: String,
        default: null
    },
    candidateAvatar: {
        type: String,
        default: null
    },
    candidateBirth: {
        type: String,
        default: null
    },
    candidateBirthYear: {
        type: Number,
        default: 0
    },
    candidateGender: {
        type: String,
        default: null
    },
    candidateMaritalStatus: {
        type: String,
        default: null
    },

    candidateUpdateTimestamp: {
        type: String,
        default: null
    },

    candidatePosition: {
        type: String,
        default: null
    },
    candidateSalary: {
        type: String,
        default: null
    },


    candidateProfile: [{
        type: String,
        default: null
    }],
    candidateProfession: [{
        type: String,
        default: null
    }],

    candidateAcademicLevel: {
        type: String,
        default: null
    },
    candidateJobType: {
        type: String,
        default: null
    },

    candidatePosition: {
        type: String,
        default: null
    },
    candidateDesiredSalary: {
        type: String,
        default: null
    },
    candidateDesiredSalaryNums: [],
    candidateDesiredSalaryMax: {
        type: Number,
        default: 0
    },
    candidateDesiredSalaryMin: {
        type: Number,
        default: 0
    },
    candidateYearsOfExp: {
        type: String,
        default: null
    },
    candidateYearsOfExpNum: {
        type: Number,
        default: 0
    },
    candidateLocation: [{
        type: String,
        default: null
    }],

    candidateDistrict: {
        type: String,
        default: null
    },
    candidateProvinceCity: {
        type: String,
        default: null
    },
    candidateProfileNum: {
        type: String,
        default: null
    },

    candidateViewNum: {
        type: String,
        default: null
    },

    candidateSkill: [{
        type: String,
        default: null
    }],
    candidateExperience: [{
    }],

    candidateExperienceLength: {
        type: Number,
        default: 0
    },

    candidateEducation: [{
    }],

    candidateEducationLength: {
        type: Number,
        default: 0
    },

    candidateLanguage: [{
    }],

    candidateScore: {
        type: Number,
        default: 0
    },
    candidateMeetRequirement: {
        type: Boolean,
        default: false
    },
    candidateEmail: {
        type: String,
        default: null
    },
    candidatePhone: {
        type: String,
        default: null
    },
    candidateAddress: {
        type: String,
        default: null
    },

    error: {
        type: Boolean,
        default: false
    },
    errorMessage: {
        type: String,
        default: null
    },
});

const CandidateModel = model("Candidate", CandidateSchema);

module.exports = CandidateModel;