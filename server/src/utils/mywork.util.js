const commons = require('../commons/commons');
const CandidateModel = require('../models/candidate.model');
const XLSX = require('xlsx');
const validator = require('validator');
const request = require('request');
const fs = require('fs');
const puppeteer = require('puppeteer');
const source = 'MyWork';

let MyworkUtils = {};

MyworkUtils.config = {
    // user: 'hodacthuan94@gmail.com',
    user: 'mywork@tinthanhgroup.vn',
    // password: '12345678',
    password: 'tinthanhgroup@2020',
    endpoint: 'https://api.mywork.com.vn',
    downloadFile: 'file.xlsx'
};

MyworkUtils.mainPageScrape = async (page, url) => {
    let allJobEachPage = [];
    try {

        await page.goto(url);
        await page.waitFor(Math.floor(Math.random() * 1000) + 2000);

        allJobEachPage = await page.evaluate(() => {
            let data = [];
            try {
                let elements = document.getElementsByTagName('table')[0].querySelectorAll('tr'); console.log(elements);

                for (var element of elements) {
                    let _data = {};
                    let cadidateDetailElement = element.getElementsByTagName('td');
                    if (cadidateDetailElement.length) {
                        let candidateUrl = cadidateDetailElement[0]
                            .getElementsByTagName('p')[0]
                            .getElementsByTagName('a')[0].href;

                        _data.candidateUrl = candidateUrl;
                        data.push({ candidateUrl });
                    }
                }
            } catch (err) { }
            return data;
        });

    } catch (error) {
        console.log('ERROR :: Mywork candidate mainPageScrapeFailed', error);
    }
    return allJobEachPage;
};

