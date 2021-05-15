const API_RESOURCE_PATH = 'https://cdn-api.co-vin.in/api/v2/'


async function testFn() {
test = await findAvailableSlots('650', "15-05-2021");
console.log(test)
}

testFn();


async function cowinAPI(uri, method='GET', body = {}) {

    url = API_RESOURCE_PATH + uri;
    status = '-1';

    response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36'
        },
        ...(method == "POST" && { body: JSON.stringify(body)})
    })
    .then(function(response) {

        status = response.status;
        try {
            return response.json();
        }
        catch {
            return response;
        }
    })
    
    return response, status;
}

async function generateOTP(mobileNumber) {
    uri = "auth/public/generateOTP";
    body = { mobile: mobileNumber};

    response, code = await cowinAPI(uri, 'POST', body);

    return response, code;

}

async function confirmOTP(otp, tnxId) {
    uri = "auth/public/confirmOTP";
    body = { otp: otp, tnxId: tnxId};

    response, code = await cowinAPI(uri, 'POST', body);

    return response, code;

}

async function getStates() {
    uri = "admin/location/states";

    response, code = await cowinAPI(uri);

    return response, code;

}

async function getDistricts(stateid) {
    uri = "admin/location/districts/" + stateid;

    response, code = await cowinAPI(uri);

    return response, code;

}

async function findByPin(pincode, date) {
    
    uri = `appointment/sessions/public/${showCalendar ? 'calendarByPin' : 'findByPin'}?pincode=${pincode}&date=${date}`;

    response, code = await cowinAPI(uri);

    return response, code;

}

async function findByDistrict(district_id, date, showCalendar = false) {
    
    uri = `appointment/sessions/public/${showCalendar ? 'calendarByDistrict' : 'findByDistrict'}?district_id=${district_id}&date=${date}`;

    response, code = await cowinAPI(uri);

    return response, code;

}


async function findAvailableSlots (district_id, date, filters, expandDates = false) {

    response, code = await findByDistrict(district_id, date, true);

    return response;


}

