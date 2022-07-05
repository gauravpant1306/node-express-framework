const dotenv=require('dotenv');
dotenv.config();

const getInsurerData=process.env.GOOGLE_API_BASE_URL+"AKfycbwjO5zlV2HxSHp32phg-0dNvb2Bf9ZLXrce8jvmlFhBaFlyH_0w7Dcg5MQp5qonoYRZHg/exec"

const getPolicyCalculationAnalysis=process.env.GOOGLE_API_BASE_URL+"AKfycby9BCFSI05A3gR98nTT-wM_L3kXwF1nMPgg3hAMUm3SsyFn4QfZGiHluNaxIfBzD5Wp4g/exec"

module.exports={
    getInsurerData,
    getPolicyCalculationAnalysis
}