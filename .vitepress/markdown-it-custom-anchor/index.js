const anchorMatch = /^.+(\s*\{#([a-z0-9\-_]+?)\}\s*)$/

const removeAnchorFromTitle = (oldTitle) => {
  const match = anchorMatch.exec(oldTitle);
  return match ? oldTitle.replace(match[1], '').trim() : oldTitle;
}

module.exports = function plugin(md) {
  const oldTitle = md.renderer.rules.text;
  md.renderer.rules.text = (tokens, idx, options, env, slf) => {
    let titleAndId = oldTitle(tokens, idx, options, env, slf);
    return removeAnchorFromTitle(titleAndId)
  };

  const oldHead = md.renderer.rules.heading_open;
  md.renderer.rules.heading_open = (tokens, idx, options, env, slf) => {
    let head = oldHead(tokens, idx, options, env, slf);
    const data = md.__data;
    const headers = data.headers || (data.headers = []);
    headers.forEach(element => {
      element.title = removeAnchorFromTitle(element.title)
    });
    return head
  }
};