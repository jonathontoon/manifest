const matchTodoItem = (line) => line.match(/^(?<indentation>[\s]*)- \[(?<checked>[xX]?)[\s]?\](?<content> .*)*/);

export function updateNote(text, id) {
  if (!text) return "";

  return text
    .split("\n")
    .reduce(
      (acc, line) => {
        const [count, text] = acc;
        const todoItemMatch = matchTodoItem(line);
        if (!todoItemMatch) return [count, [...text, line]];
        if (count + 1 !== id) return [count + 1, [...text, line]];

        const parts = todoItemMatch.groups;
        const checked = !!parts.checked;
        const itemText = parts.content;
        const indentation = parts.indentation;
        const toggledLine = `${indentation}- [${
          checked ? " " : "x"
        }]${itemText}`;

        return [count + 1, [...text, toggledLine]];
      },
      [0, []]
    )[1]
    .join("\n");
}

export function compileNote(text) {
  if (!text) return "";

  let id = 0;

  return text.replace(/(^- \[([xX]?)[\s]?\] (.*)$[\n]?)+/gm, (match) => {
    const rows = match.trim().split("\n");
    const compiledRows = rows.map((row) => {
      const todoItemMatch = matchTodoItem(row);

      id++;

      const checked = !!todoItemMatch.groups.checked;
      const todoText = todoItemMatch.groups.content || "";

      return `<li><input${
        checked ? ' checked="" ' : " "
      }type="checkbox" data-checkbox-id="${id}">${todoText}</li>`;
    });
    const joinedRows = compiledRows.join("");

    return `<ul>${joinedRows}</ul>`;
  });
}
