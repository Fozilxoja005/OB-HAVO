const callApi = function (davlat_nomi) {
  SlickLoader.enable();
  return new Promise(function (resolve, reject) {
    //serverga zapros jonatish
    $.ajax({
      url: "https://weatherdbi.herokuapp.com/data/weather/" + davlat_nomi,
      type: "GET",

      success: function (data) {
        SlickLoader.disable();
        resolve(data);
      },
      error: function (error) {
        SlickLoader.disable();
        reject(error);
      },
    });
  });
};

const myFunction = async function () {
  let davlat_nomi = document.querySelector("input[name=davlat]").value;
  if (!davlat_nomi.trim()) {
    modalOpen("Davlat nomini yozing");
  } else {
    //serverga zapros jonatish
    const result = await callApi(davlat_nomi);
    const status = result.status;

    if (status === "fail") {
      modalOpen("Davlat nomini to'g'ri kiriting!");
      return;
    }

    const region = result.region;
    const next_days = result.next_days;

    let html = "";
    for (let day of next_days) {
      html += `
        <div class="col" data-aos="fade-up">
          <div class="card">
            <img src="${day.iconURL}" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${day.day}</h5>
              <p class="card-text">${day.comment}</p>
              <p class="card-text">${day.min_temp.c} - ${day.max_temp.c}</p>
            </div>
          </div>
        </div>
        
          `;
    }

    document.getElementById("davlat_nomi").innerText = region;
    document.getElementById("ob_havo").innerHTML = html;

    console.log("result: ", result);
  }
};

const modalOpen = function (message) {
  modal = $("#modal_xabar");
  modal.find(".modal-body").text(message);
  modal.modal("show");
};

$(document).ready(function () {
  NProgress.start();
  NProgress.done();
  AOS.init();
  document
    .querySelector("input[name=davlat]")
    .addEventListener("keyup", function (event) {
      if (event.keyCode === 13) {
        myFunction();
      }
    });
});