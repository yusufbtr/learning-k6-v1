import http from 'k6/http';
import { check, sleep } from 'k6';
// This will export to HTML as filename "result.html" AND also stdout using the text summary
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
    stages: [
        { duration: '2s', target: 100 },
        { duration: '8s', target: 400 }
    ],
    threshold: {
        'http_req_duration': ['p(99)<1500'], // 99% of request must be complete below 1,5s
        // 'logged in successfully': ['p(99)<1500'] // 99% of request must be complete below 1,5s
    }
};

const BASE_URL = 'https://test-api.k6.io';
const USERNAME = 'TestUser'
const PASSWORD = 'SuperCroc2020'

export default () => {
    const loginRes = http.post(`${BASE_URL}/auth/token/login/`, {
        username: USERNAME,
        password: PASSWORD,
    });

    console.log(loginRes)
    check(loginRes, {
        'logged in successfully': (resp) => resp.json('access') !== '',
    });
    check(loginRes, {
        'status was 200': (resp) => resp.status == 200
    });
    sleep(1);
};

export function handleSummary(data) {
  return {
    "result-login.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}