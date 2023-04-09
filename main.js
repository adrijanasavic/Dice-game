(function () {
  let playersBox = document.querySelectorAll(".player");
  let srednji = document.querySelector(".srednji");
  let baciKockicuBtn = srednji.querySelector("#baci-kockicu");
  let sacuvajBtn = srednji.querySelector("#sacuvaj");
  let novaIgraBtn = srednji.querySelector("#nova-igra");
  let baceneKockiceBox = srednji.querySelector("#bacene-kockice");

  let registracijaBox = document.querySelector(".registracija");
  let formBox = registracijaBox.querySelector("form");
  let formBtn = formBox.querySelector("form button");
  let pobednikBox = null;

  novaIgraBtn.addEventListener("click", novaIgra);

  formBtn.addEventListener("click", validacija);

  let trenutnaIgra = {
    igrac: 0,
    nizKockica: [],
    trenutniRezultat: 0,
  };

  let kockiceSlika = {
    kocka: [
      "dice-1.png",
      "dice-2.png",
      "dice-3.png",
      "dice-4.png",
      "dice-5.png",
      "dice-6.png",
    ],
    maksimalniPoeni: 15,
  };

  function novaIgra() {
    registracijaBox.style.display = "flex";
    document.querySelector(".winner-box").remove();
  }

  function init() {
    baciKockicuBtn.addEventListener("click", baciKockicu);
    sacuvajBtn.addEventListener("click", cuvajKockicu);
    igraci.forEach((player) => {
      player.ukupno = 0;
      player.getKocka = [];
    });
    trenutnaIgra.igrac = 0;
    baceneKockiceBox
      .querySelector(".side-1 img")
      .setAttribute("src", `img/${kockiceSlika.kocka[0]}`);
    playersBox.forEach((player, index) => {
      player.querySelector("h2").innerHTML = igraci[index].ime;
      player.querySelector("h3").innerHTML = 0;
      player.querySelector("h4").innerHTML = 0;
    });
    baciKockicuBtn.style.display = "block";
    sacuvajBtn.style.display = "block";
    playersBox[0].className = "player active";
    playersBox[1].className = "player";
    registracijaBox.style.display = "none";
    baceneKockiceBox.style.display = "block";
  }

  function baciKockicu() {
    let brojKockice = null;
    baceneKockiceBox.classList.add("roll");
    brojKockice = Math.floor(Math.random() * 6);

    setTimeout(() => {
      baceneKockiceBox
        .querySelector(".side-1 img")
        .setAttribute("src", `img/${kockiceSlika.kocka[brojKockice]}`);

      baceneKockiceBox.classList.remove("roll");
      trenutnaIgra.nizKockica.push(brojKockice);
      trenutnaIgra.trenutniRezultat += brojKockice + 1;
      playersBox[trenutnaIgra.igrac].querySelector("h4").innerHTML =
        trenutnaIgra.trenutniRezultat;
      if (brojKockice === 0) {
        trenutnaIgra.nizKockica = [];
        trenutnaIgra.trenutniRezultat = 0;
        playersBox[trenutnaIgra.igrac].querySelector("h4").innerHTML =
          trenutnaIgra.trenutniRezultat;
        zameniIgraca();
      }
    }, 1000);
  }

  function cuvajKockicu() {
    igraci[trenutnaIgra.igrac].getKocka.push(trenutnaIgra.nizKockica);
    igraci[trenutnaIgra.igrac].ukupno += trenutnaIgra.trenutniRezultat;
    playersBox[trenutnaIgra.igrac].querySelector("h3").innerHTML =
      igraci[trenutnaIgra.igrac].ukupno;
    trenutnaIgra.nizKockica = [];
    trenutnaIgra.trenutniRezultat = 0;
    playersBox[trenutnaIgra.igrac].querySelector("h4").innerHTML =
      trenutnaIgra.trenutniRezultat;
    proveriPobednika();
  }

  const zameniIgraca = () => {
    if (trenutnaIgra.igrac === 0) {
      trenutnaIgra.igrac = 1;
    } else {
      trenutnaIgra.igrac = 0;
    }
    playersBox.forEach((box) => {
      box.classList.toggle("active");
    });
  };

  function proveriPobednika() {
    if (igraci[trenutnaIgra.igrac].ukupno >= kockiceSlika.maksimalniPoeni) {
      krajIgre();
    } else {
      zameniIgraca();
    }
  }

  function krajIgre() {
    baciKockicuBtn.removeEventListener("click", baciKockicu);
    sacuvajBtn.removeEventListener("click", cuvajKockicu);
    baciKockicuBtn.style.display = "none";
    sacuvajBtn.style.display = "none";
    prikaziPobednika();
  }

  function kreiranjeBox(element) {
    let div = document.createElement(element);
    return function (klasa) {
      div.className = klasa;
      return function (templateString) {
        div.innerHTML = templateString;
        return div;
      };
    };
  }

  function dobijeneKockice(kockice) {
    if (kockice.length === 0) {
      return "";
    } else {
      let kocka = kockice.shift(); 
      return (
        `<img src="img/${kockiceSlika.kocka[kocka]}" alt="" />` +
        dobijeneKockice(kockice)
      );
    }
  }

  function prikaziPobednika() {
    let pobednik = igraci[trenutnaIgra.igrac];
    let poeni = igraci[trenutnaIgra.igrac].ukupno;
    let brojIgara = igraci[trenutnaIgra.igrac].getKocka.length;

    let text = ``;
    text += `<h2>Pobednik je ${pobednik.ime}</h2>`;
    text += `Prosek je: ${(poeni / brojIgara).toFixed(2)}`;

    text += `<p>Dobijanje kockica po rundi:</p>`;
    text += `<ul>`;
    pobednik.getKocka.forEach((runda, brojIgre) => {
      text += `<li><span>${brojIgre + 1}</span>`;

      text += dobijeneKockice(runda); 

      text += `</li>`;
    });
    text += `</ul>`;
    text += `<h3>ukupno: <span>${pobednik.ukupno}</span></h3>`;

    pobednikBox = kreiranjeBox("div");
    let boxClass = pobednikBox("winner-box");
    let boxInnerHtml = boxClass(text.trim());
    baceneKockiceBox.style.display = "none";
    playersBox[trenutnaIgra.igrac].appendChild(boxInnerHtml);

    let pitaj = (pitanje, da, ne) => (confirm(pitanje) ? da() : ne());
    pitaj(
      "Da li ste uzivali u igri?",
      () => alert("Vi ste napredni programer."),
      () => alert("Nastavite sa ucenjem.")
    );
  }

  function validacija(e) {
    e.preventDefault();
    let err = [];

    let tempData = {
      playerOneName: formBox.querySelector('[name="playerOne"]'),
      playerTwoName: formBox.querySelector('[name="playerTwo"]'),
    };

    if (
      tempData.playerOneName.value === "" ||
      tempData.playerOneName.value === null
    ) {
      err.push({
        el: tempData.playerOneName,
        msg: "Unesite ime prvog igraca!",
      });
    }

    if (
      tempData.playerTwoName.value === "" ||
      tempData.playerTwoName.value === null
    ) {
      err.push({
        el: tempData.playerTwoName,
        msg: "Unesite ime drugog igraca!",
      });
    }

    if (err.length === 0) {
      igraci[0].ime = tempData.playerOneName.value.trim().toUpperCase();
      igraci[1].ime = tempData.playerTwoName.value.trim().toUpperCase();
      tempData.playerOneName.value = "";
      tempData.playerTwoName.value = "";
      init();
    } else {
      err.forEach((errors) => {
        errors.el.setAttribute("placeholder", errors.msg);
      });
    }
  }
})();
