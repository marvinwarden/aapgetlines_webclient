export function epRange(episodeRange) {
  const episodes = episodeRange.split("-");
  const range = [];
  if (episodes.length > 1) {
  for (let i = parseInt(episodes[0]); i <= parseInt(episodes[1]); i++) {
    if (i < 10) {
      range.push("0" + i.toString());
    } else {
      range.push(i.toString());
    }
  }
  } else {
    if (episodes[0].length < 2) {
    range.push("0" + episodes[0]);
  } else {
    range.push(episodes[0]);
  }
  }
  return range;
}

/**
 * Generates a sequence of integers from `start` to `end`
 * @param {Int} start start of integer sequence
 * @param {Int} end end of integer sequence
 */
export function generateSequence(start, end) {
  let s = start;
  let e = end;
  let sequence = [];

  if (start > end) {
    s = end;
    e = start;
  }

  for (; s <= e; s++) {
    sequence.push(s);
  }

  return sequence;
}

/**
 * Takes an array if strings, that potentially contains string values that denote a range of episodes.
 * Splits string values in `ranges` by `delimiter` and generates a array containing a sequence of
 * integers based on start and end values of split string
 * @param {String[]} ranges array of strings containing episode strings
 * @param {String} delimiter string to use as a delimiter for splitting strings in ranges
 */
export function epRangesToSequences(ranges, delimiter = ':') {
  let all_sequences = [];
  const re_range = new RegExp(`\\d+${delimiter}\\d+`, 'gi');
  const re_digits = new RegExp('\\d+');

  for (const e of ranges) {
    let sequence = [];
    if (re_range.test(e)) {
      const start_end = e.split(delimiter);
      const sequence = generateSequence(parseInt(start_end[0]), parseInt(start_end[1]));
      all_sequences = all_sequences.concat(
        sequence.filter((c) => { return c >= 0 })
      );
    } else if (re_digits.test(e)){
      all_sequences.push(parseInt(e));
    }
  }

  return [...new Set(all_sequences)];
}
