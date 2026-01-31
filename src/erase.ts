export function eraseColumns(creditTable: HTMLTableElement) {
  // 各行 (tr) が3つの td を持つようにする
  const rows = Array.from(
    creditTable.querySelectorAll("tr"),
  ) as HTMLTableRowElement[];
  for (const row of rows) {
    row.style.backgroundColor = "";
    while (row.children.length > 3) {
      const lastChild = row.lastElementChild;
      if (lastChild) {
        row.removeChild(lastChild);
      } else {
        break;
      }
    }
  }
}
