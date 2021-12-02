export default function epRange(episodeRange) {
  const episodes = episodeRange.split("-");
  const range = [];
  for (let i = episodes[0]; i <= episodes[1]; i++) {
    if (!i.toString().startsWith("0")) {
      range.push("0" + i);
    }
  }
  range.push(episodes[0]);
  return range.sort();
}
