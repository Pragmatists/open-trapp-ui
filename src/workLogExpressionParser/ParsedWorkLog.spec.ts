import { ParsedWorkLog } from './ParsedWorkLog';

describe('ParsedWorkLog', () => {

  it('adds days to expression', () => {
    const workLog = ParsedWorkLog.empty();

    const newWorkLog = workLog.withDays(['2019/03/11']);

    expect(newWorkLog.expression).toEqual('@2019/03/11');
    expect(newWorkLog.days).toEqual(['2019/03/11']);
  });

  it('replaces day with different date', () => {
    const workLog = new ParsedWorkLog('@2019/03/01', ['2019/03/01'], [], undefined);

    const newWorkLog = workLog.withDays(['2019/03/11']);

    expect(newWorkLog.expression).toEqual('@2019/03/11');
    expect(newWorkLog.days).toEqual(['2019/03/11']);
  });

  it('replaces day with range', () => {
    const workLog = new ParsedWorkLog('@2019/03/01', ['2019/03/01'], [], undefined);

    const newWorkLog = workLog.withDays(['2019/03/11', '2019/03/12']);

    expect(newWorkLog.expression).toEqual('@2019/03/11~@2019/03/12');
    expect(newWorkLog.days).toEqual(['2019/03/11', '2019/03/12']);
  });

  it('replaces days range with single day', () => {
    const workLog = new ParsedWorkLog('@2019/03/01~@2019/03/02', ['2019/03/01', '2019/03/02'], [], undefined);

    const newWorkLog = workLog.withDays(['2019/03/11']);

    expect(newWorkLog.expression).toEqual('@2019/03/11');
    expect(newWorkLog.days).toEqual(['2019/03/11']);
  });

  it('replaces days range with different one', () => {
    const workLog = new ParsedWorkLog('@2019/03/01~@2019/03/02', ['2019/03/01', '2019/03/02'], [], undefined);

    const newWorkLog = workLog.withDays(['2019/03/11', '2019/03/12', '2019/03/13']);

    expect(newWorkLog.expression).toEqual('@2019/03/11~@2019/03/13');
    expect(newWorkLog.days).toEqual(['2019/03/11', '2019/03/12', '2019/03/13']);
  });

  describe('validation', () => {

    it('should be invalid when neither #project or #internal tag present', function () {
      const workLog = new ParsedWorkLog('@2019/03/01~@2019/03/02', ['2019/03/01', '2019/03/02'], ['sealights'], undefined);

      expect(workLog.validate().valid).toBeFalsy();
      expect(workLog.validate().errors).toContain('tags must include either #internal or #projects');
    });

    it('should be invalid when both #project and #internal tag present', function () {
      const workLog = new ParsedWorkLog('@2019/03/01~@2019/03/02', ['2019/03/01', '2019/03/02'], ['projects', 'internal'], undefined);

      expect(workLog.validate().valid).toBeFalsy();
      expect(workLog.validate().errors).toContain('#internal and #projects tags cannot be used together');
    });

    it('should be invalid when no workload', function () {
      const workLog = new ParsedWorkLog('@2019/03/01~@2019/03/02', ['2019/03/01', '2019/03/02'], ['projects', 'sealights'], undefined);

      expect(workLog.validate().valid).toBeFalsy();
      expect(workLog.validate().errors).toContain('workload was not provided');
    });

  });

});
