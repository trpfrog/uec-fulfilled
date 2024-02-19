import { eraseColumns } from "./erase";
import { writeColumn } from "./write";

function getCreditTable(): HTMLTableElement {
	const frames = Array.from(document.querySelectorAll("frame"));
	for (const frame of frames) {
		const tables = Array.from(
			frame.contentDocument?.querySelectorAll("table") || [],
		) as HTMLTableElement[];

		// tr に 区分, 所要単位, 修得単位 の含まれているテーブルを取得
		for (const table of tables) {
			const row = table.querySelector("tr")?.innerHTML;
			if (["区分", "所要単位", "修得単位"].every((s) => row?.includes(s))) {
				return table;
			}
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
	if (url.hostname !== "campusweb.office.uec.ac.jp") {
		alert("このブックマークレットは学務情報システム上でのみ使用できます。");
		return;
	}
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