MyworkUtils.extractedEachItemDetail = async (page, item) => {
    try {

        await page.goto(item.candidateUrl);
        await page.waitFor(Math.floor(Math.random() * 1000) + 2000);
        //code at fontend
        let data = await page.evaluate(() => {
            let _data = {};

            try {

                let parentElement = document.getElementById('detail-el');
                let elementData = parentElement
                    .getElementsByClassName('mw-box-item')[0]
                    .getElementsByClassName('info')[0]
                    .getElementsByClassName('info-candidate')[0]
                    .getElementsByClassName('info-basic')[0]
                    .getElementsByClassName('title')[0]
                    .innerText.trim();
                console.log(elementData);

                _data.candidateName = elementData;

            } catch (error) {
                console.log(error);

                _data.error = true;
                _data.errorMessage = JSON.stringify(error);

                _data.candidateName = null;
            }


            try {
                let parentElement = document.getElementById('detail-el');
                let elementData = parentElement
                    .getElementsByClassName('mw-box-item')[0]
                    .getElementsByClassName('info')[0]
                    .getElementsByClassName('info-candidate')[0]
                    .getElementsByClassName('info-basic')[0]
                    .getElementsByClassName('sub-title')[0]
                    .innerText.trim();
                console.log(elementData);

                _data.candidatePosition = elementData;

            } catch (error) {
                console.log(error);

                _data.error = true;
                _data.errorMessage = JSON.stringify(error);

                _data.candidatePosition = null;
            }

            try {
                let parentElement = document.getElementById('detail-el');
                let elementData = parentElement
                    .getElementsByClassName('mw-box-item')[0]
                    .getElementsByClassName('info')[0]
                    .getElementsByClassName('info-candidate')[0]
                    .getElementsByClassName('info-basic')[0]
                    .getElementsByClassName('mt-16')[0]
                    .getElementsByClassName('col-sm-8')[0]
                    .getElementsByTagName('p')[0]
                    .innerText.trim();
                console.log(elementData);

                _data.candidateBirth = elementData;
                _data.candidateBirthYear = Number(elementData.split("/")[2]);
            } catch (error) {
                console.log(error);

                _data.error = true;
                _data.errorMessage = JSON.stringify(error);

                _data.candidateBirth = null;
                _data.candidateBirthYear = 0;
            }
            try {

                let parentElement = document.getElementById('detail-el');
                let elementData = parentElement
                    .getElementsByClassName('mw-box-item')[0]
                    .getElementsByClassName('info')[0]
                    .getElementsByClassName('info-candidate')[0]
                    .getElementsByClassName('info-basic')[0]
                    .getElementsByClassName('mt-16')[0]
                    .getElementsByClassName('col-sm-8')[0]
                    .getElementsByTagName('p')[1]
                    .innerText.trim();
                console.log(elementData);

                _data.candidateAddress = elementData;
            } catch (error) {
                console.log(error);

                _data.error = true;
                _data.errorMessage = JSON.stringify(error);

                _data.candidateAddress = null;
            }

            try {

                let parentElement = document.getElementById('detail-el');
                let elementData = parentElement
                    .getElementsByClassName('mw-box-item')[0]
                    .getElementsByClassName('info')[0]
                    .getElementsByClassName('info-candidate')[0]
                    .getElementsByClassName('info-basic')[0]
                    .getElementsByClassName('mt-16')[0]
                    .getElementsByClassName('col-sm-4')[0]
                    .getElementsByTagName('p')[0]
                    .innerText.trim();
                console.log(elementData);

                _data.candidateGender = elementData;
            } catch (error) {
                console.log(error);

                _data.error = true;
                _data.errorMessage = JSON.stringify(error);

                _data.candidateGender = null;
            }

            try {

                let parentElement = document.getElementById('detail-el');
                let elementData = parentElement
                    .getElementsByClassName('mw-box-item')[0]
                    .getElementsByClassName('info')[0]
                    .getElementsByClassName('info-candidate')[0]
                    .getElementsByClassName('info-basic')[0]
                    .getElementsByClassName('mt-16')[0]
                    .getElementsByClassName('col-sm-4')[0]
                    .getElementsByTagName('p')[1]
                    .innerText.trim();
                console.log(elementData);

                _data.candidateMaritalStatus = elementData;
            } catch (error) {
                console.log(error);

                _data.error = true;
                _data.errorMessage = JSON.stringify(error);

                _data.candidateMaritalStatus = null;
            }

            try {
                let parentElement = document.getElementById('detail-el');
                let elementData = parentElement
                    .getElementsByClassName('mw-box-item')[0]
                    .getElementsByClassName('info')[0]
                    .getElementsByClassName('info-candidate')[0]
                    .getElementsByClassName('picture')[0]
                    .getElementsByClassName('image-cover')[0]
                    .getElementsByClassName('lazy-load')[0].src
                    .trim();
                console.log(elementData);

                if (!['https://cdn1.mywork.com.vn/default-image/avatar/male_avatar.jpg', 'https://mywork.com.vn/employer-no-image.png'].includes(elementData)) {
                    _data.candidateAvatar = elementData;
                } else {
                    _data.candidateAvatar = null;
                }

            } catch (error) {
                console.log(error);

                _data.error = true;
                _data.errorMessage = JSON.stringify(error);

                _data.candidateAvatar = null;
            }

            try {

                /// start of try
                _data.candidateProfession = [];
                _data.candidateLocation = [];
                _data.candidateProfile = [];
                _data.candidateSkill = [];
                _data.candidateLanguage = [];
                _data.candidateEducation = [];
                _data.candidateExperience = [];
                _data.candidateEducationLength = 0;
                _data.candidateExperienceLength = 0;

                parentElement = document.getElementById('detail-el');
                container = parentElement.getElementsByClassName('common-info');
                for (k = 0; k < container.length; k++) {
                    if (
                        container[k]
                            .getElementsByClassName('head-title')[0]
                            .getElementsByTagName('span')[0]
                            .innerText.trim() == 'Thông tin hồ sơ'
                    ) {
                        let profileInfoHTMLList = container[k]
                            .getElementsByClassName('content')[0]
                            .getElementsByTagName('li');

                        for (i = 0; i < profileInfoHTMLList.length; i++) {
                            if (
                                profileInfoHTMLList[i]
                                    .getElementsByTagName('strong')[0]
                                    .innerText.trim() == 'Ngành nghề:'
                            ) {
                                let profileDetailHTMLList = profileInfoHTMLList[
                                    i
                                ].getElementsByTagName('span');
                                for (j = 0; j < profileDetailHTMLList.length; j++) {
                                    _data.candidateProfession.push(
                                        profileDetailHTMLList[j].getElementsByTagName('a')[0]
                                            .innerText
                                    );
                                }
                            }
                            if (
                                profileInfoHTMLList[i]
                                    .getElementsByTagName('strong')[0]
                                    .innerText.trim() == 'Nơi làm việc:'
                            ) {
                                let profileDetailHTMLList = profileInfoHTMLList[
                                    i
                                ].getElementsByTagName('span');
                                for (j = 0; j < profileDetailHTMLList.length; j++) {
                                    _data.candidateLocation.push(
                                        profileDetailHTMLList[j].getElementsByTagName('a')[0]
                                            .innerText
                                    );
                                }
                            }
                            if (
                                profileInfoHTMLList[i]
                                    .getElementsByTagName('strong')[0]
                                    .innerText.trim() == 'Trình độ học vấn:'
                            ) {
                                _data.candidateAcademicLevel = profileInfoHTMLList[i].innerText
                                    .replace('Trình độ học vấn:', '')
                                    .trim();
                            }
                            if (
                                profileInfoHTMLList[i]
                                    .getElementsByTagName('strong')[0]
                                    .innerText.trim() == 'Loại hình công việc:'
                            ) {
                                _data.candidateJobType = profileInfoHTMLList[i].innerText
                                    .replace('Loại hình công việc:', '')
                                    .trim();
                            }
                            if (
                                profileInfoHTMLList[i]
                                    .getElementsByTagName('strong')[0]
                                    .innerText.trim() == 'Cấp bậc mong muốn:'
                            ) {
                                _data.candidatePosition = profileInfoHTMLList[i].innerText
                                    .replace('Cấp bậc mong muốn:', '')
                                    .trim();
                            }
                            if (
                                profileInfoHTMLList[i]
                                    .getElementsByTagName('strong')[0]
                                    .innerText.trim() == 'Mức lương mong muốn:'
                            ) {
                                _data.candidateDesiredSalary = profileInfoHTMLList[i].innerText
                                    .replace('Mức lương mong muốn:', '')
                                    .trim();

                                let salaryArray = _data.candidateDesiredSalary.split('-');
                                salaryArray = salaryArray.map(element => {
                                    return Number(element.replace("triệu", "").trim());
                                });

                                _data.candidateDesiredSalaryNums = salaryArray;
                                _data.candidateDesiredSalaryMin = Number(salaryArray[0]);
                                _data.candidateDesiredSalaryMax = Number(salaryArray[1]);
                            }
                            if (
                                profileInfoHTMLList[i]
                                    .getElementsByTagName('strong')[0]
                                    .innerText.trim() == 'Số năm kinh nghiệm:'
                            ) {
                                _data.candidateYearsOfExp = profileInfoHTMLList[i].innerText
                                    .replace('Số năm kinh nghiệm:', '')
                                    .trim();

                                _data.candidateYearsOfExpNum = Number(_data.candidateYearsOfExp.replace("năm", "").trim()) || 0;
                            }
                            if (
                                profileInfoHTMLList[i]
                                    .getElementsByTagName('strong')[0]
                                    .innerText.trim() == 'Quận / huyện:'
                            ) {
                                _data.candidateDistrict = profileInfoHTMLList[i].innerText
                                    .replace('Quận / huyện:', '')
                                    .trim();
                            }

                            if (
                                profileInfoHTMLList[i]
                                    .getElementsByTagName('strong')[0]
                                    .innerText.trim() == 'Ngày cập nhật:'
                            ) {
                                _data.candidateUpdateTimestamp = profileInfoHTMLList[i].innerText
                                    .replace('Ngày cập nhật:', '')
                                    .trim();
                            }

                            if (
                                profileInfoHTMLList[i]
                                    .getElementsByTagName('strong')[0]
                                    .innerText.trim() == 'Tỉnh / thành phố:'
                            ) {
                                _data.candidateProvinceCity = profileInfoHTMLList[i].innerText
                                    .replace('Tỉnh / thành phố:', '')
                                    .trim();
                            }
                            if (
                                profileInfoHTMLList[i]
                                    .getElementsByTagName('strong')[0]
                                    .innerText.trim() == 'Mã hồ sơ:'
                            ) {
                                _data.candidateProfileNum = profileInfoHTMLList[i].innerText
                                    .replace('Mã hồ sơ:', '')
                                    .trim();
                                _data.candidateIdFromSource = profileInfoHTMLList[i].innerText
                                    .replace('Mã hồ sơ:', '')
                                    .trim();
                            }
                            if (
                                profileInfoHTMLList[i]
                                    .getElementsByTagName('strong')[0]
                                    .innerText.trim() == 'Số lượt xem:'
                            ) {
                                _data.candidateViewNum = profileInfoHTMLList[i].innerText
                                    .replace('Số lượt xem:', '')
                                    .trim();
                            }
                        }
                    }
                    //Mục tiêu nghề nghiệp
                    if (
                        container[k]
                            .getElementsByClassName('head-title')[0]
                            .getElementsByTagName('span')[0]
                            .innerText.trim() == 'Mục tiêu nghề nghiệp'
                    ) {
                        try {
                            _data.candidateProfile.push(
                                container[k]
                                    .getElementsByClassName('content')[0]
                                    .getElementsByTagName('article')[0].innerText
                            );
                        } catch { }
                        let profileInfoHTMLList = container[k]
                            .getElementsByClassName('content')[0]
                            .getElementsByTagName('li');
                        for (i = 0; i < profileInfoHTMLList.length; i++) {
                            _data.candidateProfile.push(
                                profileInfoHTMLList[i].innerText.trim()
                            );
                        }
                    }
                    //Kỹ năng bản thân
                    if (
                        container[k]
                            .getElementsByClassName('head-title')[0]
                            .getElementsByTagName('span')[0]
                            .innerText.trim() == 'Kỹ năng bản thân'
                    ) {
                        try {
                            _data.candidateSkill.push(
                                container[k]
                                    .getElementsByClassName('content')[0]
                                    .getElementsByTagName('article')[0].innerText
                            );
                        } catch { }
                        let profileInfoHTMLList = container[k]
                            .getElementsByClassName('content')[0]
                            .getElementsByTagName('li');
                        for (i = 0; i < profileInfoHTMLList.length; i++) {
                            _data.candidateSkill.push(
                                profileInfoHTMLList[i].innerText.trim()
                            );
                        }
                    }
                    //Trình độ ngoại ngữ
                    if (
                        container[k]
                            .getElementsByClassName('head-title')[0]
                            .getElementsByTagName('span')[0]
                            .innerText.trim()
                            .includes('Trình độ ngoại ngữ')
                    ) {
                        let foreignLangHTMLList = container[k]
                            .getElementsByClassName('content')[0]
                            .getElementsByTagName('li');
                        for (i = 0; i < foreignLangHTMLList.length; i++) {
                            let language = {};
                            language.language = foreignLangHTMLList[i].getElementsByTagName(
                                'span'
                            )[0].innerText;
                            language.level =
                                foreignLangHTMLList[i]
                                    .getElementsByTagName('span')[1]
                                    .getElementsByClassName('el-icon-star-on').length + '/5';
                            _data.candidateLanguage.push(language);
                        }
                    }

                    //Học vấn / bằng cấp
                    if (
                        container[k]
                            .getElementsByClassName('head-title')[0]
                            .getElementsByTagName('span')[0]
                            .innerText.trim()
                            .includes('Học vấn / bằng cấp')
                    ) {
                        let educationHTMLList = container[k]
                            .getElementsByClassName('content')[0]
                            .getElementsByClassName('item');
                        for (i = 0; i < educationHTMLList.length; i++) {
                            let education = {};
                            try {
                                education.period = educationHTMLList[i]
                                    .getElementsByClassName('time')[0]
                                    .getElementsByTagName('span')[0]
                                    .innerText.trim();
                            } catch { }
                            try {
                                education.title = educationHTMLList[i]
                                    .getElementsByClassName('info')[0]
                                    .getElementsByTagName('h4')[0]
                                    .innerText.trim();
                            } catch { }
                            try {
                                education.description = educationHTMLList[i]
                                    .getElementsByClassName('cert-info')[0]
                                    .getElementsByClassName('item-desc')[0]
                                    .innerText.trim();
                            } catch { }
                            let educationDetailHtmlList = educationHTMLList[i]
                                .getElementsByClassName('info')[0]
                                .getElementsByTagName('p');
                            for (j = 0; j < educationDetailHtmlList.length; j++) {
                                if (
                                    educationDetailHtmlList[j].innerText.includes(
                                        'Trường / nơi đào tạo:'
                                    )
                                ) {
                                    education.institution = educationDetailHtmlList[j].innerText
                                        .replace('Trường / nơi đào tạo:', '')
                                        .trim();
                                }
                                if (educationDetailHtmlList[j].innerText.includes('Khoa:')) {
                                    education.faculty = educationDetailHtmlList[j].innerText
                                        .replace('Khoa:', '')
                                        .trim();
                                }
                                if (educationDetailHtmlList[j].innerText.includes('Ngành:')) {
                                    education.department = educationDetailHtmlList[j].innerText
                                        .replace('Ngành:', '')
                                        .trim();
                                }
                            }

                            _data.candidateEducation.push(education);
                        }

                        _data.candidateEducationLength = _data.candidateEducation.length;
                    }

                    //Kinh nghiệm làm việc
                    if (
                        container[k]
                            .getElementsByClassName('head-title')[0]
                            .getElementsByTagName('span')[0]
                            .innerText.trim()
                            .includes('Kinh nghiệm làm việc')
                    ) {
                        let educationHTMLList = container[k]
                            .getElementsByClassName('content')[0]
                            .getElementsByClassName('item');
                        for (i = 0; i < educationHTMLList.length; i++) {
                            let result = {};
                            try {
                                result.period = educationHTMLList[i]
                                    .getElementsByClassName('time')[0]
                                    .getElementsByTagName('span')[0]
                                    .innerText.trim();
                            } catch { }
                            try {
                                result.title = educationHTMLList[i]
                                    .getElementsByClassName('info')[0]
                                    .getElementsByTagName('h4')[0]
                                    .innerText.trim();
                            } catch { }
                            try {
                                result.description = educationHTMLList[i]
                                    .getElementsByClassName('cert-info')[0]
                                    .getElementsByClassName('item-desc')[0]
                                    .innerText.trim();
                            } catch { }
                            let educationDetailHtmlList = educationHTMLList[i]
                                .getElementsByClassName('info')[0]
                                .getElementsByTagName('p');
                            for (j = 0; j < educationDetailHtmlList.length; j++) {
                                if (educationDetailHtmlList[j].innerText.includes('Công ty:')) {
                                    result.company = educationDetailHtmlList[j].innerText
                                        .replace('Công ty:', '')
                                        .trim();
                                }
                            }
                            _data.candidateExperience.push(result);
                        }

                        _data.candidateExperienceLength = _data.candidateExperience.length;
                    }
                }

                console.log(_data);
                /// end of try

            } catch (error) {
                console.log(error);

                _data.error = true;
                _data.errorMessage = JSON.stringify(error);

                _data.candidateProfession = [];
                _data.candidateProfile = [];
                _data.candidateSkill = [];
                _data.candidateLocation = [];
                _data.candidateAcademicLevel = null;
                _data.candidateJobType = null;
                _data.candidatePosition = null;
                _data.candidateDesiredSalary = null;
                _data.candidateDesiredSalaryNums = [];
                _data.candidateDesiredSalaryMax = 0;
                _data.candidateDesiredSalaryMin = 0;
                _data.candidateYearsOfExp = null;
                _data.candidateYearsOfExpNum = 0;
                _data.candidateDistrict = null;
                _data.candidateProvinceCity = null;
                _data.candidateProfileNum = null;
                _data.candidateIdFromSource = null;
                _data.candidateViewNum = null;
                _data.candidateLanguage = [];
                _data.candidateEducationLength = 0;
                _data.candidateExperienceLength = 0;

            }

            return _data;
        });

        if (data.error) {
            return;
        }

        Date.prototype.addDays = function (days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };

        let currentTime = new Date();
        item.updatedDate = currentTime;
        item.source = source;
        let results = { ...item, ...data };

        return results;
    } catch (err) {
        console.log('ERROR :: extractedEachItemDetailFailed', err);
        return undefined;
    }
};

