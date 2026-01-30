function addHeaderColumn(table: HTMLTableElement, header: string) {
  const tr = table?.querySelector("tr");
  if ((tr?.children.length ?? 0) > 3) {
    throw "既に残り単位数の列が存在します。";
  }
  const th = document.createElement("th");
  th.innerText = header;
  th.className = "seiseki-head";
  th.style.textAlign = "center";
  th.style.paddingLeft = "5px";
  th.style.paddingRight = "5px";
  tr?.appendChild(th);
}

function addDataColumn(row: HTMLTableRowElement, data: string) {
  const td = document.createElement("td");
  td.textContent = data;
  td.style.textAlign = "center";
  row.appendChild(td);
}

function setHoverEffect(
  row: HTMLTableRowElement,
  defaultColor: string,
  hoverColor: string,
) {
  row.addEventListener("mouseenter", () => {
    row.style.setProperty("background-color", hoverColor, "important");
  });
  row.addEventListener("mouseleave", () => {
    row.style.setProperty("background-color", defaultColor, "important");
  });
}

export function writeColumn(creditTable: HTMLTableElement) {
  addHeaderColumn(creditTable, "残り単位数");

  const dataRows = Array.from(creditTable.querySelectorAll("tbody > tr")).slice(
    1,
  ) as HTMLTableRowElement[];
  for (const row of dataRows) {
    const required = parseFloat(row.children[1].textContent || "0");
    const acquired = parseFloat(row.children[2].textContent || "0");
    const creditsLeft = required - acquired;
    const isCompleted = creditsLeft <= 0;
    if (isCompleted) {
      row.style.backgroundColor = "#d8ed7b";
      setHoverEffect(row, "#d8ed7b", "#eef9bf");
      addDataColumn(row, creditsLeft > -0.1 ? "✔︎" : `✔︎ (+${-creditsLeft})`);
    } else {
      addDataColumn(row, creditsLeft.toString());
      setHoverEffect(row, "#00000008", "#ffffffb3");
    }
  }
}
