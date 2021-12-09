export default function epRange(episodeRange) {
  const episodes = episodeRange.split("-");
  console.log("eprange", episodes)
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
