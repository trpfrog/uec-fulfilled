const COMPLETED_BACKGROUND_COLOR = "#d8ed7b";
const COMPLETED_HOVER_BACKGROUND_COLOR = "#eef9bf";

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
      row.style.backgroundColor = COMPLETED_BACKGROUND_COLOR;

      // 学務情報システムでは onmouseover / onmouseout で背景色が上書きされるため、これらをさらに上書き
      const existingOnMouseOver = row.onmouseover;
      const existingOnMouseOut = row.onmouseout;
      row.onmouseover = (event) => {
        existingOnMouseOver?.call(row, event);
        row.style.setProperty(
          "background-color",
          COMPLETED_HOVER_BACKGROUND_COLOR,
          "important",
        );
      };
      row.onmouseout = (event) => {
        existingOnMouseOut?.call(row, event);
        row.style.setProperty(
          "background-color",
          COMPLETED_BACKGROUND_COLOR,
          "important",
        );
      };

      addDataColumn(row, creditsLeft > -0.1 ? "✔︎" : `✔︎ (+${-creditsLeft})`);
    } else {
      addDataColumn(row, creditsLeft.toString());
    }
  }
}
