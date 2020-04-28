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
      const workLog = new ParsedWorkLog('@2019/03/01~@2019/03/02', ['2019/03/01', '2019/03/02'], ['sealights'], '1d');

      expect(workLog.validate().valid).toBeFalsy();
      expect(workLog.validate().errors).toEqual(['tags must include either #internal or #projects']);
    });

    it('should be invalid when both #project and #internal tag present', function () {
      const workLog = new ParsedWorkLog('@2019/03/01~@2019/03/02', ['2019/03/01', '2019/03/02'], ['projects', 'internal'], '1d');

      expect(workLog.validate().valid).toBeFalsy();
      expect(workLog.validate().errors).toEqual(['#internal and #projects tags cannot be used together']);
    });

    it('should be invalid when no workload', function () {
      const workLog = new ParsedWorkLog('@2019/03/01~@2019/03/02', ['2019/03/01', '2019/03/02'], ['projects', 'sealights'], undefined);

      expect(workLog.validate().valid).toBeFalsy();
      expect(workLog.validate().errors).toEqual(['workload was not provided']);
    });

    it('should be invalid if #projects is the only tag', function () {
      const workLog = new ParsedWorkLog('@2019/03/01~@2019/03/02', ['2019/03/01', '2019/03/02'], ['projects'], '1d');

      expect(workLog.validate().valid).toBeFalsy();
      expect(workLog.validate().errors).toEqual(['missing specific project tag: #projects #your-project-name']);
    });

    it('should be valid if #project and another tag present', function () {
      const workLog = new ParsedWorkLog('@2019/03/01~@2019/03/02', ['2019/03/01', '2019/03/02'], ['projects', 'best-project-ever'], '1d');

      expect(workLog.validate().valid).toBeTruthy();
      expect(workLog.validate().errors).toEqual([]);
    });

    it('should be valid if #internal is the only tag', function () {
      const workLog = new ParsedWorkLog('@2019/03/01~@2019/03/02', ['2019/03/01', '2019/03/02'], ['internal'], '1d');

      expect(workLog.validate().valid).toBeTruthy();
      expect(workLog.validate().errors).toEqual([]);
    });
  });

});