MyworkUtils.extractedHtmlAndGetContactInfoEachCandidate = async (page, token, item) => {

    MyworkUtils.myworkSubmitToViewCandidateInfo(MyworkUtils.url2cvId(item.candidateUrl));

    try {
        const cookies = [{
            name: 'access_token',
            value: token,
            domain: 'mywork.com.vn',
            path: '/',
            expires: 1605963343,
            httpOnly: false,
            secure: false,
            session: false
        }];

        await page.deleteCookie(...cookies);
        await page.waitFor(100);

        await page.setCookie(...cookies);
        await page.waitFor(300);

        await page.goto(item.candidateUrl);
        await page.waitForSelector('#box-contact', { visible: true, timeout: 5000 });

        //code at fontend
        let data = await page.evaluate(() => {
            let _data = {};

            try {
                let parentElement = document;
                _data.candidateEmail = parentElement
                    .getElementById('box-contact')
                    .getElementsByClassName('row')[2]
                    .getElementsByClassName('item')[0]
                    .getElementsByClassName('text-primary')[0]
                    .innerText.trim();

            } catch (error) {
                console.log(error);

                _data.error = true;
                _data.errorMessage = JSON.stringify(error);

                _data.candidateEmail = null;
            }

            console.log(_data);

            try {
                let parentElement = document;
                _data.candidatePhone = parentElement
                    .getElementById('box-contact')
                    .getElementsByClassName('row')[3]
                    .getElementsByClassName('text-danger')[0]
                    .innerText.trim();

            } catch (error) {
                console.log(error);

                _data.error = true;
                _data.errorMessage = JSON.stringify(error);

                _data.candidatePhone = null;
            }

            console.log(_data);

            return _data;
        });

        if (data.error) {
            return;
        }

        Date.prototype.addDays = function (days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };

        let currentTime = new Date();
        item.updatedDate = currentTime;
        item.source = source;
        let results = { ...item, ...data };

        return results;
    } catch (err) {
        console.log('ERROR :: extractedEachItemDetailFailed', err);
        return undefined;
    }
};

