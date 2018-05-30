const nock = require('nock');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');
const expect = chai.expect;
const convertBTC = require('../src/ConvertBTC');
const chalk = require('chalk');

chai.use(sinonChai);

describe('ConvertBTC', () => {

  let consoleStub;

  const responseMock = {
    "price": 7345.02,
    "success": true,
    "time": "2018-05-30 15:44:00"
  };

  beforeEach(() => {
    consoleStub = sinon.stub(console, 'info');
  });

  afterEach(() => {
    consoleStub.restore();
  });

  it('should use currency USD and 1 as amount default', async () => {
    nock('https://apiv2.bitcoinaverage.com')
      .get('/convert/global')
      .query({ from: 'BTC', to: 'USD', amount: 1 })
      .reply(200, responseMock);

    await convertBTC();
    expect(consoleStub).to.have.been.calledWith(`${chalk.green('1')} BTC to ${chalk.cyan('USD')} = ${chalk.yellow('7345.02')}`);

  });

  it('should use currency USD and 10 as amount', async () => {
    nock('https://apiv2.bitcoinaverage.com')
      .get('/convert/global')
      .query({ from: 'BTC', to: 'USD', amount: 10 })
      .reply(200, responseMock);

    await convertBTC('USD', 10);
    expect(consoleStub).to.have.been.calledWith(`${chalk.green('10')} BTC to ${chalk.cyan('USD')} = ${chalk.yellow('7345.02')}`);

  });

  it('should use currency BRL and 1 as amount default', async () => {
    nock('https://apiv2.bitcoinaverage.com')
      .get('/convert/global')
      .query({ from: 'BTC', to: 'BRL', amount: 1 })
      .reply(200, responseMock);

    await convertBTC('BRL');
    expect(consoleStub).to.have.been.calledWith(`${chalk.green('1')} BTC to ${chalk.cyan('BRL')} = ${chalk.yellow('7345.02')}`);

  });

  it('should message user when api reply with an error', async () => {
    nock('https://apiv2.bitcoinaverage.com')
      .get('/convert/global')
      .query({ from: 'BTC', to: 'BRL', amount: 1 })
      .replyWithError('Error');

    await convertBTC('BRL');
    expect(consoleStub).to.have.been.calledWith(chalk.red('Something went wrong in the API. Try in a few minutes.'));

  });

});
