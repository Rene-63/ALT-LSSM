// ==UserScript==
// @name        * Solidarprinzip
// @namespace   bos-ernie.leitstellenspiel.de
// @version     1.0.3
// @license     BSD-3-Clause
// @author      BOS-Ernie
// @description Voegt een knop toe om snel je melding uit de meldingenlijst te delen.
// @match       https://www.meldkamerspel.com/
// @icon        https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @run-at      document-idle
// @grant       none
// @downloadURL 
// @updateURL 
// ==/UserScript==

/* global missionMarkerAdd */

(function () {
  function addShareButtonToMissionList() {
    document.querySelectorAll("#mission_list .missionSideBarEntry:not(.mission_deleted)").forEach(mission => {
      if (mission.querySelector(".panel-success")) {
        return;
      }

      const missionId = mission.id.replace(/\D+/g, "");

      addShareButtonToMission(missionId);
    });
  }

  function addShareButtonToNewMissions() {
    let originalMissionMarkerAdd = missionMarkerAdd;

    missionMarkerAdd = e => {
      originalMissionMarkerAdd(e);

      if (e.alliance_id) {
        const shareButton = document.querySelector(`#share-button-${e.id}`);

        if (shareButton) {
          shareButton.remove();
        }
      }

      if (e.user_id !== user_id || e.kt === true || e.alliance_id || document.querySelector(`#share-button-${e.id}`)) {
        return;
      }

      addShareButtonToMission(e.id);
    };
  }

  function addShareButtonToMission(missionId) {
    const mission = document.querySelector(`#mission_list #mission_${missionId}`);

    if (!mission) {
      console.warn(`Mission ${missionId} not found`);
      return;
    }

    mission.querySelector("#alarm_button_" + missionId).insertAdjacentHTML(
      "afterend",
      `<a id="share-button-${missionId}" class="btn btn-default btn-xs" data-mission-id="${missionId}" title="Im Verband freigeben">
        <span class="glyphicon glyphicon-bullhorn"></span>
    </a>`,
    );
  }

  function addShareButtonEventListener() {
    document.addEventListener("click", async event => {
      const element = event.target;
      const parent = element.parentElement;

      if (!element.id.startsWith("share-button-") && !parent.id.startsWith("share-button-")) {
        return;
      }

      event.preventDefault();

      if (element.id.startsWith("share-button-")) {
        await share(element.dataset.missionId).then(() => {
          element.remove();
        });
      } else if (parent.id.startsWith("share-button-")) {
        await share(parent.dataset.missionId).then(() => {
          parent.remove();
        });
      }
    });
  }

  async function share(missionId) {
    await fetch(`/missions/${missionId}/alliance`);
  }

  function main() {
    addShareButtonToMissionList();
    addShareButtonToNewMissions();
    addShareButtonEventListener();
  }

  main();
})();