MyworkUtils.myworkFilterList = [8, 30, 31, 32, 43, 63, 74, 75];

MyworkUtils.myWorkCategory = {
    2: "Ngân hàng/ Tài Chính",
    3: "Bảo hiểm/ Tư vấn bảo hiểm",
    4: "Đầu tư",
    5: "Bất động sản",
    6: "Kế toán - Kiểm toán",
    7: "Ngân hàng/ Tài Chính",
    8: "Hành chính - Văn phòng",
    9: "Kiến trúc - Thiết kế nội thất",
    10: "Xây dựng",
    11: "undefined",
    12: "Du lịch",
    13: "Khách sạn - Nhà hàng",
    14: "Công nghiệp",
    15: "Công nghệ cao",
    16: "Công nghiệp",
    17: "Dệt may - Da giày",
    18: "In ấn - Xuất bản",
    19: "Lao động phổ thông",
    20: "Nông - Lâm - Ngư nghiệp",
    21: "Ô tô - Xe máy",
    22: "Thủ công mỹ nghệ",
    23: "Vật tư/Thiết bị/Mua hàng",
    24: "Làm bán thời gian",
    25: "Làm bán thời gian",
    26: "Nhân viên trông quán internet",
    27: "Promotion Girl/ Boy (PG-PB)",
    28: "Sinh viên làm thêm",
    29: "Thực tập",
    30: "Nhân viên kinh doanh",
    31: "Bán hàng",
    32: "Nhân viên kinh doanh",
    33: "Quản trị kinh doanh",
    34: "Xuất - Nhập khẩu",
    35: "IT phần cứng/mạng",
    36: "Games",
    37: "IT phần cứng/mạng",
    38: "IT phần mềm",
    39: "Thiết kế đồ họa - Web",
    40: "Thương mại điện tử",
    41: "Biên tập/ Báo chí/ Truyền hình",
    42: "Biên tập/ Báo chí/ Truyền hình",
    43: "Marketing - PR",
    44: "Tiếp thị - Quảng cáo",
    45: "Tổ chức sự kiện - Quà tặng",
    46: "Bưu chính",
    47: "Bưu chính",
    48: "Điện tử viễn thông",
    49: "Hàng gia dụng",
    50: "Hàng gia dụng",
    51: "Mỹ phẩm - Trang sức",
    52: "Thời trang",
    53: "Thực phẩm - Đồ uống",
    54: "Kỹ thuật ứng dụng",
    55: "Bảo vệ/ An ninh/ Vệ sỹ",
    56: "Phiên dịch/ Ngoại ngữ",
    57: "Dịch vụ",
    58: "Giáo dục - Đào tạo",
    59: "Hàng hải",
    60: "Hàng không",
    61: "Người giúp việc/ Phục vụ/ Tạp vụ",
    62: "Pháp luật/ Pháp lý",
    63: "Tư vấn/ Chăm sóc khách hàng",
    64: "Vận tải - Lái xe/ Tài xế",
    65: "Y tế - Dược",
    66: "undefined",
    67: "Cơ khí - Chế tạo",
    68: "Dầu khí - Hóa chất",
    69: "Điện - Điện tử - Điện lạnh",
    70: "Hóa học - Sinh học",
    71: "Kỹ thuật",
    72: "Kỹ thuật ứng dụng",
    73: "undefined",
    74: "Hành chính - Văn phòng",
    75: "Nhân sự",
    76: "Thư ký - Trợ lý",
    77: "Kỹ thuật",
    78: "Hoạch định - Dự án",
    79: "Ngành nghề khác",
    80: "Nghệ thuật - Điện ảnh",
    81: "Thiết kế - Mỹ thuật",
    82: "Quan hệ đối ngoại",
    83: "undefined",
    84: "Xuất khẩu lao động",
    85: "Startup",
    86: "Freelance",
    87: "undefined",
    88: "QA-QC/ Thẩm định/ Giám định",
    89: "Môi trường",
    90: "Phi chính phủ/ Phi lợi nhuận",
    91: "Lương cao",
    92: "Việc làm cấp cao",
    93: "undefined",
    94: "Công chức - Viên chức",
    95: "Phát triển thị trường",
    96: "undefined",
    97: "undefined",
    98: "Giao nhận/ Vận chuyển/ Kho bãi",
    99: "Làm đẹp/ Thể lực/ Spa",
    100: "Làm đẹp/ Thể lực/ Spa",
    101: "Hàng không",
};

