const expect = require('expect');

const {generateMessage} = require('./message');

describe('generate message', () => {

  it('should generate message', () => {
    const from = 'javi';
    const text = 'kedise';

    const res = generateMessage(from, text);

    expect(res.createdAt).toBeA('number');
    // expect(res.message).toInclude({from: from});
  });
});