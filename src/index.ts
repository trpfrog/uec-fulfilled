import { eraseColumns } from "./erase";
import { writeColumn } from "./write";

// 学務情報システムのマウスイベントハンドラーを無効化
function disableMouseHandlers() {
  const handlers = [
    "TABLEMouseOut",
    "TABLEMouseOver",
    "TABLEMouseOutC",
    "TABLEMouseOverC",
    "TRMouseOut",
    "TRMouseOver",
    "TRMouseOutC",
    "TRMouseOverC",
    "TDMouseOut",
    "TDMouseOver",
    "TDMouseOutC",
    "TDMouseOverC",
  ] as const;

  for (const handler of handlers) {
    // @ts-expect-error - 既存のグローバル関数を上書き
    window[handler] = () => {};
  }
}

function getCreditTable(): HTMLTableElement {
  const tables = [
    // 現在学務情報システムには frameset の中にテーブルがあるので頑張って持ってくる
    ...Array.from(document.querySelectorAll("frame")).flatMap((frame) =>
      Array.from(frame.contentDocument?.querySelectorAll("table") || []),
    ),
    // 学務情報システムが正気を取り戻して frameset をやめたとき用
    ...Array.from(document.querySelectorAll("table") || []),
  ];

  // tr に 区分, 所要単位, 修得単位 の含まれているテーブルを取得
  for (const table of tables) {
    const row = table.querySelector("tr")?.innerHTML;
    if (["区分", "所要単位", "修得単位"].every((s) => row?.includes(s))) {
      return table;
    }
  }

  throw "成績表が見つかりませんでした。";
}

function isAlreadyAdded(table: HTMLTableElement) {
  return Array.from(table.querySelectorAll("tr > *")).some(
    (td) => td.textContent === "残り単位数",
  );
}

function main() {
  const url = new URL(location.href);
  if (
    url.hostname && // in development, url.hostname is ""
    url.hostname !== "campusweb.office.uec.ac.jp" &&
    url.hostname !== "trpfrog.github.io"
  ) {
    alert("このブックマークレットは学務情報システム上でのみ使用できます。");
    return;
  }

  // 学務情報システムのマウスイベントハンドラーを無効化
  disableMouseHandlers();

  try {
    const creditTable = getCreditTable();
    if (isAlreadyAdded(creditTable)) {
      eraseColumns(creditTable);
    } else {
      writeColumn(creditTable);
    }
  } catch (error) {
    alert(error);
    return;
  }
}

main();
document.currentScript?.remove();
