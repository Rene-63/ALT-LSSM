// ==UserScript==
// @name        Personeel_Toewijzen
// @namespace   bos-ernie.leitstellenspiel.de Personalzuweisungsbutton
// @version     1.1.0
// @license     BSD-3-Clause
// @author      BOS-Ernie
// @description Voegt een knop toe voor personeelstoewijzing aan de kant van het gebouw en aan de kant van een nieuw voertuig
// @match       https://www.meldkamerspel.com/buildings/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @run-at      document-idle
// @grant       none
// @downloadURL https://github.com/Rene-63/ALT-LSSM/blob/main/Personeel_Toewijzen.users.js
// @updateURL   https://github.com/Rene-63/ALT-LSSM/blob/main/Personeel_Toewijzen.users.js
// ==/UserScript==

(function () {
  "use strict";

  function addButtonToNewVehiclesAlert() {
    const buttonGroup = document.querySelector(
      "div.alert.fade.in.alert-success > div.btn-group"
    );

    if (buttonGroup === null) {
      return;
    }

    const vehicleUrl = buttonGroup.children[0].href;

    const userIconSpan = document.createElement("span");
    userIconSpan.className = "glyphicon glyphicon-user";

    const button = document.createElement("a");
    button.className = "btn btn-default";
    button.href = vehicleUrl + "/zuweisung";
    button.appendChild(userIconSpan);

    buttonGroup.appendChild(button);
  }

  function addButtonToVehiclesOnBuildingPage() {
    const vehicleEditButtons = document.querySelectorAll(
      "a.btn.btn-default.btn-xs[href^='/vehicles/'][href$='/edit']"
    );

    vehicleEditButtons.forEach((vehicleEditButton) => {
      const vehicleUrl = vehicleEditButton.href;
      const vehicleId = vehicleUrl.split("/")[4];

      const userIconSpan = document.createElement("span");
      userIconSpan.className = "glyphicon glyphicon-user";

      const button = document.createElement("a");
      button.className = "btn btn-default btn-xs";
      button.href = `/vehicles/${vehicleId}/zuweisung`;
      button.appendChild(userIconSpan);

      vehicleEditButton.parentElement.appendChild(button);
    });
  }

  function main() {
    addButtonToNewVehiclesAlert();
    addButtonToVehiclesOnBuildingPage();
  }

  main();
})();
