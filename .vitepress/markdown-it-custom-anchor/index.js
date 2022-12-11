const anchorMatch = /^.+(\s*\{#([a-z0-9\-_]+?)\}\s*)$/;

const removeAnchorFromTitle = (oldTitle) => {
  const match = anchorMatch.exec(oldTitle);
  return match ? oldTitle.replace(match[1], '').trim() : oldTitle;
}

export default function(md) {
  const oldTitle = md.renderer.rules.text;
  md.renderer.rules.text = (tokens, idx, options, env, slf) => {
    const titleAndId = oldTitle(tokens, idx, options, env, slf);
    return removeAnchorFromTitle(titleAndId);
  };
};
