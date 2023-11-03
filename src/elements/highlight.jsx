import React from "react";

const Highlighted = (props) => {
  function colorWordInString(string, substring) {
    // based on a given substring, replace the style using a span.
    const words = string.split(" ");

    const styledWords = words.map((w) => {
      //if the word matches
      if (w === substring) {
        return `<span class="highlight">${w}</span>`;
      }
      //else
      return w;
    });

    const hightlightedTitle = styledWords.join(" ");
    return hightlightedTitle;
  }

  const _title = colorWordInString(props.string, props.sub);

  return <div dangerouslySetInnerHTML={{ __html: _title }}></div>;
};

export default Highlighted;