MyworkUtils.myworkCandidateProfession = () => {
    let results = [];
    MyworkUtils.myworkFilterList.forEach((item) => {
        results.push(MyworkUtils.myWorkCategory[item]);
    });

    return results;
};

MyworkUtils.getMarketingCandidateList = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let limit = 10000;

            let candidateYearsOfExp = [
                'Chưa có kinh nghiệm',
                '1 năm',
                '2 năm',
                '3 năm'
            ];

            let candidateProvinceCity = [
                'Hồ Chí Minh',
                'Hà Nội',
                'Bình Dương',
                'Đà Nẵng',
                'Cần Thơ'
            ];

            let candidatePosition = [
                'Nhân viên',
                'Mới tốt nghiệp / Thực tập sinh',
            ];

            let candidateProfession = MyworkUtils.myworkCandidateProfession();

            let resutls = await CandidateModel.find({
                source: 'MyWork',
                candidateProfession: { $in: candidateProfession },
                candidatePosition: { $in: candidatePosition },
                candidateProvinceCity: { $in: candidateProvinceCity },
                candidateDesiredSalaryMax: { $in: commons.getArrayNumber(1, 15) },
                candidateYearsOfExp: { $in: candidateYearsOfExp },
                candidateName: { $exists: true },
                candidateBirthYear: { $in: commons.getArrayNumber(1990, 2003) },
                candidateDistrict: { $exists: true },

                candidateYearsOfExpNum: { $exists: true },
                $and: [
                    {
                        $or: [
                            {
                                $and: [
                                    { candidateYearsOfExpNum: { $gte: 1 }, },
                                    { candidateExperience: { $not: { $size: 0 } } }
                                ]
                            },
                            { candidateYearsOfExpNum: 0 },
                        ]
                    },
                    {
                        $or: [
                            {
                                $and: [
                                    { candidateBirthYear: { $in: commons.getArrayNumber(1990, 1996) } },
                                    { candidateExperience: { $not: { $size: 0 } } }
                                ]
                            },
                            { candidateBirthYear: { $in: commons.getArrayNumber(1997, 2003) } },
                        ]
                    },
                ],

            }, {
                'candidateName': true,
                'candidateUrl': true,
                'candidateAvatar': true,
                'candidateBirthYear': true,
                'candidateGender': true,
                'candidateLocation': true,
                'candidateDistrict': true,
                'candidateScore': true,
                'candidateDesiredSalary': true,
                'candidateYearsOfExpNum': true,
                'candidateExperienceLength': true,
                'candidateEducationLength': true,
                'candidatePosition': true,
                'candidatePhone': true,
                'candidateEmail': true,

            })
                .limit(limit)
                .lean().exec();

            resutls.forEach(candidate => {
                let result = candidate;
                result.candidateLocation = candidate.candidateLocation.toString();
                return result;
            });

            resolve(resutls);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

