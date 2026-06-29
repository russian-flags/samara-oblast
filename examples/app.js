import { settlements } from "@russian-flags/samara-oblast";
import chapaevskFlagUrl from "@russian-flags/samara-oblast/flags/chapaevsk.svg";
import kinelFlagUrl from "@russian-flags/samara-oblast/flags/kinel.svg";
import neftegorskFlagUrl from "@russian-flags/samara-oblast/flags/neftegorsk.svg";
import novokuybyshevskFlagUrl from "@russian-flags/samara-oblast/flags/novokuybyshevsk.svg";
import oktyabrskFlagUrl from "@russian-flags/samara-oblast/flags/oktyabrsk.svg";
import otradnyyFlagUrl from "@russian-flags/samara-oblast/flags/otradnyy.svg";
import pohvistnevoFlagUrl from "@russian-flags/samara-oblast/flags/pohvistnevo.svg";
import samaraFlagUrl from "@russian-flags/samara-oblast/flags/samara.svg";
import syzranFlagUrl from "@russian-flags/samara-oblast/flags/syzran.svg";
import tolyattiFlagUrl from "@russian-flags/samara-oblast/flags/tolyatti.svg";
import zhigulevskFlagUrl from "@russian-flags/samara-oblast/flags/zhigulevsk.svg";

function requiredNode(selector) {
  const node = document.querySelector(selector);
  if (!node) {
    throw new Error(`Example DOM is missing required node: ${selector}`);
  }
  return node;
}

const list = requiredNode("#flagsList");
const summary = requiredNode("#summary");
const flagModal = requiredNode("#flagModal");
const flagModalTitle = requiredNode("#flagModalTitle");
const flagModalImage = requiredNode("#flagModalImage");
const flagModalClose = requiredNode(".flag-modal__close");
const nameCollator = new Intl.Collator("ru");
const flagUrls = Object.freeze({
  chapaevsk: chapaevskFlagUrl,
  kinel: kinelFlagUrl,
  neftegorsk: neftegorskFlagUrl,
  novokuybyshevsk: novokuybyshevskFlagUrl,
  oktyabrsk: oktyabrskFlagUrl,
  otradnyy: otradnyyFlagUrl,
  pohvistnevo: pohvistnevoFlagUrl,
  samara: samaraFlagUrl,
  syzran: syzranFlagUrl,
  tolyatti: tolyattiFlagUrl,
  zhigulevsk: zhigulevskFlagUrl,
});

function sortedSettlements() {
  return [...settlements].sort((left, right) => nameCollator.compare(left.nameRu, right.nameRu));
}

function assetUrl(settlement) {
  return flagUrls[settlement.slug];
}

function makeCell(className, children) {
  const cell = document.createElement("td");
  if (className) {
    cell.className = className;
  }
  cell.append(...children);
  return cell;
}

function makePlaceCell(settlement) {
  const name = document.createElement("strong");
  name.textContent = settlement.nameRu;
  const english = document.createElement("span");
  english.textContent = settlement.nameEn;
  return makeCell("place", [name, english]);
}

function makeIdentifierCell(settlement) {
  const code = document.createElement("strong");
  code.textContent = settlement.code;
  const slug = document.createElement("span");
  slug.textContent = settlement.slug;
  return makeCell("identifier", [code, slug]);
}

function makeFlagCell(settlement) {
  const frame = document.createElement("button");
  frame.className = "flag-frame";
  frame.type = "button";
  frame.dataset.kind = "flag";

  const image = document.createElement("img");
  image.src = assetUrl(settlement);
  image.alt = `Флаг ${settlement.nameRu}`;
  image.loading = "lazy";
  image.decoding = "async";

  image.addEventListener("error", () => {
    frame.classList.add("load-error");
    frame.replaceChildren("не отображается");
  }, { once: true });

  frame.append(image);
  frame.addEventListener("click", () => openFlagModal(settlement));
  return makeCell("flag-cell", [frame]);
}

function makeFormatCell(settlement) {
  const extension = document.createElement("strong");
  extension.textContent = "SVG";
  const details = document.createElement("span");
  details.textContent = `@russian-flags/samara-oblast/flags/${settlement.slug}.svg`;
  details.title = details.textContent;
  return makeCell("format", [extension, details]);
}

function makeRow(settlement) {
  const row = document.createElement("tr");
  row.dataset.slug = settlement.slug;
  row.append(
    makePlaceCell(settlement),
    makeIdentifierCell(settlement),
    makeFlagCell(settlement),
    makeFormatCell(settlement)
  );
  return row;
}

function updateSummary() {
  summary.textContent = `${settlements.length} городов, ${settlements.length} SVG из npm-пакета`;
}

function openFlagModal(settlement) {
  flagModalTitle.textContent = settlement.nameRu;
  flagModalImage.src = assetUrl(settlement);
  flagModalImage.alt = `Флаг ${settlement.nameRu}`;
  if (typeof flagModal.showModal === "function") {
    flagModal.showModal();
  } else {
    flagModal.setAttribute("open", "");
  }
}

function render() {
  list.replaceChildren(...sortedSettlements().map(makeRow));
  updateSummary();
}

flagModalClose.addEventListener("click", () => {
  flagModal.close();
});

flagModal.addEventListener("click", (event) => {
  if (event.target === flagModal) {
    flagModal.close();
  }
});

render();
