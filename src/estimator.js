/* eslint-disable max-len */

const impact = {};
const severeImpact = {};

const currentlyInfectedEstimate = (data) => {
  // destructure reported cases from input data
  const { reportedCases } = data;

  // calculate currently infected individuals for impact object
  impact.currentlyInfected = reportedCases * 10;

  // calculate projected number of infected individuals after 30 days for impact object
  impact.infectionsByRequestedTime = (impact.currentlyInfected * (2 ** 10));

  // calculate currently infected individuals for severe impact object
  severeImpact.currentlyInfected = reportedCases * 50;

  // calculate projected number of infected individuals after 30 days for severe impact object
  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * (2 ** 10);
};

const severeCasesByRequestedTime = (data) => {
  // destructure requested time from input data
  const { timeToElapse } = data;

  const powerFactor = Math.round(timeToElapse / 3);

  // calculate cases by requested time
  impact.severeCasesByRequestedTime = Math.round((15 / 100) * impact.currentlyInfected * (2 ** powerFactor));

  // calculate cases by requested time
  // eslint-disable-next-line max-len
  severeImpact.severeCasesByRequestedTime = Math.round((15 / 100) * (severeImpact.currentlyInfected * (2 ** powerFactor)));
};

const hospitalBedsByRequestedTime = (data) => {
  const { totalHospitalBeds } = data;

  // available beds based on 35% deficit
  const availableBeds = (35 / 100) * totalHospitalBeds;

  // available beds after severe cases are admitted
  impact.hospitalBedsByRequestedTime = Math.round(availableBeds - impact.severeCasesByRequestedTime);

  // available beds after severe cases are admitted
  // eslint-disable-next-line max-len
  severeImpact.hospitalBedsByRequestedTime = Math.round(availableBeds - severeImpact.severeCasesByRequestedTime);
};

const casesForICUByRequestedTime = () => {
  // cases for ICU
  impact.casesForICUByRequestedTime = Math.round(impact.severeCasesByRequestedTime * (5 / 100));

  // cases for ICU
  severeImpact.casesForICUByRequestedTime = Math.round(severeImpact.severeCasesByRequestedTime * (5 / 100));
};

const casesForVentilatorsByRequestedTime = () => {
  // cases for ICU
  impact.casesForVentilatorsByRequestedTime = Math.round(impact.severeCasesByRequestedTime * (2 / 100));

  // cases for ICU
  // eslint-disable-next-line max-len
  severeImpact.casesForVentilatorsByRequestedTime = Math.round(severeImpact.severeCasesByRequestedTime * (2 / 100));
};

const dollarsInFlight = (data) => {
  // eslint-disable-next-line no-unused-vars
  const { region } = data;
  const { timeToElapse } = data;

  // how much money the economy is likely to lose over the said period.
  impact.dollarsInFlight = Math.round((impact.infectionsByRequestedTime * region.avgDailyIncomePopulation) * region.avgDailyIncomeInUSD * timeToElapse);

  severeImpact.dollarsInFlight = Math.round((severeImpact.infectionsByRequestedTime * region.avgDailyIncomePopulation) * region.avgDailyIncomeInUSD * timeToElapse);
};

const covid19ImpactEstimator = (data) => {
  const estimator = () => {
    currentlyInfectedEstimate(data);
    severeCasesByRequestedTime(data);
    hospitalBedsByRequestedTime(data);
    casesForICUByRequestedTime(data);
    casesForVentilatorsByRequestedTime();
    dollarsInFlight(data);
  };

  estimator(data);

  return ({
    data,
    impact,
    severeImpact
  });
};

export default covid19ImpactEstimator;