MyworkUtils.updateMyworkImportCandidateInfo = async (data, task = null) => {
    let resultArray = [];

    await data.reduce(function (promise, item) {
        return promise.then(function () {
            return new Promise((resolve, reject) => {
                process.nextTick(async () => {
                    let itemData = {};
                    let allowanceField = ['source', 'candidateUrl', 'candidateIdFromSource', 'candidateEmail', 'candidatePhone'];
                    allowanceField.forEach(element => {
                        itemData[element] = item[element];
                    });

                    let results = await commons.updateCandidate(itemData);
                    if (task) {
                        await commons.updateConfig(task, { message: results.candidateUrl, updated: new Date() });
                    }

                    resultArray.push(results.candidateUrl);
                    resolve();
                });
            });
        });
    }, Promise.resolve());

    if (task) {
        await commons.updateConfig(task, { message: 'Update completed!', updated: new Date() });
    }

    return resultArray;
};

MyworkUtils.scoreCandidate = (itemDetail) => {
    try {
        let candidateScore = 0;
        let candidateMeetRequirement = true;

        const scoreField = {
            candidateName: 7,
            candidateBirth: 5,
            candidateGender: 5,
            candidatePosition: 7,
            candidateSalary: 3,
            candidateProfile: 5,
            candidateProfession: 7,
            candidateAcademicLevel: 5,
            candidateJobType: 7,
            candidateDesiredSalary: 3,
            candidateYearsOfExp: 3,
            candidateLocation: 7,
            candidateDistrict: 3,
            candidateProvinceCity: 3,
            candidateProfileNum: 1,
            candidateViewNum: 3,
            candidateSkill: 3,
            candidateExperience: 7,
            candidateEducation: 7,
            candidateLanguage: 3,
            candidateAddress: 3,

        };

        const requirementField = [
            'candidateName',
            'candidatePosition',
            'candidateProfession',
            'candidateJobType',
            'candidateLocation',
            'candidateExperience',
            'candidateEducation',
            'candidateDistrict',
        ];

        const multiplyArrayField = [
            'candidateExperience',
            'candidateEducation',
        ];

        function checkIfExisting(itemDetail, field) {
            return !(itemDetail[field] == null || itemDetail[field] == undefined || ((Array.isArray(itemDetail[field])) && (itemDetail[field].length == 0)));
        }

        function getMultiplyScoreArrayFieldLength(itemDetail, field) {
            if (itemDetail[field] && (Array.isArray(itemDetail[field])) && (itemDetail[field].length > 1) && (multiplyArrayField.includes(field))) {
                return itemDetail[field].length;
            } else {
                return 1;
            }
        }

        requirementField.forEach((field) => {
            if (!checkIfExisting(itemDetail, field)) {
                candidateMeetRequirement = false;
            }
        });

        Object.keys(scoreField).forEach(function (key) {
            if (checkIfExisting(itemDetail, key)) {
                candidateScore += scoreField[key] * getMultiplyScoreArrayFieldLength(itemDetail, key);
            }
        });

        itemDetail.candidateScore = candidateScore;
        itemDetail.candidateMeetRequirement = candidateMeetRequirement;

        return itemDetail;
    } catch (error) {
        console.log(error);
    }
};

