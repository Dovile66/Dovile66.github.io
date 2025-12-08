// Dovilė Greičiūtė – formos apdorojimas + realaus laiko validacija +
// telefono formatavimas + vidurkis + pop-up + neaktyvus Submit

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const resultBox = document.getElementById("form-result");

  const popup = document.getElementById("success-popup");
  const popupClose = document.getElementById("success-popup-close");

  if (!form || !resultBox) return;

  const firstNameInput = form["first-name"];
  const lastNameInput = form["last-name"];
  const emailInput = form["email"];
  const addressInput = form["address"];
  const phoneInput = form["phone"];
  const ratingDesignInput = form["rating-design"];
  const ratingExperienceInput = form["rating-experience"];
  const ratingRecommendInput = form["rating-recommend"];
  const submitBtn = form.querySelector('button[type="submit"]');

  if (submitBtn) submitBtn.disabled = true; // pradžioje neaktyvus

  // ---- Pagalbinės funkcijos klaidoms ----

  function getErrorElement(input) {
    let err = input.parentElement.querySelector(".field-error-text");
    if (!err) {
      err = document.createElement("div");
      err.className = "field-error-text";
      input.parentElement.appendChild(err);
    }
    return err;
  }

  function setFieldError(input, message) {
    const err = getErrorElement(input);
    input.classList.add("field-error");
    err.textContent = message;
  }

  function clearFieldError(input) {
    const err = getErrorElement(input);
    input.classList.remove("field-error");
    err.textContent = "";
  }

  // ---- Vardas / pavardė / el. paštas / adresas ----

  function validateFirstName() {
    const value = firstNameInput.value.trim();
    clearFieldError(firstNameInput);

    if (value === "") {
      setFieldError(firstNameInput, "Vardas yra privalomas.");
      return false;
    }

    const onlyLetters = /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž\s-]+$/.test(value);
    if (!onlyLetters) {
      setFieldError(firstNameInput, "Vardas turi būti sudarytas tik iš raidžių.");
      return false;
    }
    return true;
  }

  function validateLastName() {
    const value = lastNameInput.value.trim();
    clearFieldError(lastNameInput);

    if (value === "") {
      setFieldError(lastNameInput, "Pavardė yra privaloma.");
      return false;
    }

    const onlyLetters = /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž\s-]+$/.test(value);
    if (!onlyLetters) {
      setFieldError(lastNameInput, "Pavardė turi būti sudaryta tik iš raidžių.");
      return false;
    }
    return true;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    clearFieldError(emailInput);

    if (value === "") {
      setFieldError(emailInput, "El. paštas yra privalomas.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setFieldError(emailInput, "Neteisingas el. pašto formatas.");
      return false;
    }
    return true;
  }

  function validateAddress() {
    const value = addressInput.value.trim();
    clearFieldError(addressInput);

    if (value === "") {
      setFieldError(addressInput, "Adresas yra privalomas.");
      return false;
    }

    const hasLetter = /[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž]/.test(value);
    if (!hasLetter) {
      setFieldError(
        addressInput,
        "Adresas turi būti teksto pavidalo (ne tik skaičiai)."
      );
      return false;
    }

    return true;
  }

  // ---- 2. Telefono numerio formatavimas ir validacija ----

  function formatPhone() {
    let digits = phoneInput.value.replace(/\D/g, "");

    // jei įrašė 370 iš pradžių – nupjaunam, nes +370 pridedam patys
    if (digits.startsWith("370")) {
      digits = digits.slice(3);
    }

    // pirmas skaitmuo turi būti 6
    if (digits.length > 0 && digits[0] !== "6") {
      digits = "6" + digits.slice(1);
    }

    // paliekam max 8 skaitmenis (6 + dar 2 + 5)
    digits = digits.slice(0, 8);

    let formatted = "+370";

    if (digits.length > 0) {
      formatted += " " + digits[0]; // 6
      if (digits.length > 1) {
        formatted += digits.slice(1, 3); // du sekantys
      }
      if (digits.length > 3) {
        formatted += " " + digits.slice(3); // likę iki 8
      }
    } else {
      formatted += " ";
    }

    phoneInput.value = formatted;
  }

  function validatePhone() {
    clearFieldError(phoneInput);

    let digits = phoneInput.value.replace(/\D/g, "");
    if (digits.startsWith("370")) {
      digits = digits.slice(3);
    }

    // reikalavimas: 8 skaitmenys, prasidedantys 6 → +370 6xx xxxxx
    if (digits.length !== 8 || digits[0] !== "6") {
      setFieldError(
        phoneInput,
        "Numeris turi būti formato +370 6xx xxxxx."
      );
      return false;
    }

    return true;
  }

  // ---- Vertinimų greitas patikrinimas (be klaidų žinučių) ----

  function areRatingsValid() {
    const r1 = parseInt(ratingDesignInput.value, 10);
    const r2 = parseInt(ratingExperienceInput.value, 10);
    const r3 = parseInt(ratingRecommendInput.value, 10);

    if (
      isNaN(r1) ||
      isNaN(r2) ||
      isNaN(r3) ||
      r1 < 1 || r1 > 10 ||
      r2 < 1 || r2 > 10 ||
      r3 < 1 || r3 > 10
    ) {
      return false;
    }
    return true;
  }

  // ---- Submit mygtuko įjungimas / išjungimas ----

  function updateSubmitState() {
    const allValid =
      validateFirstName() &&
      validateLastName() &&
      validateEmail() &&
      validateAddress() &&
      validatePhone() &&
      areRatingsValid();

    if (submitBtn) {
      submitBtn.disabled = !allValid;
    }
  }

  // Realus laikas – tekstiniai laukai
  firstNameInput.addEventListener("input", function () {
    validateFirstName();
    updateSubmitState();
  });

  lastNameInput.addEventListener("input", function () {
    validateLastName();
    updateSubmitState();
  });

  emailInput.addEventListener("input", function () {
    validateEmail();
    updateSubmitState();
  });

  addressInput.addEventListener("input", function () {
    validateAddress();
    updateSubmitState();
  });

  // Telefonas – formatavimas + validacija realiu laiku
  phoneInput.addEventListener("input", function () {
    formatPhone();
    validatePhone();
    updateSubmitState();
  });

  // Vertinimai – tik aktyvuoja/deaktyvuoja Submit
  [ratingDesignInput, ratingExperienceInput, ratingRecommendInput].forEach(
    (inp) => {
      inp.addEventListener("input", updateSubmitState);
    }
  );

  // ---- Pop-up uždarymas ----

  function hidePopup() {
    if (!popup) return;
    popup.classList.remove("show");
    popup.setAttribute("aria-hidden", "true");
  }

  if (popup && popupClose) {
    popupClose.addEventListener("click", hidePopup);
    popup.addEventListener("click", function (e) {
      if (e.target === popup) hidePopup();
    });
  }

  // ---- Submit apdorojimas (kai mygtukas jau aktyvus) ----

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // saugumo dėlei

    // dar kartą pasitikrinam tekstinius laukus
    const textOk =
      validateFirstName() &&
      validateLastName() &&
      validateEmail() &&
      validateAddress() &&
      validatePhone();

    if (!textOk) {
      hidePopup();
      updateSubmitState();
      return;
    }

    // 2) pilna vertinimų 1–10 validacija su klaidomis
    const data = {
      firstName: firstNameInput.value.trim(),
      lastName: lastNameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      address: addressInput.value.trim(),
      ratingDesign: parseInt(ratingDesignInput.value, 10),
      ratingExperience: parseInt(ratingExperienceInput.value, 10),
      ratingRecommend: parseInt(ratingRecommendInput.value, 10),
    };

    const errors = [];

    ["ratingDesign", "ratingExperience", "ratingRecommend"].forEach(
      (key, index) => {
        const value = data[key];
        if (isNaN(value) || value < 1 || value > 10) {
          errors.push(
            `Klausimas ${index + 1}: įvertinimas turi būti tarp 1 ir 10.`
          );
        }
      }
    );

    if (errors.length > 0) {
      resultBox.innerHTML = `
        <div class="alert-danger">
          <strong>Klaidos:</strong><br>
          ${errors.join("<br>")}
        </div>
      `;
      resultBox.classList.add("visible");
      hidePopup();
      updateSubmitState();
      return;
    }

    // 3) Vidurkis iš trijų klausimų
    const average =
      (data.ratingDesign + data.ratingExperience + data.ratingRecommend) / 3;
    const averageFormatted = average.toFixed(1);

    // 4) Konsolė
    console.log("Kontaktų formos duomenys:", data);
    console.log("Vertinimų vidurkis:", averageFormatted);

    // 5) Rezultatai po forma
    resultBox.innerHTML = `
      <p><strong>Vardas:</strong> ${data.firstName}</p>
      <p><strong>Pavardė:</strong> ${data.lastName}</p>
      <p><strong>El. paštas:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
      <p><strong>Tel. numeris:</strong> ${data.phone}</p>
      <p><strong>Adresas:</strong> ${data.address}</p>
      <hr>
      <p><strong>Dizaino įvertinimas:</strong> ${data.ratingDesign} / 10</p>
      <p><strong>Patirties įvertinimas:</strong> ${data.ratingExperience} / 10</p>
      <p><strong>Rekomendacijos tikimybė:</strong> ${data.ratingRecommend} / 10</p>
      <hr>
      <p><strong>${data.firstName} ${data.lastName}:</strong> ${averageFormatted}</p>
    `;

    resultBox.classList.add("visible");

    // 6) Sėkmingo pateikimo pop-up
    if (popup) {
      popup.classList.add("show");
      popup.setAttribute("aria-hidden", "false");
    }
  });

  // pradinis Submit būsenos atnaujinimas
  updateSubmitState();
});

