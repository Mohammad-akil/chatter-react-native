import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// because of bad doucumentation in dayjs it's needed to do like this for now
function transformDayJSString(str: string) {
  if (str.includes('a few seconds')) return '1 second';
  if (str.includes('a minute')) return '1 minute';
  if (str.includes('an hour')) return '1 hour';
  if (str.includes('a day')) return '1 day';
  if (str.includes('a month')) return '1 month';
  if (str.includes('a year')) return '1 year';

  return str;
}

export function getTimeTo(date: string, longFormat?: boolean) {
  const timeTo = dayjs(new Date()).to(date, true);

  let timeToString = timeTo;
  if (!longFormat) {
    timeToString = transformDayJSString(timeToString);
  }
  const splitedTimeTo = timeToString.split(' ');
  return splitedTimeTo[0] + splitedTimeTo[1][0];
}

export function getTimeFrom(date: string, longFormat?: boolean) {
  const timeFrom = dayjs(new Date()).from(date, true);
  let timeFromString = timeFrom;
  if (!longFormat) {
    timeFromString = transformDayJSString(timeFromString);
  }
  const splitedTimeFrom = timeFromString.split(' ');
  return splitedTimeFrom[0] + splitedTimeFrom[1][0] + ' ago';
}