MyworkUtils.readAndHandleCandidateFile = (path) => {
    const wb = XLSX.readFile(path);
    xlsxData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
        header: 1,
        blankrows: false
    });

    let data = [];
    xlsxData.forEach(element => {
        try {
            let url = element[7];
            let cvId = element[1];
            let email = element[4];
            let phone = element[5];

            if (
                validator.isURL(url) &&
                validator.isMobilePhone(phone) &&
                validator.isEmail(email) &&
                cvId
            ) {
                data.push({
                    source: 'MyWork',
                    candidateUrl: url,
                    candidateEmail: email,
                    candidateIdFromSource: cvId,
                    candidatePhone: phone,
                });
            }

        } catch (error) {
            commons.debug(error);
        }
    });

    return data;
};

MyworkUtils.candidateInfoExportFileHandling = (files) => {
    const keys = Object.keys(files), k = keys[0];
    let data = [];
    keys.forEach((key) => {
        let fileData = MyworkUtils.readAndHandleCandidateFile(files[key].path);
        data = [...data, ...fileData];
    });

    return data;
};

/**
 * Check if existing token is valid, if not, login and return new token
 * @param {String} token
 * @param {String} token
 */
MyworkUtils.myworkGetToken = (token) => {
    return new Promise((resolve, reject) => {
        const optionsLogin = {
            method: 'POST',
            url: MyworkUtils.config.endpoint + `/employer-auth/login?email=${MyworkUtils.config.user}&password=${MyworkUtils.config.password}`,
        };
        const optionsUserInfo = {
            method: 'GET',
            url: MyworkUtils.config.endpoint + `/clients/employer-users/me`,
            headers: {
                'authorization': `Bearer ${token}`
            }
        };

        request(optionsUserInfo, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                commons.debug('Use existing token');
                resolve(token);
            } else {
                commons.debug('Get new token');

                request(optionsLogin, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        const bodyParsed = JSON.parse(body);

                        resolve(bodyParsed.meta.access_token);
                    } else {
                        commons.debug(error);
                        commons.debug(response.statusCode);
                        reject(error);
                    }
                });
            }
        });
    });
};

/**
 * Get favorite list for token
 * @param
 * @param {Array}  favoriteList
 */
MyworkUtils.myworkGetFavoriteList = () => {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            url: MyworkUtils.config.endpoint + `/clients/employer-users/me/favorite-cvs?include=user.profile,save_categories&page=1`,
            headers: {
                'authorization': `Bearer ${token}`
            }
        };

        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                const bodyParsed = JSON.parse(body);

                let results = [];
                bodyParsed.data.forEach(item => {
                    results.push(`${item.id}`);
                });

                resolve(results);
            } else {
                commons.debug(error);
                commons.debug(response.statusCode);
                reject(error);
            }
        });
    });
};

/**
 * Add CV Id to favorite list
 * @param {String} myworkCvId
 * @param {Array}  favoriteList
 */