// ------------------------------------------------------
// MANO ŽAIDIMAS – atminties kortelių žaidimas
// ------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const board = document.getElementById("game-board");
  const movesSpan = document.getElementById("game-moves");
  const matchesSpan = document.getElementById("game-matches");
  const totalPairsSpan = document.getElementById("game-total-pairs");
  const messageBox = document.getElementById("game-message");
  const difficultySelect = document.getElementById("game-difficulty");
  const startBtn = document.getElementById("game-start");
  const resetBtn = document.getElementById("game-reset");

  // papildomi rodikliai – laikmatis ir geriausi rezultatai
  const timeSpan = document.getElementById("game-time");
  const bestEasySpan = document.getElementById("game-best-easy");
  const bestHardSpan = document.getElementById("game-best-hard");

  if (!board || !movesSpan || !matchesSpan || !totalPairsSpan) return;

  // 2.a – duomenų rinkinys (min 6 unikalūs elementai) – čia 8 Hello Kitty paveikslėliai
  const cardImages = [
    "assets/img/game/kitty1.png",
    "assets/img/game/kitty2.png",
    "assets/img/game/kitty3.png",
    "assets/img/game/kitty4.png",
    "assets/img/game/kitty5.png",
    "assets/img/game/kitty6.png",
    "assets/img/game/kitty7.png",
    "assets/img/game/kitty8.png",
    "assets/img/game/kitty9.png",
    "assets/img/game/kitty10.png",
    "assets/img/game/kitty11.png",
    "assets/img/game/kitty12.png"
  ];

  // 3.a – 2 sudėtingumo lygiai: lengvas (4×3), sunkus (6×4)
  // čia nurodom porų skaičių ir CSS klasę tinkleliui
  const difficultySettings = {
    easy: { pairs: 6, boardClass: "board-easy" },   // 6 poros → 12 kortelių → 4×3
    hard: { pairs: 12, boardClass: "board-hard" }   // 12 porų → 24 kortelės → 6×4
  };

  // žaidimo būsena
  let currentDifficulty = "easy";
  let totalPairs = difficultySettings.easy.pairs;
  let moves = 0;
  let matches = 0;
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;

  // laikmatis
  let timerInterval = null;
  let elapsedSeconds = 0;

  // localStorage raktai
  const LS_KEY_EASY = "memory_best_easy";
  const LS_KEY_HARD = "memory_best_hard";

  // ------------------------------------------------------
  // Pagalbinės funkcijos
  // ------------------------------------------------------
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // jei porų daugiau negu turime paveikslėlių – kartojam iš naujo
  function getImagesForPairs(pairCount) {
    const result = [];
    let i = 0;
    while (result.length < pairCount) {
      result.push(cardImages[i % cardImages.length]);
      i++;
    }
    return result;
  }

  // statistika (ėjimai, poros, porų iš viso, laikas)
  function updateStats() {
    movesSpan.textContent = moves;
    matchesSpan.textContent = matches;
    totalPairsSpan.textContent = totalPairs;

    if (timeSpan) {
      timeSpan.textContent = elapsedSeconds.toString();
    }
  }

  // laikmatis
  function resetTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    elapsedSeconds = 0;
    if (timeSpan) {
      timeSpan.textContent = "0";
    }
  }

  function startTimer() {
    resetTimer();
    timerInterval = setInterval(() => {
      elapsedSeconds++;
      if (timeSpan) {
        timeSpan.textContent = elapsedSeconds.toString();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  // localStorage – geriausių rezultatų nuskaitymas
  function loadBestResults() {
    const bestEasy = localStorage.getItem(LS_KEY_EASY);
    const bestHard = localStorage.getItem(LS_KEY_HARD);

    if (bestEasySpan) {
      bestEasySpan.textContent = bestEasy ? `${bestEasy} ėj.` : "–";
    }
    if (bestHardSpan) {
      bestHardSpan.textContent = bestHard ? `${bestHard} ėj.` : "–";
    }
  }

  // palyginam ir (jei reikia) išsaugom geriausią rezultatą
  function updateBestResultIfNeeded() {
    let key, span;
    if (currentDifficulty === "easy") {
      key = LS_KEY_EASY;
      span = bestEasySpan;
    } else {
      key = LS_KEY_HARD;
      span = bestHardSpan;
    }

    const stored = localStorage.getItem(key);
    const storedNum = stored ? parseInt(stored, 10) : null;

    // jei dar nėra rezultato – arba dabartinis geresnis (mažiau ėjimų)
    if (storedNum === null || moves < storedNum) {
      localStorage.setItem(key, moves.toString());
      if (span) {
        span.textContent = `${moves} ėj.`;
      }
    }
  }

  // ------------------------------------------------------
  // Lentos generavimas
  // ------------------------------------------------------
  function clearBoard() {
    board.innerHTML = "";
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matches = 0;
    moves = 0;
    messageBox.textContent = "";
    updateStats();
  }

  function createBoard() {
    clearBoard();

    // 2.b – pagal duomenų rinkinį automatiškai sugeneruojame poras
    const imagesForLevel = getImagesForPairs(totalPairs);
    const deck = shuffle([...imagesForLevel, ...imagesForLevel]); // dvi kopijos → poros

    deck.forEach((imgPath) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "memory-card";
      card.setAttribute("data-symbol", imgPath);

      card.innerHTML = `
        <div class="card-inner">
          <div class="card-face card-front">★</div>
          <div class="card-face card-back">
            <img src="${imgPath}" alt="Hello Kitty" class="card-img">
          </div>
        </div>
      `;

      card.addEventListener("click", onCardClick);
      board.appendChild(card);
    });
  }

  // ------------------------------------------------------
  // Kortelių apvertimo ir sutapimo logika
  // ------------------------------------------------------
  function onCardClick(e) {
    const card = e.currentTarget;
    if (lockBoard) return;
    if (card.classList.contains("flipped")) return;
    if (card.classList.contains("matched")) return;

    // 4.a – paspaudus kortelė atsiverčia
    card.classList.add("flipped");

    if (!firstCard) {
      firstCard = card;
      return;
    }

    // antroji kortelė
    secondCard = card;
    lockBoard = true;
    moves++;
    updateStats();

    checkMatch();
  }

  function checkMatch() {
    const symbol1 = firstCard.getAttribute("data-symbol");
    const symbol2 = secondCard.getAttribute("data-symbol");

    if (symbol1 === symbol2) {
      // 5.a – sutapusios kortelės lieka atverstos ir tampa neaktyvios
      firstCard.classList.add("matched", "disabled");
      secondCard.classList.add("matched", "disabled");

      matches++;
      updateStats();
      resetTurn();

      // patikrinam, ar žaidimas laimėtas
      if (matches === totalPairs) {
        handleWin();
      }
    } else {
      // 5.b – nesutapusios kortelės po ~1 s apsiverčia atgal
      setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetTurn();
      }, 1000);
    }
  }

  function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  // kai žaidėjas laimi
  function handleWin() {
    stopTimer();
    messageBox.textContent = `Sveikinimai! Laimėjote per ${moves} ėjimų ir ${elapsedSeconds} s.`;
    updateBestResultIfNeeded(); // localStorage palyginimas ir išsaugojimas
  }

  // ------------------------------------------------------
  // Žaidimo paleidimas pagal pasirinktą sudėtingumą
  // ------------------------------------------------------
  function startGame() {
    const diff = difficultySelect.value || "easy";
    const settings = difficultySettings[diff] || difficultySettings.easy;

    currentDifficulty = diff;
    totalPairs = settings.pairs;

    // pritaikom tinklelį (skirtingi stulpeliai)
    board.classList.remove("board-easy", "board-hard");
    board.classList.add(settings.boardClass);

    // naujas žaidimas: nuliojam ir timer, ir lentą
    stopTimer();
    resetTimer();
    createBoard();
    updateStats();
    startTimer();
  }

  // ------------------------------------------------------
  // Įvykiai: mygtukai ir sudėtingumo keitimas
  // ------------------------------------------------------
  if (startBtn) startBtn.addEventListener("click", startGame);

  if (resetBtn) {
    resetBtn.addEventListener("click", startGame);
  }

  if (difficultySelect) {
    difficultySelect.addEventListener("change", startGame);
  }

  // Įkrovus puslapį – užkraunam geriausius rezultatus ir pradinius rodiklius
  loadBestResults();
  updateStats();
});
