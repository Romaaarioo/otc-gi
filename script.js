(() => {
  "use strict";

  const CONFLICT_URL = "https://cdncl.goinvest.ru/files/docs/64-uvedomlenie_o_konflikte_interesov.pdf";
  const products = {
    sandbox: {
      name: "Sandbox",
      price: 1024,
      rubleText: [
        "Прошу купить акции класса N (Shares of Class N) AGS GV Pre-Ipo XIII (ISIN KZQ000001718)",
        "Место заключения сделки – внебиржевой рынок",
        "Количество акций – максимально доступное (без дробных частей), исходя из Суммы сделки",
        "Цена одной акции – текущая",
        "Сумма сделки – {amount} рублей",
        "Срок действия поручения по {expiry}",
        "Прошу считать поручение исполненным при покупке ценных бумаг на объем не менее чем на 90% от указанной в поручении Суммы сделки",
        `С информацией о конфликте интересов ознакомлен (${CONFLICT_URL})`,
      ],
      dollarText: [
        "Прошу купить акции класса N (Shares of Class N) AGS GV Pre-Ipo XIII (ISIN KZQ000001718)",
        "Место заключения сделки – внебиржевой рынок",
        "Количество ценных бумаг – {quantity}",
        "Цена одной ценной бумаги – 1024",
        "Валюта платежа – USD",
        "Место хранения при покупке – по усмотрению Брокера, кроме российских расчетных депозитариев",
        "Срок действия поручения – по {expiry}",
        `С информацией о конфликте интересов ознакомлен (${CONFLICT_URL})`,
      ],
    },
    skild: {
      name: "Skild AI",
      price: 966,
      rubleText: [
        "Прошу купить акции класса H (Shares of Class H) AGS GV Pre-IPO VIII (KZQ000000991)",
        "Место заключения сделки – внебиржевой рынок",
        "Количество акций – максимально доступное (без дробных частей), исходя из Суммы сделки",
        "Цена одной акции – текущая",
        "Сумма сделки – {amount} рублей",
        "Срок действия поручения по {expiry}",
        "Прошу считать поручение исполненным при покупке ценных бумаг на объем не менее чем на 90% от указанной в поручении Суммы сделки",
        `С информацией о конфликте интересов ознакомлен (${CONFLICT_URL})`,
      ],
      dollarText: [
        "Прошу купить акции класса H (Shares of Class H) AGS GV Pre-IPO VIII (KZQ000000991)",
        "Место заключения сделки – внебиржевой рынок",
        "Количество ценных бумаг – {quantity}",
        "Цена одной ценной бумаги – 966",
        "Валюта платежа – USD",
        "Место хранения при покупке – по усмотрению Брокера, кроме российских расчетных депозитариев",
        "Срок действия поручения – по {expiry}",
        `С информацией о конфликте интересов ознакомлен (${CONFLICT_URL})`,
      ],
    },
    titans: {
      name: "Titans",
      rubleText: [
        "Прошу купить акции класса D (Shares of Class D) инвестиционного фонда AGS Inception Fund Open-Ended Investment Company Limited (ISIN KZQ000001114) под управлением Abylai Global Solutions Ltd.",
        "Место заключения сделки – внебиржевой рынок",
        "Количество акций – максимально доступное (без дробных частей), исходя из Суммы сделки",
        "Цена одной акции – текущая",
        "Сумма сделки – {amount} рублей",
        "Срок действия поручения по {expiry}",
        "Прошу считать поручение исполненным при покупке ценных бумаг на объем не менее чем на 90% от указанной в поручении Суммы сделки",
        `С информацией о конфликте интересов ознакомлен (${CONFLICT_URL})`,
      ],
      dollarText: [
        "Прошу купить акции класса D (Shares of Class D) инвестиционного фонда AGS Inception Fund Open-Ended Investment Company Limited (ISIN KZQ000001114) под управлением Abylai Global Solutions Ltd.",
        "Место заключения сделки – внебиржевой рынок",
        "Количество акций – максимально доступное (без дробных частей), исходя из Суммы сделки",
        "Цена одной акции – текущая",
        "Сумма сделки – {amount} долларов США",
        "Срок действия поручения по {expiry}",
        "Прошу считать поручение исполненным при покупке ценных бумаг на объем не менее чем на 90% от указанной в поручении Суммы сделки",
        `С информацией о конфликте интересов ознакомлен (${CONFLICT_URL})`,
      ],
    },
  };

  const amountInput = document.querySelector("#amount");
  const dateInput = document.querySelector("#order-date");
  const draftText = document.querySelector("#draft-text");
  const copyButton = document.querySelector("#copy-button");
  const amountHint = document.querySelector("#amount-hint");
  const expiryDate = document.querySelector("#expiry-date");
  const currencySwitch = document.querySelector("#currency-switch");
  const currencyNote = document.querySelector("#currency-note");
  const customRateWrap = document.querySelector("#custom-rate-wrap");
  const customRateInput = document.querySelector("#custom-rate");
  const toast = document.querySelector("#toast");

  let selectedProduct = "sandbox";
  let selectedCurrency = "RUB";
  let selectedCommission = { rate: 0, name: "0%" };

  const pad = (value) => String(value).padStart(2, "0");
  const toISODate = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const parseISODate = (value) => {
    if (!value) return new Date();
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  };
  const formatDate = (date) => `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;

  function addBusinessDays(start, days) {
    const result = new Date(start);
    let added = 0;
    while (added < days) {
      result.setDate(result.getDate() + 1);
      if (result.getDay() !== 0 && result.getDay() !== 6) added += 1;
    }
    return result;
  }

  function getExpiry() {
    const start = parseISODate(dateInput.value);
    if (selectedProduct === "conversion") return addBusinessDays(start, 4);
    start.setDate(start.getDate() + 60);
    return start;
  }

  function parseAmount(value) {
    let normalized = value.toLowerCase().trim().replace(/\s+/g, "").replace(/[₽$]/g, "");
    if (!normalized) return null;
    let multiplier = 1;
    const suffix = normalized.match(/(млрд|миллиард(?:а|ов)?|млн|миллион(?:а|ов)?|кк|тыс(?:яч[аи]?)?|к|m|k)$/i);
    if (suffix) {
      const key = suffix[1];
      if (/^(млрд|миллиард|mrd|b)$/i.test(key)) multiplier = 1_000_000_000;
      else if (/^(млн|миллион|кк|m)$/i.test(key)) multiplier = 1_000_000;
      else multiplier = 1_000;
      normalized = normalized.slice(0, -key.length);
    }
    normalized = normalized.replace(",", ".");
    if (!/^\d+(?:\.\d+)?$/.test(normalized)) return null;
    const amount = Number(normalized) * multiplier;
    return Number.isFinite(amount) && amount > 0 ? amount : null;
  }

  function formatNumber(number) {
    return number.toLocaleString("ru-RU", { maximumFractionDigits: 2 }).replace(/\u00a0|\u202f/g, " ");
  }

  function formatDraftAmount(number) {
    return String(Number(number.toFixed(2)));
  }

  function commissionRate() {
    if (selectedCommission.rate !== "custom") return selectedCommission.rate;
    const value = Number(String(customRateInput.value).replace(",", "."));
    return Number.isFinite(value) && value >= 0 && value <= 100 ? value : null;
  }

  function render() {
    const expiry = getExpiry();
    expiryDate.textContent = `по ${formatDate(expiry)}`;
    const inputAmount = parseAmount(amountInput.value);
    const rate = commissionRate();
    const product = products[selectedProduct];

    if (selectedProduct === "conversion") {
      currencyNote.textContent = "Для конвертации валюта и комиссия фиксированы";
    } else {
      currencyNote.textContent = selectedCurrency === "RUB"
        ? "Сумма поручения за вычетом комиссии"
        : "Количество бумаг рассчитано по цене продукта";
    }

    if (inputAmount === null) {
      draftText.textContent = amountInput.value.trim()
        ? "Не удалось распознать сумму. Попробуйте, например: 5к, 5кк, 5 млн или 5 000 000."
        : "Укажите сумму, чтобы сформировать поручение.";
      amountHint.textContent = "Можно ввести 5к, 5кк, 5 млн или 5 000 000";
      copyButton.disabled = true;
      return;
    }

    const expiryString = formatDate(expiry);
    let lines;
    if (selectedProduct === "conversion") {
      lines = [
        "Прошу продать USD",
        `Сумма ${inputAmount}`,
        "Валюта платежа – RUB",
        "Место заключения – внебиржевой рынок",
        "Цена за единицу – текущая",
        `Срок действия поручения: по ${expiryString}`,
      ];
    } else if (rate === null) {
      draftText.textContent = "Укажите корректный процент комиссии от 0 до 100.";
      amountHint.textContent = `Распознано: ${formatNumber(inputAmount)}`;
      copyButton.disabled = true;
      return;
    } else if (selectedCurrency === "RUB") {
      const netAmount = Math.max(0, Math.round(inputAmount * (1 - rate / 100) * 100) / 100);
      lines = product.rubleText.map((line) => line
        .replaceAll("{amount}", formatDraftAmount(netAmount))
        .replaceAll("{expiry}", expiryString));
      amountHint.textContent = `Распознано: ${formatNumber(inputAmount)} → ${formatNumber(netAmount)} руб. после комиссии ${String(rate).replace(".", ",")}%`;
    } else {
      const quantity = Math.floor(inputAmount / product.price);
      if (selectedProduct === "titans") {
        lines = product.dollarText.map((line) => line
          .replaceAll("{amount}", String(inputAmount))
          .replaceAll("{expiry}", expiryString));
        amountHint.textContent = `Распознано: ${formatNumber(inputAmount)} USD`;
      } else {
        lines = product.dollarText.map((line) => line
          .replaceAll("{quantity}", String(quantity))
          .replaceAll("{expiry}", expiryString));
        amountHint.textContent = `Распознано: ${formatNumber(inputAmount)} → ${quantity} бумаг по ${product.price} USD`;
      }
    }
    draftText.textContent = lines.join("\n");
    copyButton.disabled = false;
  }

  document.querySelectorAll(".product-choice").forEach((button) => {
    button.addEventListener("click", () => {
      selectedProduct = button.dataset.product;
      document.querySelectorAll(".product-choice").forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });
      const isConversion = selectedProduct === "conversion";
      if (isConversion) {
        selectedCurrency = "USD";
        selectedCommission = { rate: 0, name: "0%" };
        customRateWrap.hidden = true;
        customRateInput.value = "";
        document.querySelectorAll(".commission-choice").forEach((item, index) => {
          item.setAttribute("aria-pressed", String(index === 0));
        });
      }
      currencySwitch.classList.toggle("currency-rub", selectedCurrency === "RUB");
      currencySwitch.classList.toggle("is-locked", isConversion);
      currencySwitch.querySelectorAll("button").forEach((item) => {
        item.setAttribute("aria-pressed", String(item.dataset.currency === selectedCurrency));
        item.disabled = isConversion;
      });
      document.querySelectorAll(".commission-choice").forEach((item, index) => {
        item.disabled = isConversion && index !== 0;
      });
      render();
    });
  });

  currencySwitch.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      if (selectedProduct === "conversion") return;
      selectedCurrency = button.dataset.currency;
      currencySwitch.classList.toggle("currency-rub", selectedCurrency === "RUB");
      currencySwitch.querySelectorAll("button").forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });
      render();
    });
  });

  document.querySelectorAll(".commission-choice").forEach((button) => {
    button.addEventListener("click", () => {
      if (selectedProduct === "conversion") return;
      selectedCommission = {
        rate: button.dataset.rate === "custom" ? "custom" : Number(button.dataset.rate),
        name: button.dataset.name,
      };
      document.querySelectorAll(".commission-choice").forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });
      customRateWrap.hidden = selectedCommission.rate !== "custom";
      if (selectedCommission.rate === "custom") customRateInput.focus();
      render();
    });
  });

  amountInput.addEventListener("input", render);
  customRateInput.addEventListener("input", render);
  dateInput.addEventListener("input", render);
  dateInput.addEventListener("change", render);
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(draftText.textContent);
      toast.textContent = "Текст поручения скопирован";
    } catch {
      const range = document.createRange();
      range.selectNodeContents(draftText);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      toast.textContent = "Выделите и скопируйте текст вручную";
    }
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2200);
  });

  dateInput.value = toISODate(new Date());
  currencySwitch.classList.add("currency-rub");
  render();
})();