MyworkUtils.myworkAddCV2FavoriteList = (myworkCvId) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            url: MyworkUtils.config.endpoint + `/clients/employer-users/me/favorite-cvs?profile_id=${myworkCvId}`,
            headers: {
                'authorization': `Bearer ${token}`
            }
        };

        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                const bodyParsed = JSON.parse(body);

                resolve(myworkCvId);
            } else {
                commons.debug(error);
                commons.debug(response.statusCode);
                reject(error);
            }
        });
    });
};

/**
 * Remove CV Id from favorite list
 * @param {String} myworkCvId
 * @param {Array}  favoriteList
 */
MyworkUtils.myworkRemoveFromFavoriteList = (myworkCvId) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'DELETE',
            url: MyworkUtils.config.endpoint + `/clients/employer-users/me/favorite-cvs/${myworkCvId}`,
            headers: {
                'authorization': `Bearer ${token}`
            }
        };

        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                const bodyParsed = JSON.parse(body);

                resolve(myworkCvId);
            } else {
                commons.debug(error);
                commons.debug(response.statusCode);
                reject(error);
            }
        });
    });
};

/**
 * Remove all CVs from favorite list
 * @param 
 * @param {Array}  favoriteList
 */
MyworkUtils.myworkRemoveAllFavoriteList = () => {
    return new Promise(async (resolve, reject) => {
        let allCvs = await MyworkUtils.myworkGetFavoriteList();
        console.log('allCvs', allCvs);

        await allCvs.reduce(function (promise, item) {
            return promise.then(function () {
                return new Promise((resolve, reject) => {
                    process.nextTick(async () => {

                        let cvId = await MyworkUtils.myworkRemoveFromFavoriteList(item);

                        console.log('cvId', cvId);
                        resolve();
                    });
                });
            });
        }, Promise.resolve());

        resolve(allCvs);
    });
};

/**
 * Download XLSX file from favorite list
 * @param 
 * @param {Array}  favoriteList
 */
MyworkUtils.myworkDownloadCSVFileFavoriteList = async () => {
    let file = fs.createWriteStream(MyworkUtils.config.downloadFile);

    await new Promise((resolve, reject) => {
        let stream = request({
            method: 'GET',
            url: MyworkUtils.config.endpoint + `/clients/employer-users/me/favorite-cvs?get_excel=true`,
            headers: {
                'authorization': `Bearer ${token}`
            },
        }).pipe(file)
            .on('finish', () => {
                commons.debug(`The file is finished downloading.`);
                resolve();
            })
            .on('error', (error) => {
                reject(error);
            });

    }).catch(error => {
        commons.debug(error);
    });
};

/**
 * Request mywork to view candidate connection info( email, phone)
 * @param {String} myworkCvId
 * @param {Array} myworkCvId
 */
MyworkUtils.myworkSubmitToViewCandidateInfo = (myworkCvId) => {

    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            url: MyworkUtils.config.endpoint + `/services/point?candidate_id=${myworkCvId}`,
            headers: {
                'authorization': `Bearer ${token}`
            }
        };

        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                const bodyParsed = JSON.parse(body);

                if (bodyParsed.data.viewed == true) {
                    resolve(myworkCvId);
                } else {
                    resolve(undefined);
                }

            } else {
                commons.debug(error);
                commons.debug(response.statusCode);
                reject(error);
            }
        });
    });
};

/**
 * Return Mywork CV_ID from URL
 * @param {String} url
 * @param {Array} myworkCvId
 */
MyworkUtils.url2cvId = (url) => {
    let cvId = [];
    cvId = url.split("/").filter((item) => (!isNaN(Number(item)) && item.length > 2));

    return cvId[0];
};

/**
 * Crawl all from list of URLs
 * @param 
 * @param {Array}  favoriteList
 */
MyworkUtils.myworkCrawlDataByUrls = async (urls) => {
    commons.debug(urls);
    let results = [];

    await urls.reduce(function (promise, url) {
        return promise.then(function () {
            return new Promise((resolve, reject) => {
                process.nextTick(async () => {
                    let initCandidate = {
                        source: source,
                        candidateUrl: url,
                        candidateIdFromSource: MyworkUtils.url2cvId(url)
                    };
                    let candidate = await commons.getCandidate(initCandidate);

                    if (!candidate) {
                        commons.debug(`Crawl general info of candidate ${initCandidate.candidateIdFromSource}`);
                        let crawlCandidate = await MyworkUtils.extractedEachItemDetail(globalPage, initCandidate);

                        if (crawlCandidate) {
                            candidate = await commons.updateCandidate(crawlCandidate);
                        }
                    }

                    if (candidate && (!(candidate.candidatePhone && candidate.candidateEmail))) {
                        commons.debug(`Crawl contact info of candidate ${initCandidate.candidateIdFromSource}`);
                        global.token = await MyworkUtils.myworkGetToken(token);
                        commons.debug(token);
                        let crawlCandidate = await MyworkUtils.extractedHtmlAndGetContactInfoEachCandidate(globalPage, token, initCandidate);
                        commons.debug(crawlCandidate);

                        if (crawlCandidate) {
                            candidate = await commons.updateCandidate(crawlCandidate);
                        }
                    }

                    results.push(candidate);
                    await commons.sleep(Math.floor(Math.random() * 100) + 100);

                    resolve();
                });
            });
        });
    }, Promise.resolve());

    return { data: results };
};

module.exports = MyworkUtils;